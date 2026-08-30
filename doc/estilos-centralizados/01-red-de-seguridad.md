# 01 — Red de seguridad: hacer que el snapshot testing funcione

**Riesgo:** — · **Depende de:** Jest instalado (`doc/pruebas-automatizadas/`) ·
**Es una compuerta**

## Objetivo

Conseguir que **al menos un modal de `src/components/Modales/` renderice en Jest y produzca
un snapshot estable**. Ese es el criterio de éxito completo; no hace falta más.

## Por qué es una compuerta

La tarea 03 mueve estilos entre ficheros. Un error ahí no rompe nada: simplemente descoloca
un modal, y nadie se entera hasta que alguien lo abre. Con `expo export` bloqueado en este
entorno, **el snapshot es la única forma de detectarlo**.

Si esta tarea sale bien → la 03 está habilitada.
Si sale mal → la 03 se cancela y la etapa cierra con la 02 (que es segura por construcción)
y la 04.

**No se avanza a la 03 "con cuidado" si esta tarea falla.** Ese fue exactamente el error
que la etapa de refactor no cometió y por el que dejó los estilos fuera.

## Punto de partida: lo que ya se sabe que falla

Durante la redacción del plan se intentaron cinco variantes de spike. Todas fallaron. La
cadena de errores, en orden de aparición:

1. **`expo-font` → `isLoaded`** revienta dentro de `@expo/vector-icons/createIconSet`.
   `jest-expo@52` no trae ese mock para esta combinación de versiones.
2. **Mockear `@expo/vector-icons` en la raíz no sirve.** `react-native-paper` importa el
   subpath (`@expo/vector-icons/MaterialCommunityIcons`), así que el mock de la raíz no lo
   intercepta.
3. **Mockeando `expo-font`** se pasa ese punto y aparece
   `Cannot read properties of undefined (reading 'timing')` en `Button.tsx` de Paper —
   `Animated` llega `undefined` en el `useEffect` de montaje.
4. **Envolver en `<PaperProvider>`** falla en el Provider mismo:
   `Cannot read properties of undefined (reading 'addEventListener')` en
   `react-native-paper/src/utils/addEventListener.tsx` — el módulo `Appearance` de RN no
   está mockeado.
5. **Un modal sin `Button` de Paper** (`ModalDetallesParticipante`, que solo usa `Text`)
   tampoco pasa.

Empezar por ahí ahorra rehacer el mismo camino.

## Pasos sugeridos

No hay un orden garantizado; esto es depuración de mocks. Sugerencia por orden de
probabilidad:

### 1. Crear `jest.setup.js` y registrarlo

```json
"jest": {
  "preset": "jest-expo",
  "setupFiles": ["<rootDir>/jest.setup.js"]
}
```

### 2. Atacar los mocks en este orden

- **`Appearance`** (`react-native/Libraries/Utilities/Appearance`) — es el que rompe
  `PaperProvider`, y sin Provider no hay tema, y sin tema Paper falla en cascada. Es la
  raíz probable de los errores 3 y 4.
- **`expo-font`** — `isLoaded: () => true`, `loadAsync: () => Promise.resolve()`,
  `useFonts: () => [true, null]`.
- **`@expo/vector-icons/MaterialCommunityIcons`** por subpath, no la raíz.
- Si Paper sigue peleando, evaluar `jest.mock("react-native-paper", ...)` parcial con
  `requireActual`, aunque eso degrada el valor del snapshot (estaríamos fotografiando
  mocks, no el componente real). **Si se llega a ese punto, anotarlo como limitación seria
  del snapshot en el informe.**

### 3. Probar con el modal más simple primero

`ModalCodigoReferido.js` o `ModalPrecio.js` son buenos candidatos: pocos componentes de
Paper. Si el más simple no pasa, el problema es de infraestructura, no del componente.

### 4. Criterio de "snapshot estable"

No basta con que genere el fichero una vez. Hay que verificar:

```bash
npx jest            # genera el snapshot
npx jest            # segunda corrida: debe pasar, no reescribir
```

Un snapshot con timestamps, IDs aleatorios o animaciones a medias cambia entre corridas y
**no sirve como red de seguridad**: daría falsos positivos y alguien acabaría corriendo
`--updateSnapshot` por costumbre, que es peor que no tenerlo.

## Límite de esfuerzo

Esto es depuración de mocks de terceros y puede irse de las manos. **Si tras un esfuerzo
razonable no hay un snapshot estable, la tarea se cierra en rojo y no pasa nada** — la
etapa sigue con la 02, que no lo necesita. Cerrar esta tarea en rojo con la cadena de
errores bien documentada es un resultado válido y útil: le ahorra el intento al siguiente.

**No** se debe:
- Bajar de versión Paper, Jest o React para que el snapshot funcione. Eso es tocar
  dependencias de producción para satisfacer a un test.
- Mockear tanto que el snapshot deje de representar el componente real, sin decirlo.

## Verificación

- [ ] `npx jest` en verde, dos corridas seguidas, sin reescribir snapshots.
- [ ] El fichero de snapshot está commiteado (`__snapshots__/`).
- [ ] Los 11 tests previos siguen pasando.
- [ ] `jest.setup.js` no mockea nada de `src/` — solo dependencias de terceros.

## Criterio de finalización

Un modal con snapshot estable → **verde, la 03 queda habilitada**.
Ningún modal renderiza tras esfuerzo razonable → **rojo, la 03 se cancela**, y este
documento se actualiza con la cadena de errores final.

```
test(estilos-01): red de seguridad de snapshots para los modales
```
