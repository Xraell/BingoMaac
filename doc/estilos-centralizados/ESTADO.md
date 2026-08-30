# Estado de la centralización de estilos

## Progreso

| # | Tarea | Estado | Commit | Notas |
|---|---|---|---|---|
| 01 | Red de seguridad (snapshots) | ✅ **verde** | — | **La compuerta abrió**: 12 modales con snapshot estable. La 03 queda habilitada |
| 02 | Nivel A — claves idénticas | ⬜ pendiente | — | Segura por construcción; no depende de la 01 |
| 03 | Nivel B — chrome de modal | ⬜ pendiente | — | **Habilitada** por la 01 |
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

## Mediciones

| Métrica | Antes | Después |
|---|---|---|
| Ficheros con `StyleSheet.create` | 59 | |
| Declaraciones duplicadas eliminadas | 0 | |
| Claves en `Theme/estilosComunes.js` | — | |
| Tests | 11 | **23** (+12 snapshots de modal) |
| Snapshots | 0 | **12** |

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
- **Se cubrieron los 12 modales de la tarea 03, no "al menos uno".** El criterio de la
  compuerta era un solo modal con snapshot estable. Como la infraestructura resultó barata,
  se extendió a los 12 que la tarea 03 va a tocar, que es lo que de verdad necesita como
  línea base.
