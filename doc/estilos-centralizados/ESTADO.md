# Estado de la centralización de estilos

## Progreso

| # | Tarea | Estado | Commit | Notas |
|---|---|---|---|---|
| 01 | Red de seguridad (snapshots) | ✅ **verde** | `6b21afc` | **La compuerta abrió**: 12 modales con snapshot estable. La 03 queda habilitada |
| 02 | Nivel A — claves idénticas | ✅ completada | `1bfa3a6` | **Sorpresa**: 37 de las 51 declaraciones eran estilos muertos |
| 03 | Nivel B — chrome de modal | ✅ completada | `03d6f95` + `HEAD` | 4 constantes, 36 declaraciones. Ninguna variante fusionada |
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

## Resultado de la tarea 01 — la compuerta abrió

**Los 12 modales que la tarea 03 va a tocar tienen snapshot estable.** Tres corridas
seguidas más `--ci` sin reescribir ninguno. Total del proyecto: **23 tests, 12 snapshots**.

### Lo que hizo falta, y lo que NO

La sorpresa: **casi todo se resolvió sin mockear nada**. La cadena de errores del spike
tenía dos causas raíz, no cinco:

**1. `PaperProvider` sin tema explícito.** Los errores de `AccessibilityInfo`, `Appearance`
y `Animated` eran todos el mismo problema. `PaperProvider` solo se suscribe a esos módulos
nativos cuando **no** recibe un tema:

```js
// react-native-paper/src/core/PaperProvider.tsx
if (!props.theme) {
  subscription = addEventListener(AccessibilityInfo, 'reduceMotionChanged', ...);
}
```

`App.js` sí le pasa un tema. El spike no. Replicar lo que hace la app real —pasar el
tema— saltea los tres efectos y no requiere ni un mock. **Es además más fiel que
mockearlos**: el componente se monta como en producción.

**2. Falta de `unmount()` entre tests.** Los modales pasaban sueltos y fallaban en grupo,
con `Animated` llegando `undefined`. Los efectos pendientes de un modal se ejecutaban
durante el test siguiente. Envolver en `renderer.act()` y desmontar lo resolvió.

**El único mock de terceros que hizo falta** está en `jest.setup.js`:

```js
jest.mock("expo-font/build/ExpoFontLoader", () => ({ ... getLoadedFonts: () => [] ... }));
```

`jest-expo@52` no trae ese mock nativo, y `@expo/vector-icons` acaba llamando a
`getLoadedFonts()`, que llega `undefined` y revienta en un `.forEach`. Se mockea el módulo
nativo, no `expo-font` entero, para que el resto de la librería siga siendo real.

Un solo mock de `src/`: `ObtenerPremiosPartida`, porque `ModalEditarPartida` la llama al
montar y necesitamos un render determinista. Con `requireActual` para el resto del módulo.

**Conclusión sobre la fidelidad del snapshot:** no está "tan mockeado que pierde valor".
Se fotografía el componente real, con el tema real de la app, y solo se sustituye un módulo
nativo de fuentes y una llamada de red.

### Se comprobó que la red realmente atrapa

No basta con que los snapshots pasen. Se rompió a propósito `marginRight: 7` → `8` en
`ModalAgregarCredito` —exactamente el fallo que esta etapa teme, el de `centeredView`— y el
snapshot lo detectó con el diff exacto:

```
-           "marginRight": 7,
+           "marginRight": 8,
```

Luego se restauró con `git checkout` y volvió a verde. **La red funciona.**

### Limitación conocida, anotada aquí a propósito

`src/test-utils/render.js` **duplica el tema de `App.js`**. Si alguien cambia el tema allí
y no aquí, los snapshots seguirían pasando con un tema viejo. Para lo que esta etapa
necesita —comparar el mismo componente antes y después de mover un estilo— da igual, porque
ambos lados de la comparación usan este mismo tema. Pero para cualquier uso futuro de estos
snapshots como prueba de fidelidad visual, **es una trampa**. Extraer el tema de `App.js` a
un módulo compartido sería un cambio pequeño y provablemente seguro; no se hizo en esta
tarea porque tocar `App.js` excede su alcance.

## Resultado de la tarea 02 — el inventario mentía, y a favor

Se reconfirmó el inventario por AST antes de tocar nada: **las 7 claves seguían teniendo una
sola variante**, las 51 declaraciones seguían ahí. Hasta aquí, el plan.

Lo que el plan no había mirado es **si alguien las usa**. Al contarlo:

| Clave | Declaraciones | Referencias `styles.X` en JSX |
|---|---|---|
| `textStyle` | 14 | **14** |
| `Descripcion` | 9 | **0** |
| `modalText` | 9 | **0** |
| `rowItem` | 7 | **0** |
| `fecha` | 4 | **0** |
| `Encabezado` | 4 | **0** |
| `lista` | 4 | **0** |

