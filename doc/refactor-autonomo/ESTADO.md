# Estado del refactor autónomo — app

El agente actualiza este fichero al cerrar cada tarea. Consultarlo con
`/refactorizar-app estado`.

## Progreso

| # | Tarea | Estado | Commit | Notas |
|---|---|---|---|---|
| 01 | Línea base | ⬜ pendiente | — | **Obligatoria** |
| 02 | Limpiar logs | ⬜ pendiente | — | |
| 03 | Imports y código muerto | ⬜ pendiente | — | |
| 04 | Utils duplicados | ⬜ pendiente | — | La de mayor riesgo |
| 05 | Constantes | ⬜ pendiente | — | |
| 06 | Informe | ⬜ pendiente | — | |

Estados: ⬜ pendiente · 🟡 en curso · ✅ completada · ❌ revertida · ⏭ saltada

## Línea base

Medida el **2026-08-30**, antes de empezar. A reconfirmar en la tarea 01:

- **Sin tests y sin linter.** `package.json` solo tiene los cuatro scripts de Expo y dos
  devDependencies (`@babel/core`, `@types/react`)
- Única verificación automática posible: `npx expo export --platform android`
  — **verificado que funciona**, código 0, bundle **5.47 MB**
- **47 `console.log`** en 15 ficheros; `PartidaEnCurso.js` tiene 16
- `src/Utils/`: **942 líneas** en 11 ficheros, con **59 bloques `try`** y 35 `return null`
- **81 ficheros `.js`** en `src/`; 59 con `StyleSheet.create`
- Expo SDK 52, React Native 0.76.9, React 18.3.1
- Punto de retorno: tag `pre-refactor-app` (lo crea la tarea 01)

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
| `console.log` | 47 | |
| `console.error` | (medir en la 01) | **debe quedar igual** |
| Líneas en `src/Utils/` | 942 | |
| Bloques `try` en `Utils/` | 59 | |
| Ficheros `.js` | 81 | |
| Bundle | 5.47 MB | |

## Aviso sobre la verificación

**Este plan no puede probar la app.** `expo export` demuestra que compila, no que funcione.
La validación real es el checklist manual de la tarea 06, que requiere emulador.

## Desviaciones

Anotar aquí cualquier apartamiento del plan escrito, con su motivo. Alimenta la
sección 3 del informe final.

_(vacío — el plan no ha empezado)_
