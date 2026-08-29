# Tarea 02 — Migrar a Expo SDK 53

**Riesgo:** ALTO · **Depende de:** [01](01-preparacion-y-baseline.md) · **Commit:** `feat(sdk): migrar a expo sdk 53`

## Por qué pasar por 53

Expo solo permite subir **de SDK en SDK**. No existe salto directo 52 → 54: hay que pasar
por 53 y dejarlo funcionando antes de continuar.

## Qué trae SDK 53

| Cambio | Impacto en este proyecto |
|---|---|
| **React 19** | Cambia el manejo de refs y el batching → afecta `PartidaEnCurso.js` |
| React Native 0.79 | Runtime nativo nuevo |
| **New Architecture por defecto** | Cambia el puente nativo; puede alterar timers y audio |
| Metro con `package.json:exports` | Puede romper librerías con *dual package hazard* |
| Sin polyfill de `setImmediate` | Revisar si alguna librería lo usaba |
| Android `DayNight` + edge-to-edge | Puede alterar el layout (la app es `userInterfaceStyle: light`) |

## Pasos

### 1. Subir el SDK

```bash
npx expo install expo@^53.0.0 --fix
```

`--fix` alinea el resto de paquetes de Expo con la matriz del SDK 53.

### 2. Actualizar React y React Native

`expo install` debería encargarse. Confirmar:

```bash
node -e "const p=require('./package.json').dependencies; console.log(p.expo, p['react-native'], p.react)"
```

Esperado: `expo ~53.x`, `react-native 0.79.x`, `react 19.x`.

### 3. Actualizar React Navigation a v7

React 19 requiere React Navigation 7:

```bash
npx expo install @react-navigation/native@^7
```

> Los navigators deben venir ya migrados a `react-native-paper` desde la Etapa 2. Si aún
> aparece `@react-navigation/material-bottom-tabs`, **detenerse**: exige `native ^6` y el
> conflicto de peers es irresoluble.

### 4. Decidir sobre la New Architecture

Viene activada por defecto. **Recomendación: dejarla activada.** Será obligatoria en SDK 55
y desactivarla solo pospone el problema.

Si aparecen fallos difíciles de aislar, se puede desactivar temporalmente en `app.json`:

```json
{ "expo": { "newArchEnabled": false } }
```

Si se hace, **anotarlo** como deuda para la tarea 06.

### 5. Reinstalar limpio

```bash
rm -rf node_modules package-lock.json && npm install
```

## Verificación

```bash
npx expo-doctor
npx expo export --platform android --output-dir <temporal> --clear
```

Ambos deben pasar. Los errores frecuentes en este salto:

| Error | Causa | Solución |
|---|---|---|
| `Unable to resolve module` | `package.json:exports` de Metro | Actualizar la librería o añadir un resolver en `metro.config.js` |
| `setImmediate is not defined` | Polyfill eliminado | Reemplazar por `setTimeout(fn, 0)` |
| Conflicto de peers en navigation | Quedó `material-bottom-tabs` | Volver a la Etapa 2 |

## Development build

Expo Go solo soporta el SDK más reciente, así que a partir de aquí hace falta:

```bash
eas build --profile development --platform android
```

## Criterio de aceptación

- `expo` en `53.x`, `react-native` en `0.79.x`, `react` en `19.x`.
- `expo-doctor` sin errores nuevos respecto de la línea base.
- `expo export` compila.
- Sin conflictos de peer dependencies.

## Importante

**La compilación en verde NO significa que la app funcione.** Los cambios de React 19 y de
la New Architecture se manifiestan en ejecución, no en el bundle. La validación real es la
[tarea 03](03-estabilizar-sdk53.md), que es obligatoria antes de seguir a SDK 54.
