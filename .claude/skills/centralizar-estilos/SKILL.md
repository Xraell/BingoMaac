---
name: centralizar-estilos
description: Ejecuta el plan de doc/estilos-centralizados para extraer estilos duplicados a un modulo comun sin cambiar nada visual. Usar cuando se pida centralizar estilos, quitar StyleSheet duplicados o ejecutar una tarea de esa etapa. Recibe 01-04, estado o vacio.
---

# Centralizar estilos

Ejecuta el plan de `doc/estilos-centralizados/`: quitar copia-pega de estilos **sin mover
ni un píxel**.

## Argumento

| Valor | Acción |
|---|---|
| _(vacío)_ | Muestra el estado y sugiere la siguiente tarea pendiente |
| `01`–`04` | Ejecuta esa tarea y se detiene |
| `estado` | Muestra el progreso; no modifica nada |

Si el argumento no coincide, muestra esta tabla y detente.

## La regla que gobierna todo

> **Un estilo solo se extrae si su valor es byte a byte idéntico en todos los ficheros que
> lo van a compartir.**

Dos variantes que difieren en un `marginRight: 7` son **dos constantes separadas**, nunca
una. Fusionarlas es una decisión de diseño y no pertenece a esta etapa.

## La compuerta

**La tarea 01 decide si la 03 se hace.**

- 01 en verde (hay un snapshot estable) → la 03 está habilitada.
- 01 en rojo → **la 03 se cancela**, se marca ⏭ en `ESTADO.md`, y la etapa cierra con la
  02 y la 04. Eso es un cierre correcto.

**No existe hacer la 03 "con cuidado" sin snapshots.** La tarea 03 mueve estilos que sí
difieren entre ficheros, y el fallo es invisible: un modal descolocado que nadie ve hasta
abrirlo. `expo export` está bloqueado en este entorno, así que el snapshot es la única red.

La **02 no depende de la 01** y se puede hacer siempre: es segura por construcción.

## Antes de cada tarea

1. Lee el documento (`NN-*.md`) **completo**. Si contradice a esta skill, manda el documento.
2. **Comprueba el árbol.** Hay otros agentes trabajando en este repositorio: si
   `git status --short` muestra cambios que no hiciste tú, no los incluyas en ningún commit
   y anótalos en `ESTADO.md`.
3. **Reconfirma el inventario con el script de AST.** El plan se midió el 2026-08-30; si
   una clave pasó a tener más de una variante desde entonces, queda fuera de la tarea.

## Verificación

Un check es verde si **la salida coincide con lo esperado**, no si el comando no dio error.

```bash
npx jest
```

Debe pasar **sin reescribir snapshots**. Si un snapshot cambia:

- **Nunca** `--updateSnapshot` para "arreglarlo". El snapshot tiene razón; el refactor está
  mal.
- Lee el diff, que dice exactamente qué propiedad se movió.
- Revierte esa variante y sigue con la siguiente.

`npx expo export` sigue bloqueado en este entorno (`xlsx` desde `cdn.sheetjs.com`, host no
permitido — ver `doc/pruebas-automatizadas/`). Si el entorno lo permite, córrelo también.

## Límites

**No hagas nunca, aunque parezca obvio:**

- **Fusionar dos variantes distintas.** Es el error que esta etapa existe para evitar.
- Cambiar un valor: ni un píxel, ni un color, ni un `flex`.
- "Aprovechar y ordenar" las propiedades de un estilo al copiarlo, o sustituir un hex por
  su constante de `Colors.js`. Eso rompe la comprobación de hash, que es lo único que hace
  demostrable esta etapa.
- Tocar `bx`, `container`, `title` ni `modalView`. Están descartados con motivo: 21, 10, 14
  y 9 variantes respectivamente.
- Tocar las zonas prohibidas: `PartidaEnCurso.js`, `ItemMiBoleto.js`, `ItemNro.js`,
  `Utils/sesion.js`, `Utils/http.js`, `src/components/Data/`.
- Bajar de versión Paper, Jest o React para que un snapshot funcione.
- Mockear tanto que el snapshot deje de representar el componente real **sin decirlo en el
  informe**.
- Añadir, actualizar o quitar dependencias de producción.
- Arreglar bugs. Van a `HALLAZGOS.md` de la etapa de refactor.

## Commits

Un commit por tarea, con los ficheros añadidos **explícitamente, uno por uno**. Nunca
`git add -A` ni `git add .`: hay otros agentes operando sobre el repositorio.

```
refactor(estilos-NN): <descripcion>
```

En la tarea 03, los snapshots de línea base van en **un commit propio, antes** del
refactor. Sin ese commit no hay contra qué comparar.

Termina siempre con:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

No hagas `push` salvo que el usuario lo pida.

## Al terminar

Escribe el informe (tarea 04). Lo más importante **no** es lo que se centralizó: es la
**sección 3, el mapa de duplicación aparente vs real**. Sin ella, el siguiente que abra el
proyecto verá `bx` repetido 23 veces, pensará que nadie lo limpió, y lo "arreglará"
descolocando 21 pantallas.

Sé literal sobre el estado de la red de seguridad: si el snapshot está tan mockeado que su
valor es limitado, dilo. Un snapshot de mocks da falsa confianza.

## Notas del proyecto

- App de bingo 90 bolas, JavaScript plano, Expo SDK 52. Gestor de paquetes: **pnpm**.
- **`pnpm install --frozen-lockfile` falla** hasta que alguien con acceso a
  `cdn.sheetjs.com` corra un `pnpm install` normal una vez (falta la entrada de `xlsx` en
  el lockfile). Ver `doc/pruebas-automatizadas/README.md`.
- Jest ya está instalado (`jest-expo` + `@testing-library/react-native`), con 11 tests
  sobre `src/Utils/` y `src/constants/`. Ningún test de componente todavía.
- Paleta en `src/Theme/Colors.js`. El módulo nuevo va a `src/Theme/estilosComunes.js`.
- Contexto arquitectónico completo en `CLAUDE.md`.
