---
name: corregir-app
description: Ejecuta el plan de doc/correccion-hallazgos de la app, que arregla los bugs encontrados en la verificacion en dispositivo. Usar cuando se pida corregir esos hallazgos o arreglar los modales de agregar y retirar creditos. Recibe 01-04, estado, hallazgos o vacio.
---

# Corregir los hallazgos de la app

Ejecuta el plan de `doc/correccion-hallazgos/`: **arregla el bug de créditos reproducido en
dispositivo**. No es un refactor.

Diseñada para correr sola, sin supervisión y sin la máquina del usuario. No hay a quién
preguntar.

## Argumento

| Valor | Acción |
|---|---|
| _(vacío)_ | **Modo continuo**: todas las tareas pendientes, una tras otra, sin parar |
| `01`–`04` | Solo esa tarea |
| `estado` | Muestra el progreso; no modifica nada |
| `hallazgos` | Muestra `HALLAZGOS.md`; no modifica nada |

Si el argumento no coincide, muestra esta tabla y detente.

## La regla que gobierna todo

Las etapas de refactor y de estilos prohibían cambiar comportamiento. **Aquí es justo lo
que se hace.** Por eso la regla es más estricta, no más laxa:

> **Cada cambio altera exactamente un comportamiento, el descrito en su tarea, y ninguno más.**

Si al arreglar un bug ves otro, va a `HALLAZGOS.md`.

## Lo que hace difícil esta etapa

Hay red de seguridad —32 tests, 21 snapshots, `expo export`— pero **nadie puede abrir la
app**. Los tests demuestran que la petición sale bien formada; **no** que el crédito se
abone.

Consecuencia práctica: **todo cambio que no puedas cubrir con un test va al checklist
manual del informe.** Y sé conservador: el coste de dejar algo para mañana es cero; el de
romper los modales de crédito de una app de dinero real, no.

## El indicador que no puedes ignorar

**Los 21 snapshots no deben reescribirse. Nunca. En ninguna tarea de este plan.**

Ninguno de los arreglos cambia un árbol de React: la tarea 02 toca `src/Utils/`, la 03
cambia el texto de un `Alert` (que no se renderiza en el árbol). **Si un snapshot cambia,
tocaste algo de más** — revierte y vuelve a mirar.

No pases `-u` ni `--updateSnapshot` en ninguna circunstancia.

## Zonas prohibidas

Heredadas de las etapas anteriores. **No tocar**, aunque parezca mejorable:

| Fichero | Por qué |
|---|---|
| `src/components/Conjunto/PartidaEnCurso.js` | 39 usos de refs que espejan estado |
| `src/components/Items/ItemMiBoleto.js` | `Object.values(boleto).slice(4)` depende del orden de claves |
| `src/components/Items/ItemNro.js` | El audio se dispara con `index === 0` |
| `src/components/Data/` | Tablas indexables dinámicamente |
| `src/Utils/sesion.js`, `src/Utils/http.js` | Verificados en dispositivo. Este plan **no** los modifica: los usa |

**Excepción única y acotada:** la tarea 03 cambia el texto del mensaje de error en
`ModalAgregarCredito.js` y `ModalRetirarCredito.js`. Solo esa línea, solo esos dos ficheros.

Los tres primeros **fallan en silencio**: no lanzan error, hacen otra cosa.

## Modo continuo: cómo no detenerse

1. Lee `ESTADO.md`, localiza la primera tarea pendiente.
2. Ejecútala siguiendo su documento.
3. Verifica **todos** los checks.
4. **Pase lo que pase, decide y sigue.** No preguntes.
5. Actualiza `ESTADO.md` y pasa a la siguiente.

### Cuando algo falla

| Situación | Qué haces |
|---|---|
| `npx jest` falla | Revierte esa tarea, ❌ con la salida, **continúa** |
| **Un snapshot cambia** | Revierte. Es señal de que tocaste algo de más. **Nunca `-u`** |
| `expo export` falla | Revierte, ❌, continúa |
| Un comando falla por entorno | ⏭ con el motivo, continúa |
| **El bug no se reproduce** | ⏭. Alguien lo arregló antes. **No inventes el arreglo** |
| **La tarea 01 falla** | **Detente del todo.** Sin red no se cambia comportamiento a ciegas |
| **La tarea 03 encuentra un tercer llamante** | ⏭. Su razonamiento de seguridad depende de que solo llamen los dos modales |
| Encuentras otro bug | `HALLAZGOS.md`, no lo arregles, sigue |
| Dudas si algo es visible para el usuario | Si no lo pide su tarea, **no lo hagas** |

