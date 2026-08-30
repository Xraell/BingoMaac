# Estado del refactor autónomo — app

El agente actualiza este fichero al cerrar cada tarea. Consultarlo con
`/refactorizar-app estado`.

## Progreso

| # | Tarea | Estado | Commit | Notas |
|---|---|---|---|---|
| 01 | Línea base | ❌ bloqueada por entorno | — | **Obligatoria** — ver «Bloqueo» abajo |
| 02 | Limpiar logs | ⏭ no iniciada | — | Depende del check de la 01 |
| 03 | Imports y código muerto | ⏭ no iniciada | — | Depende del check de la 01 |
| 04 | Utils duplicados | ⏭ no iniciada | — | Depende del check de la 01 |
| 05 | Constantes | ⏭ no iniciada | — | Depende del check de la 01 |
| 06 | Informe | ⏭ no iniciada | — | Depende de las anteriores |

Estados: ⬜ pendiente · 🟡 en curso · ✅ completada · ❌ revertida · ⏭ saltada

## Línea base

Reconfirmado el **2026-08-30**, sesión de ejecución del plan:

- Árbol limpio al empezar (`git status --short` vacío) — no hay otros agentes con cambios
  a medio hacer.
- Tag `pre-refactor-app` **creado** en esta sesión (paso 1 de la tarea 01).
- **Sin tests y sin linter.** `package.json` solo tiene los cuatro scripts de Expo y dos
  devDependencies (`@babel/core`, `@types/react`) — confirmado.
- `console.log`: **47** en **15** ficheros — confirmado igual al valor del plan.
- `console.error`: **68** — medido esta sesión (el plan no traía esta cifra).
- `src/Utils/`: **942 líneas** — confirmado igual. Bloques `try {`: **60** (el plan
  registraba 59; diferencia de 1, no investigada, no bloquea nada).
- **81 ficheros `.js`** en `src/` — confirmado igual.
- **`npx expo export` NO se pudo ejecutar: ver «Bloqueo de entorno» abajo.** Por tanto el
  bundle de referencia (5.47 MB en el plan) **no se ha podido reproducir ni confirmar en
  esta sesión.**

## Bloqueo de entorno (tarea 01, obligatoria)

`node_modules/` no existía al empezar la sesión. Al instalar con
`pnpm install --frozen-lockfile` (sin tocar el lockfile ni las versiones — solo
materializar lo que ya estaba fijado), la instalación falla en la dependencia `xlsx`:

```
"xlsx": "https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz"
```

`pnpm` intenta descargar ese tarball y el proxy de salida del entorno lo rechaza:

```
ERR_PNPM_FETCH_403  GET https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz: Forbidden - 403
```

`curl -sS "$HTTPS_PROXY/__agentproxy/status"` confirma que es una denegación de política
de red de la organización, no un fallo transitorio: `cdn.sheetjs.com` no está en la lista
de hosts permitidos para esta sesión. La documentación del proxy (`/root/.ccr/README.md`)
es explícita: un 403/407 del proxy es una denegación de política y **no se debe
reintentar ni rodear**.

No hay forma de instalar `xlsx` desde otra fuente sin tocar `package.json` (cambiar la
versión o el origen del paquete es justo lo que este plan tiene prohibido: "no se añade,
actualiza ni elimina ningún paquete"). Sin `node_modules` completo, Metro no puede
resolver el import de `xlsx` que usan `BotonExportarReporte` / `BotonExportarReporteNuevo`,
así que `npx expo export` no puede completarse — ni siquiera para medir el bundle de
línea base.

La tarea 01 es explícita sobre este escenario: **"Si `expo export` falla aquí, detener el
plan entero: sin la única verificación disponible, el resto de tareas serían a ciegas."**
Por eso esta sesión se detiene aquí, sin tocar `src/`, y no ejecuta las tareas 02-06.

**Esto no es un hallazgo del código de la app** (por eso no va a `HALLAZGOS.md`): es una
restricción del entorno de ejecución de esta sesión concreta (política de red del proxy
de salida), no del proyecto ni de sus dependencias declaradas.

### Qué hace falta para desbloquear esta etapa

Cualquiera de estas, decidida por quien opera el entorno (no soy yo quien puede decidirlo):

- Permitir `cdn.sheetjs.com` en la política de red de la sesión, o
- Ejecutar esta skill en un entorno donde `node_modules/` ya esté instalado (p. ej. la
  máquina de desarrollo habitual, fuera de este contenedor con proxy restringido), o
- Vendorizar el tarball de `xlsx` de antemano (fuera del alcance de esta sesión: implica
  tocar cómo se resuelve una dependencia, decisión humana).

No se ha intentado ninguna de las anteriores por iniciativa propia: la primera excede lo
que esta sesión puede tocar (política de red externa), la segunda no aplica (este
contenedor es el entorno de ejecución), y la tercera cuenta como tocar dependencias, fuera
del alcance del plan.

## Zonas prohibidas

Ninguna tarea las toca. Verificado el 2026-08-30:

| Fichero | Por qué |
|---|---|
| `PartidaEnCurso.js` | **39 usos de refs**; el estado se espeja para los `setTimeout`. Solo se le quitan logs (tarea 02) |
| `ItemMiBoleto.js:46` | `Object.values(boleto).slice(4)` depende del orden de las claves |
| `ItemNro.js:18,84` | El audio se dispara con `index === 0` |
| `Utils/sesion.js`, `Utils/http.js` | De la etapa de seguridad, verificados en dispositivo |

## Mediciones

Se rellenan durante la ejecución; alimentan la sección 2 del informe.

| Métrica | Antes | Después |
|---|---|---|
| `console.log` | 47 | — (plan detenido en la tarea 01) |
| `console.error` | 68 | **debe quedar igual** |
| Líneas en `src/Utils/` | 942 | — |
| Bloques `try` en `Utils/` | 60 | — |
| Ficheros `.js` | 81 | — |
| Bundle | 5.47 MB (declarado en el plan, no reproducido) | — no se pudo generar |

## Aviso sobre la verificación

**Este plan no puede probar la app.** `expo export` demuestra que compila, no que funcione.
La validación real es el checklist manual de la tarea 06, que requiere emulador.

## Desviaciones

Anotar aquí cualquier apartamiento del plan escrito, con su motivo. Alimenta la
sección 3 del informe final.

- **El plan se detuvo en la tarea 01** por el bloqueo de entorno descrito arriba
  (`cdn.sheetjs.com` rechazado por la política de red de la sesión, dependencia `xlsx`
  no instalable, `expo export` no ejecutable). No es un apartamiento de diseño: es la
  consecuencia directa de la regla explícita de la tarea 01 ("si `expo export` falla
  aquí, detener el plan entero"). Ninguna tarea 02-06 se ha ejecutado. `src/` no se ha
  tocado en esta sesión.
