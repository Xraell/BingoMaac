# 04 — Informe y decisión sobre lo que no se tocó

**Riesgo:** — · **Depende de:** las anteriores

## Objetivo

Cerrar la etapa dejando por escrito, sobre todo, **qué NO se centralizó y por qué** — que
en esta etapa es más valioso que lo que sí.

## Por qué el foco está en lo que no se hizo

Cualquiera que abra este proyecto dentro de seis meses va a ver `bx` repetido 23 veces y
`container` 10, y va a pensar que nadie limpió eso. El informe existe para que encuentre la
respuesta antes de "arreglarlo": **no son 23 copias del mismo estilo, son 21 estilos
distintos con el mismo nombre.**

Sin ese registro, esta etapa se repite mal.

## Estructura de `INFORME.md`

### 1. Resumen

Qué nivel se completó (A, A+B, o solo A), y si la compuerta de la tarea 01 abrió o no.

### 2. Antes y después

| Métrica | Antes | Después | Comando |
|---|---|---|---|
| Declaraciones de estilo duplicadas eliminadas | 0 | | AST |
| Claves en `estilosComunes.js` | — (no existía) | | |
| Ficheros con `StyleSheet.create` | 59 | | `grep -rl "StyleSheet.create" src --include=*.js \| wc -l` |
| Tests | 11 | | `npx jest` |
| Snapshots | 0 | | |

### 3. El mapa de duplicación aparente vs real — **la sección que hay que conservar**

La tabla de variantes por clave, actualizada tras la etapa. Con la explicación explícita de
por qué `bx`, `container`, `title` y `modalView` **no son candidatos**:

| Clave | Usos | Variantes | Veredicto |
|---|---|---|---|
| `bx` | 23 | 21 | No centralizable: 21 estilos distintos con el mismo nombre |
| `title` | 23 | 14 | No centralizable |
| `container` | 10 | 10 | No centralizable: cada uno es único |
| `modalView` | 15 | 9 | Grupo mayor de solo 3; no compensa |
| ... | | | |

Y el caso `centeredView` documentado como ejemplo pedagógico: dos grupos de 6 que difieren
en `marginRight: 7`.

### 4. Estado de la red de seguridad

Si la tarea 01 salió en verde: qué mocks hicieron falta, y **si el snapshot representa el
componente real o está tan mockeado que su valor es limitado**. Esto último hay que decirlo
sin adornos: un snapshot de mocks da falsa confianza.

Si salió en rojo: la cadena de errores final, para que el siguiente no repita el camino.

### 5. Checklist de verificación manual

Sigue siendo necesaria aunque los snapshots estén en verde: **un snapshot compara árboles
de React, no píxeles.** Ordenado por lo que tocó la etapa:

- [ ] Abrir cada modal modificado y confirmar que se ve centrado igual que antes.
- [ ] La X de cerrar sigue en la esquina superior derecha en los 12 modales del grupo
      mayoritario.
- [ ] `ModalBoleto` y `ModalBoletoGanador` — su X **no** está posicionada en absoluto;
      confirmar que sigue donde estaba.
- [ ] Los 6 modales con `marginRight: 7` siguen con su margen; los otros 6 sin él.
      *(Si esto se ve mal, la tarea 03 fusionó variantes que no debía.)*
- [ ] `ModalPrecio` sigue apareciendo desde abajo con su overlay oscuro.

### 6. Lo que sigue pendiente

- Los niveles descartados (sección 3), con la nota de que descartarlos fue la decisión
  correcta y no una tarea a medias.
- Estilos inline en JSX — otra etapa.
- Un linter que detecte estilos muertos (`styles.foo` declarado y nunca usado). No se midió
  en esta etapa.
- Si la 01 falló: reintentarla cuando `jest-expo`/`react-native-paper` suban de versión, o
  tras la migración a SDK 54 (`doc/migracion-sdk54/`), que cambia justo esas versiones.

## Verificación

- [ ] `INFORME.md` existe con las seis secciones.
- [ ] La sección 3 (mapa de duplicación) está completa. Es el entregable de esta tarea.
- [ ] `ESTADO.md` coincide con lo que dice el informe.
- [ ] `CLAUDE.md` menciona `src/Theme/estilosComunes.js` si se creó.
- [ ] `npx jest` en verde.

## Criterio de finalización

Los cinco checks en verde.

```
docs(estilos-04): informe de cierre de la centralizacion de estilos
```