**Solo una de las siete claves se usa.** Las otras seis —37 declaraciones— son estilos
muertos: se copiaron junto con el componente y nunca se referenciaron. Eso explica por qué
eran byte a byte idénticas en todos los ficheros: nadie las ajustó nunca porque nadie las
veía.

Antes de borrarlas se descartó que hubiera acceso indirecto, que es lo único que invalidaría
el conteo por `grep`:

```bash
grep -rn "styles\["      src --include=*.js   # (ninguno)
grep -rn "\.\.\.styles"    src --include=*.js   # (ningun spread)
grep -rn "export.*styles" src --include=*.js   # (ninguno)
```

Sin acceso dinámico, sin spread y sin exportar el objeto, `styles.X` es la única forma de
llegar a una clave. Las seis son inalcanzables.

### Qué se hizo, entonces

La tarea se partió en dos mitades con garantías distintas:

1. **Extracción real (14 declaraciones).** `textStyle` → `src/Theme/estilosComunes.js`. Es
   el único caso donde había duplicación *viva*. Los 14 valores se comprobaron por hash
   contra `pre-estilos`: **14 de 14 idénticos** (`135978ef5aad`).
2. **Borrado de estilo muerto (37 declaraciones).** Las otras seis claves no se movieron a
   ningún sitio: se borraron. Meterlas en un módulo común habría sido crear código muerto
   nuevo y bien ordenado.

**Desviación consciente del plan escrito**, que asumía 51 extracciones. Se deja anotada
porque cambia lo que significan las métricas: el módulo común tiene una sola clave, no siete,
y eso es lo correcto.

### Comprobaciones

| Check | Resultado |
|---|---|
| `npx jest` | 23 tests, 12 snapshots, **sin reescribir ninguno** |
| Hash de `textStyle` vs `pre-estilos` | 14/14 idénticos |
| Propiedades CSS añadidas que no estuvieran ya borradas | **0** |
| `StyleSheet.create({})` nuevos | 0 (los 6 que hay son previos a esta etapa) |
| Imports (`StyleSheet`, `BingoColors`) que quedaran sin uso | 0 |
| Zonas prohibidas tocadas | ninguna |

Las 12 fotos de la tarea 01 pasaron sin cambios: mover `textStyle` a otro módulo no alteró
ni una propiedad del árbol renderizado. Que la red no dijera nada aquí es el resultado
esperado —esta tarea es segura por construcción—; su prueba de fuego es la 03.

### Ruido conocido en la salida de `npx jest`

Tras el resumen en verde, Jest imprime un `TypeError: _bezier is not a function` de un timer
de `Animated` que se dispara después de terminar los tests. **Es previo a esta tarea**: se
comprobó guardando los cambios en un `stash` y volviendo a correr, con el mismo resultado.
No afecta al código de salida (`exit=0`) ni a ningún test.

## Resultado de la tarea 03 — el chrome, agrupado por variante

El inventario se reconfirmó por AST y coincidía con el del plan: `buttonClose` 14 usos en 2
variantes, `button` 16 en 5, `centeredView` 15 en 4.

### Antes de mover nada: la red tenía un agujero

La cobertura se midió sobre el propio fichero `.snap`, contando qué bloques contienen cada
estilo. El resultado no era el que la tarea 01 sugería:

| Clave | Ficheros del grupo | Cubiertos por la red de la 01 |
|---|---|---|
| `centeredView` | 12 | 12 |
| `buttonClose` | 12 | **5** |
| `button` | 12 | **5** |

La causa: siete de esos modales guardan `visible` en su **propio estado**, no en una prop.
Al montarlos aparecen cerrados y el contenido del `Modal` —donde viven precisamente
`button` y `buttonClose`— nunca llega al árbol. Los cinco que sí estaban cubiertos son
exactamente aquellos a los que el test les pasa `visible={true}` desde fuera.

`centeredView` se salvaba porque es el `View` envoltorio, que se renderiza siempre. Eso
explica por qué la prueba de la tarea 01 (romper `marginRight: 7`) funcionó y aun así la red
no valía para esta tarea.

Se cerró el agujero antes de tocar código, en el commit de línea base `03d6f95`:

- **`renderizarAbierto()`** en `test-utils/render.js`: monta el modal, pulsa su botón de
  apertura con `fireEvent.press` y fotografía el resultado. Cubre los 7 autocontenidos.
- **Dos snapshots nuevos** para `ModalBoleto` y `ModalBoletoGanador`, los otros dos
  consumidores del grupo mayoritario de `button`. `ModalBoleto` necesita un mock de
  `useNavigation` (el hook exige un `NavigationContainer` por encima); el resto de
  `@react-navigation/native` sigue siendo real.

Cobertura final: **`button` 12/12, `buttonClose` 12/12, `centeredView` 6/6 en cada
variante**. Y se volvió a comprobar que la red nueva atrapa: se rompió `elevation: 2` → `3`
en `ModalCodigoReferido` —un modal que *solo* cubre la red nueva— y el snapshot lo detectó.

