---
name: blindar-app
description: Ejecuta las tareas del plan de seguridad de doc/seguridad-produccion de la app, con autoverificacion y prueba en dispositivo. Usar cuando se pida migrar la sesion a tokens, guardar el token cifrado, ejecutar una tarea del plan de seguridad de la app o consultar su estado.
---

# Blindar la app

Ejecuta el plan de `doc/seguridad-produccion/`: la app pasa de una «sesión» basada en un
identificador guardado en claro a autenticación con tokens contra el backend blindado.

## Argumento

`$ARGUMENTS` determina la variante:

| Valor | Acción |
|---|---|
| `01`–`06` | Ejecuta esa tarea concreta |
| _(vacío)_ | Continúa por la primera tarea no completada según `ESTADO.md` |
| `estado` | Muestra el progreso; no modifica nada |
| `verificar` | Re-ejecuta la verificación de la última tarea completada |
| `auditar` | Busca URLs en claro y logs sensibles; no modifica nada |
| `revertir NN` | Revierte el commit de la tarea NN |

Si el argumento no coincide, no adivines: muestra esta tabla y detente.

## Antes de ejecutar cualquier tarea

1. Leer `doc/seguridad-produccion/ESTADO.md`.
2. Leer el fichero de la tarea (`NN-*.md`) **completo**. Si contradice a esta skill,
   **manda el documento**.
3. Comprobar la dependencia del backend en la tabla de abajo. **Adelantarse rompe la app.**
4. **Árbol de trabajo limpio.** Hay **otros agentes trabajando en este repositorio**: si
   `git status` muestra cambios que no hiciste tú, **detente y consulta**. En particular,
   vigila que la URL de la API no esté apuntando a un servidor local de desarrollo — eso
   no debe llegar a un commit.

## Dependencias del backend

| App | Backend requerido | Si no está |
|---|---|---|
| 01 | ninguno | — |
| 02–03 | tarea 04 (emite tokens) | El login no devuelve token: la sesión no persiste |
| 04 | tarea 05 (rutas cerradas) | Los 403 no existen: no se pueden probar |
| 05 | tarea 07 (HTTPS y CORS) | **Despliegue conjunto** — coordinar con el usuario |

Comprobarlo de verdad antes de empezar la 02:

```bash
curl -s -X POST https://<dominio>/api/usuario/authenticarte \
  -H "Content-type: application/json" \
  -d '{"Telefono":"<tel>","Clave":"<clave>"}' | grep -q token \
  && echo "backend listo" || echo "el backend AUN NO emite tokens"
```

## Protocolo de ejecución

### 1. Comprobación previa

Verificar que las premisas de la tarea siguen siendo ciertas. Ejemplo: la tarea 01 asume
8 ficheros en `src/Utils/` con la URL repetida — contarlos con `grep`, no darlo por hecho.

Si una premisa no se cumple, **detener y reportarlo**.

### 2. Registrar la línea base

```bash
npx expo-doctor
node -e "const p=require('./package.json').dependencies; console.log(p.expo, p['react-native'], p.react)"
```

### 3. Ejecutar los pasos

**Prohibiciones absolutas:**

- **Nunca editar versiones de paquetes de Expo a mano** ni usar `npm update`: usa
  `npx expo install`, el único que respeta la matriz del SDK.
- **Nunca `git add -A` ni `git add .`**: hay otros agentes operando sobre el repositorio.
  Añadir ficheros de forma explícita, uno por uno.
- **No tocar `PartidaEnCurso.js`.** Es el componente más frágil del proyecto: espeja
  estado en refs porque los callbacks del `setTimeout` viven fuera del ciclo de render.
  Este plan no lo modifica; solo cambia el cliente HTTP que usa. Si una tarea parece
  pedir tocarlo, **es señal de que te saliste del alcance**.
- **No refactorizar.** Salvo la centralización acotada de la tarea 01, este plan no
  reordena código.

### 4. Verificar la compilación

```bash
npx expo export --platform android --output-dir <scratchpad>/exp-check --clear
```

Usa el scratchpad de la sesión, nunca una carpeta del proyecto, y bórralo al terminar.

### 5. Prueba en dispositivo

