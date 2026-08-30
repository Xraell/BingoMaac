# Etapa — Introducir un framework de pruebas

BingoMaac no tenía tests ni linter. Todas las etapas anteriores (actualización de
dependencias, seguridad, refactor) lo señalan como la carencia más importante del
proyecto: sin tests, la única red de seguridad automática es "¿compila?" — eso no
detecta un cambio de comportamiento, solo un error de sintaxis o un módulo que no
resuelve.

Esta etapa agrega **Jest** (con el preset `jest-expo`) y **`@testing-library/react-native`**,
y deja tests de ejemplo corriendo de verdad sobre las funciones puras de `src/Utils/` — el
código que más se tocó en el refactor reciente (tarea 04, unificación de los patrones de
red) y el que más se beneficia de tener una regresión automática real.

## Por qué ahora

Se decidió durante `doc/refactor-autonomo/`, al no poder verificar en ejecución ninguna de
sus tareas (bloqueo de red con la dependencia `xlsx`, ver más abajo). Instalar
dependencias nuevas y tocar la configuración de Babel es justo lo que esa etapa evitaba
por no tener supervisión — pero aquí el usuario está presente y lo pidió explícitamente,
así que las reglas de "no tocar dependencias" no aplican a esta etapa.

## Bloqueo de red conocido (heredado de la sesión de refactor)

`xlsx` (dependencia de producción) se instala desde un tarball en `cdn.sheetjs.com`, no
desde el registro de npm — decisión de `doc/actualizacion-dependencias/04-resolver-xlsx.md`
para cerrar una vulnerabilidad sin fix en npm. La política de red de este entorno de
ejecución bloquea ese host, así que **cualquier `pnpm install` que incluya `xlsx` falla**,
incluido instalar una dependencia de desarrollo nueva como Jest.

Para poder instalar Jest en esta sesión se quitó `xlsx` de `package.json` temporalmente,
se instaló todo lo demás, se agregaron las dependencias de testing, y se restauró la línea
de `xlsx` a mano. **Consecuencia: `pnpm-lock.yaml` no tiene entrada para `xlsx`** hasta que
alguien con acceso normal a internet corra `pnpm install` una vez — ahí se regenera sola.
Mientras tanto, `pnpm install --frozen-lockfile` fallará para cualquiera que lo use en este
estado. Ver el commit de esta etapa para el detalle exacto.

## Alcance

- Instalar `jest`, `jest-expo`, `@testing-library/react-native`, `react-test-renderer`
  como `devDependencies`.
- Configurar Jest (preset `jest-expo`, que trae los mocks de React Native/Expo) y un script
  `test` en `package.json`.
- Tests de ejemplo sobre los `crearObjeto*` de `src/Utils/` (funciones puras, sin red, sin
  módulos nativos) para probar que el setup funciona de punta a punta.
- **No** se migran los componentes existentes a tests todavía, ni se toca lógica de la app.
  Eso es trabajo futuro, ahora ya con herramienta para hacerlo con confianza.

## Qué quedó instalado

Versiones fijadas a mano, no las últimas del registro — **las últimas de cada paquete
piden React 19 / React Native ≥0.78**, y este proyecto está en React 18.3.1 / RN 0.76.9
(Expo SDK 52). Un primer intento con `pnpm add -D jest-expo jest @testing-library/react-native
react-test-renderer` (sin versión) instaló `jest-expo@57`, `@testing-library/react-native@14`
y `react-test-renderer@19` — con conflictos de peer dependencies severos. Se deshizo y se
reinstaló fijado a las versiones que sí corresponden a SDK 52:

| Paquete | Versión | Por qué esa y no la última |
|---|---|---|
| `jest-expo` | `52.0.6` | Última de la serie 52.x — su `react-test-renderer` interno es `18.3.1`, igual a la versión de React del proyecto |
| `jest` | `29.7.0` | La serie que `jest-expo@52` espera internamente (`babel-jest ^29.2.1`, `jest-snapshot ^29.2.1`, etc.) |
| `@testing-library/react-native` | `12.9.0` | Última de la serie 12.x — sus peers (`react >=16.8`, `react-native >=0.59`, `jest >=28`) sí cubren este proyecto. La 13/14 piden React ≥19 |
| `react-test-renderer` | `18.3.1` | Debe ser **idéntica** a la versión de `react` instalada (`18.3.1`) — es la convención de ese paquete |

Quedó un warning de peers benigno: `jest-expo` trae `react-dom`/`react-server-dom-webpack`
como dependencia (para el target web de Expo, que este proyecto no usa) pidiendo un RC de
React 19 — no afecta nada de lo que se prueba aquí (React Native, no DOM).

## Verificación

```bash
npx jest
```

3 suites, 11 tests, todos en verde. Incluye una prueba real y no cosmética: los tests de
`src/Utils/__tests__/http.test.js` (que cubren `pedirODevolverNull` y `pedirOLanzar`, los
dos ayudantes que la tarea 04 del refactor dejó sin poder probar en ejecución) se
verificaron rompiendo a propósito el código de `http.js` (`return null` → `return "roto"`)
y confirmando que el test fallaba — luego se restauró con `git checkout`. No son tests que
pasan sin importar el código.

A diferencia de `expo export`, esto sí prueba comportamiento, no solo que el bundle
resuelva — y a diferencia de `expo export`, **sí se pudo ejecutar** en esta sesión, porque
ninguno de los tests importa nada que dependa de `xlsx`.

## Notas

- Rama: `claude/app-refactoring-jhfen0` (continuación de la sesión de refactor).
- El resto de la app (componentes con `expo-av`, `xlsx`, etc.) queda sin cobertura por
  ahora — requeriría mocks más elaborados y, para `xlsx`, resolver primero el bloqueo de
  red de forma permanente (o mockear el módulo en Jest, que no necesita descargarlo).

## Para quien retome esto (humano o agente)

- **`pnpm install --frozen-lockfile` va a fallar** hasta que alguien con acceso normal a
  `cdn.sheetjs.com` corra `pnpm install` (sin flags) una vez — eso regenera la entrada de
  `xlsx` en `pnpm-lock.yaml` y el lockfile vuelve a estar completo. Es un paso único, no
  hace falta repetirlo después.
- Si sos otro agente trabajando en este repo en paralelo y tu `pnpm install
  --frozen-lockfile` falla mencionando `xlsx`: **no es tu build, es este estado conocido**.
  No lo "arregles" quitando `xlsx` de `package.json` de nuevo — avisa y esperá a que
  alguien con red completa corra el install normal.
- Próximo paso natural: mockear `xlsx` en Jest (`jest.mock("xlsx", ...)`) para poder
  probar `BotonExportarReporte`/`BotonExportarReporteNuevo` sin depender de que el paquete
  esté realmente instalado.