### Lo que se extrajo

Cuatro constantes en `src/Theme/estilosComunes.js`, 36 declaraciones retiradas:

| Constante | Reemplaza a | Ficheros |
|---|---|---|
| `botonCerrar` | `buttonClose`, variante posicionada | 12 |
| `botonModal` | `button`, variante de modal | 12 |
| `vistaCentrada` | `centeredView` sin margen | 6 |
| `vistaCentradaConMargen` | `centeredView` con `marginRight: 7` | 6 |

**Las 36 se comprobaron por hash contra `pre-estilos`, una por una: 36/36 idénticas.** Esa
comprobación es más fuerte que el snapshot para el fallo que de verdad amenaza esta tarea
—darle a un fichero la variante equivocada— porque es por fichero y es exacta.

### Lo que NO se tocó, y por qué

- **`centeredView` no se fusionó.** Dos constantes hermanas que difieren solo en
  `marginRight: 7`. Unificarlas movería 6 pantallas 7 píxeles: es una decisión de diseño,
  no un refactor.
- **`buttonClose` de `ModalBoleto`/`ModalBoletoGanador`** se queda local: su variante no
  lleva `position: "absolute"` ni coordenadas. No son "casi iguales".
- **Las otras 4 variantes de `button`** (`BotonFinalizarPartida`, `CreditosUsuario`,
  `FormularioRegistro`, `ModalMensaje`) son estilos distintos con el mismo nombre.
- **`modalView` no se tocó** (9 variantes para 15 usos). Verificado: ninguna línea añadida
  ni borrada del diff lo menciona.

### Un bug encontrado y deliberadamente no arreglado

`ModalAgregarPartida.js` y `ModalAgregarPromocion.js` usan `styles.button`, pero **ninguno
de los dos declara esa clave** — tampoco en `pre-refactor-app`. React Native ignora los
`undefined` de un array de estilos, así que el botón de cerrar de esos dos modales no lleva
el `borderRadius`/`padding`/`elevation` que llevan los otros doce.

Sustituirlo por `estilosComunes.botonModal` los "arreglaría" **y cambiaría lo que se ve en
pantalla**, que es justo lo que esta etapa tiene prohibido. Queda anotado en
`doc/refactor-autonomo/HALLAZGOS.md` para quien pueda mirar un dispositivo.

### Comprobaciones

| Check | Resultado |
|---|---|
| `npx jest --ci` | 32 tests, 21 snapshots, **0 reescritos** |
| `git diff` del `.snap` contra la línea base `03d6f95` | **vacío** |
| Hash de cada constante vs la variante que reemplaza | **36/36 idénticas** |
| `modalView` tocado | no (0 líneas en el diff) |
| Propiedades CSS añadidas que no estuvieran ya borradas | **0** |
| Zonas prohibidas tocadas | ninguna |

## Mediciones

| Métrica | Antes (`pre-estilos`) | Después |
|---|---|---|
| Ficheros con `StyleSheet.create` | 59 | 60 (+`Theme/estilosComunes.js`) |
| Declaraciones de estilo en `src/` | 330 | **248** |
| Declaraciones retiradas de componentes | 0 | **87** (50 extraídas + 37 muertas) |
| Claves en `Theme/estilosComunes.js` | — | **5** |
| Ficheros de componente que comparten estilos | 0 | 14 |
| Tests | 11 | **32** |
| Snapshots | 0 | **21** |

## Aviso sobre la verificación

`npx jest` prueba comportamiento, pero **un snapshot compara árboles de React, no
píxeles**. Un estilo puede aplicarse correctamente en el árbol y verse mal en pantalla. La
validación final sigue siendo el checklist manual de la tarea 04.

Además, `expo export` sigue bloqueado en este entorno: no hay ni siquiera confirmación de
que el bundle compile.

## Desviaciones

- **La tarea 01 resultó más fácil de lo que el plan anticipaba.** El plan la describía como
  "depuración de mocks que puede irse de las manos" y le ponía un límite de esfuerzo. En la
  práctica, la causa raíz de cuatro de los cinco fallos del spike era una sola cosa —no
  pasarle el tema a `PaperProvider`, cuando `App.js` sí se lo pasa— y se resolvió sin
  mockear nada. El plan sobrestimó el problema porque el spike original nunca miró **qué
  hace la app real**; miró solo el error.
- **La tarea 02 extrajo 14 declaraciones, no 51.** El plan contó *declaraciones idénticas*
  y dio por hecho que idéntico implicaba compartido. Seis de las siete claves no las usaba
  nadie. La medición por AST era correcta; la pregunta que faltaba hacerle era otra.
- **Se cubrieron los 12 modales de la tarea 03, no "al menos uno".** El criterio de la
  compuerta era un solo modal con snapshot estable. Como la infraestructura resultó barata,
  se extendió a los 12 que la tarea 03 va a tocar, que es lo que de verdad necesita como
  línea base.