**Tarea 01:** basta la verificación automática; puedes commitear sin el usuario.

**Tareas 02, 03, 04, 05 y 06: obligatoria.** Presenta el checklist del documento,
**espera confirmación explícita** y no commitees sin ella.

Insistir especialmente en:

- **Tarea 02**: que la app **arranque** tras añadir `expo-secure-store`. Es un módulo
  nativo: hace falta un development build nuevo, y sin él falla con un error que parece
  de código y no lo es.

  ```bash
  eas build --profile development --platform android
  ```

- **Tarea 03**: guardar un token falso (`guardarToken("basura")`) y reabrir la app debe
  llevar **al login**. Es la prueba de que el agujero original está cerrado.
- **Tarea 04**: un 403 muestra mensaje y **no** cierra la sesión.
- **Tarea 05**: `adb logcat` durante un login **no** muestra contraseña ni token.

### 6. Riesgo específico: dejar a todos fuera

La tarea 03 reescribe el flujo de sesión. Si sale mal, **nadie puede entrar**. Ante
cualquier duda:

```bash
git reset --hard pre-seguridad
```

Y avisar. **No improvisar arreglos sobre un flujo de sesión roto.**

### 7. Cuidado con el modo invitado

`usuarioInvitado` tiene `Rol: "GUEST"` y **no tiene token**. Es lo que más fácilmente se
rompe en esta etapa:

- `apiFetch` **no** debe mandar `Authorization` cuando no hay token.
- Un 401 en modo invitado **no** debe mostrar «sesión expirada»: nunca hubo sesión.
- Qué ve un invitado con la API cerrada es una **decisión de producto** (tarea 04):
  plantearla, no tomarla.

Y ojo con `AsyncStorage.clear()`: `ModalInicioPartida.js` guarda ahí algo que no tiene
que ver con la sesión. Borrar el dato concreto, no todo.

### 8. Commit

Commitea solo lo que tocó la tarea, fichero por fichero:

```bash
git add src/config/api.js src/Utils/http.js doc/seguridad-produccion/
```

Mensaje del documento, terminado en:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

No hagas `push` salvo que el usuario lo pida.

### 9. Actualizar el estado

Marcar ✅ en `ESTADO.md` con el hash. Anotar desviaciones y decisiones tomadas.

## Qué reportar al terminar

- Qué se hizo, y versiones antes → después si cambiaron.
- Resultado de cada check, **con la evidencia**.
- Resultado de la compilación.
- Qué falta probar en dispositivo, si quedó algo.
- **Riesgos que hereda la siguiente tarea** (qué mirar con lupa en la prueba manual).
- Cuál es la siguiente tarea y qué necesita del backend.

Ser literal. Si un check falló, decirlo con su salida. Si algo no se probó, decirlo: un
informe con dos casos sin cubrir y declarados vale más que uno que afirma haberlo
probado todo.

## Límites

**No hacer sin preguntar:**

- Publicar una build a una tienda.
- `eas build --profile production` sin que el usuario lo pida.
- Cambiar el dominio de producción sin confirmarlo.
- Decidir qué ve un invitado con la API cerrada (tarea 04): es de producto.
- Desplegar la tarea 05 sin coordinar con la tarea 07 del backend.
- Tocar `PartidaEnCurso.js`.
- `git push`.
- Saltar una tarea, o darla por buena con checks en rojo o sin prueba en dispositivo.

**Fuera del alcance**, aunque se detecte: certificate pinning, detección de root,
ofuscación del bundle, biometría y recuperación de contraseña. Anotarlos en la sección
de riesgos aceptados del informe (tarea 06), no resolverlos de paso.

## Notas del proyecto

- App de bingo 90 bolas, JavaScript plano, **sin tests ni linter**. La verificación es
  `expo export` más prueba manual: no hay red de seguridad automática.
- Puntos que fallan **en silencio**: `Object.values(boleto).slice(4)` en `ItemMiBoleto` y
  el audio por `index === 0` en `ItemNro`. Si una tarea toca datos de boleto, revisarlos.
- Punto de retorno de la etapa: tag `pre-seguridad` (tarea 01).
- Contexto arquitectónico completo en `CLAUDE.md`.