La 03 depende de la 02: si la 02 se revierte, **salta la 03** — cambiaría el manejo de
errores de una llamada que sigue rota.

### Revertir bien

```bash
git checkout -- src/
git clean -fd src/
```

Nunca `git reset --hard` a un commit anterior: borrarías tareas ya commiteadas. Nunca
toques los tags (`pre-refactor-app`, `pre-estilos`, `pre-correccion-app`).

## Antes de cada tarea

1. Lee el documento (`NN-*.md`) **entero**. Si contradice a esta skill, manda el documento.
2. **Comprueba el árbol.** Hay **otros agentes en este repositorio**: si `git status --short`
   muestra cambios que no hiciste tú, **no los incluyas en ningún commit** y anótalos.
3. **Reconfirma las premisas con comandos.** El plan se escribió el 2026-08-30. La tarea 03
   en particular **exige** reconfirmar por `grep` quién llama a las funciones de crédito.

## Verificación

Un check es verde si **la salida coincide con lo esperado**, no si el comando no dio error.

Al terminar cada tarea:

```bash
npx jest
```

```bash
npx expo export --platform android --output-dir <scratchpad>/exp-check --clear
```

`jest`: **32+ tests, 21 snapshots, ninguno reescrito.** `expo export`: código 0, bundle sin
crecer respecto a la línea base (5.45 MB).

Usa el scratchpad de la sesión y **bórralo al terminar**. Nunca exportes a una carpeta del
proyecto: un `dist/` a medias confunde a los siguientes agentes.

### Notas de entorno, ya conocidas

- Gestor de paquetes: **pnpm** (`node-linker=hoisted`). Nunca `npm install`.
- `pnpm install --frozen-lockfile` puede fallar por `xlsx` (se instala desde
  `cdn.sheetjs.com`). Usa `pnpm install` a secas.
- Jest con `TypeError: ansiRegex is not a function`: copia duplicada de `ansi-regex`
  anidada, no un bug del código. `rm -rf node_modules && pnpm install`.
- En Git Bash, `$TMPDIR` puede resolverse a una ruta sin permiso de escritura y el export
  falla con `EPERM`. Usa la ruta absoluta del scratchpad.
- Tras el resumen en verde, Jest imprime `TypeError: _bezier is not a function` de un timer
  de `Animated`. **Ruido preexistente**, `exit=0`. No es un fallo y no se arregla aquí.

## Commits

Un commit por tarea:

```
fix(NN): <descripcion>
```

Termina siempre con:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

**Añade los ficheros de forma explícita, uno por uno. Nunca `git add -A` ni `git add .`** —
hay otros agentes operando. No hagas `push`: el usuario decide cuándo sube.

## Al terminar

Escribe el informe (tarea 04) y para. Lo más importante **no** es lo que se hizo: es el
**checklist de verificación manual**, porque esta etapa cambia comportamiento sin haber
abierto la app ni una vez.

Un informe que dé a entender que los créditos ya funcionan sería falso. Lo demostrado es
que la petición sale bien formada.

## Límites

**No hagas nunca, aunque parezca obvio:**

- Reescribir snapshots. Ni con `-u`, ni borrando el fichero.
- Arreglar bugs que no sean los del plan, incluidos los 7 puntos de deuda de
  `doc/PENDIENTE.md` § 2. Van a `HALLAZGOS.md`.
- Rellenar `src/config/api.js`: **nadie sabe cuál es el dominio real**. Inventarlo es peor
  que el placeholder.
- Unificar el manejo de errores del resto de `src/Utils/`. La tarea 03 toca **dos**
  funciones, y solo porque demostró que es seguro para ellas.
- Añadir validación de rango en el cliente. El servidor ya la tiene y es la que manda.
- Cambiar textos, estilos, layout o navegación fuera del mensaje de error de la tarea 03.
- Añadir, actualizar o quitar dependencias. Ni instalar un linter (recomendado, pero es su
  propia etapa).
- Migrar de SDK. Eso es `doc/migracion-sdk54/`.
- Tocar el backend (`D:\BINGO_MAAC\BACKEND`). Tiene su propio plan.
- `git push`, `git reset --hard`, borrar tags, `eas build`.

**No preguntes al usuario.** No está y su máquina puede estar apagada. Si algo exige una
decisión suya, anótalo en `HALLAZGOS.md` y sigue.

## Notas del proyecto

- App de bingo 90 bolas de **dinero real**, JavaScript plano, Expo SDK 52. Sin linter.
- El backend está cerrado con `auth:sanctum`; `src/Utils/` manda siempre el token.
- Contexto arquitectónico completo en `CLAUDE.md`.
