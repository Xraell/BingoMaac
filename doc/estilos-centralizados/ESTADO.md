# Estado de la centralización de estilos

## Progreso

| # | Tarea | Estado | Commit | Notas |
|---|---|---|---|---|
| 01 | Red de seguridad (snapshots) | ⬜ pendiente | — | **Compuerta**: decide si la 03 se hace |
| 02 | Nivel A — claves idénticas | ⬜ pendiente | — | Segura por construcción; no depende de la 01 |
| 03 | Nivel B — chrome de modal | ⬜ pendiente | — | **Solo si la 01 sale en verde** |
| 04 | Informe | ⬜ pendiente | — | |

Estados: ⬜ pendiente · 🟡 en curso · ✅ completada · ❌ revertida · ⏭ cancelada

## Línea base

Medida el **2026-08-30** sobre `claude/app-refactoring-jhfen0`, con un script de AST que
normaliza espacios en blanco y agrupa cada clave de `StyleSheet.create` por hash de su
valor.

- **59 ficheros** con `StyleSheet.create` en `src/`.
- **11 tests** en verde (`npx jest`), **0 snapshots**.
- `npx expo export` **no ejecutable** en este entorno (bloqueo de red con `xlsx`, ver
  `doc/pruebas-automatizadas/`).
- Tag sugerido antes de empezar: `pre-estilos`.

### Nivel A — provablemente idénticas (1 sola variante)

| Clave | Usos |
|---|---|
| `textStyle` | 14 |
| `Descripcion` | 9 |
| `modalText` | 9 |
| `rowItem` | 7 |
| `fecha` | 4 |
| `Encabezado` | 4 |
| `lista` | 4 |

**51 declaraciones** extraíbles sin riesgo.

### Nivel B — varias variantes, agrupable con cuidado

| Clave | Usos | Variantes | Grupo mayor |
|---|---|---|---|
| `buttonClose` | 14 | 2 | 12 |
| `button` | 16 | 5 | 12 |
| `centeredView` | 15 | 4 | 6 + 6 (difieren en `marginRight: 7`) |

### Nivel C — descartado, no centralizable

| Clave | Usos | Variantes | Por qué |
|---|---|---|---|
| `bx` | 23 | **21** | 21 estilos distintos con el mismo nombre |
| `title` | 23 | 14 | ídem |
| `container` | 10 | **10** | cada uno es único |
| `modalView` | 15 | 9 | grupo mayor de solo 3 |

## Mediciones

| Métrica | Antes | Después |
|---|---|---|
| Ficheros con `StyleSheet.create` | 59 | |
| Declaraciones duplicadas eliminadas | 0 | |
| Claves en `Theme/estilosComunes.js` | — | |
| Tests | 11 | |
| Snapshots | 0 | |

## Aviso sobre la verificación

`npx jest` prueba comportamiento, pero **un snapshot compara árboles de React, no
píxeles**. Un estilo puede aplicarse correctamente en el árbol y verse mal en pantalla. La
validación final sigue siendo el checklist manual de la tarea 04.

Además, `expo export` sigue bloqueado en este entorno: no hay ni siquiera confirmación de
que el bundle compile.

## Desviaciones

_(vacío — la etapa no ha empezado)_
