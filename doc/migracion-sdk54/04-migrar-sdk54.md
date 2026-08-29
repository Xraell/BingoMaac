# Tarea 04 — Migrar a Expo SDK 54

**Riesgo:** medio-alto · **Depende de:** [03](03-estabilizar-sdk53.md) · **Commit:** `feat(sdk): migrar a expo sdk 54`

## Precondición bloqueante

La [tarea 03](03-estabilizar-sdk53.md) debe estar **cerrada y verificada en dispositivo**.
Migrar sobre un SDK 53 inestable mezcla las causas de dos saltos distintos y vuelve el
diagnóstico imposible.

## Qué trae SDK 54

| Cambio | Impacto |
|---|---|
| React Native **0.81**, React **19.1** | Salto menor desde 0.79/19.0 |
| **`expo-file-system` reorganizado** | La API vieja pasa a `/legacy` → **tarea 05** |
| Metro: `metro/src/..` → `metro/private/..` | Solo si hay `metro.config.js` personalizado |
| Se elimina el soporte de JSC | Solo afecta si se fijó `jsEngine: "jsc"` |
| Reanimated v4 exige New Architecture | Solo si se usa Reanimated |
| Node ≥ 20.19.4, Xcode ≥ 16.1 | Requisitos de entorno |

La New Architecture **todavía no es obligatoria** en 54, pero sí lo será en SDK 55.

## Pasos

### 1. Subir el SDK

```bash
npx expo install expo@^54.0.0 --fix
```

### 2. Verificar versiones

```bash
node -e "const p=require('./package.json').dependencies; console.log(p.expo, p['react-native'], p.react)"
```

Esperado: `expo ~54.x`, `react-native 0.81.x`, `react 19.1.x`.

### 3. Comprobar `jsEngine`

```bash
grep -n "jsEngine" app.json ; echo "(vacio = ok, usa Hermes)"
```

Si apareciera `"jsc"`, quitarlo: SDK 54 ya no lo soporta.

### 4. Reinstalar limpio

```bash
rm -rf node_modules package-lock.json && npm install
```

### 5. Regenerar el development build

El runtime nativo cambió:

```bash
eas build --profile development --platform android
```

## Verificación

```bash
npx expo-doctor
npx expo export --platform android --output-dir <temporal> --clear
```

### Sobre `expo-file-system`

Es esperable que el bundle compile aunque la exportación de reportes esté rota: la API
vieja sigue existiendo bajo `expo-file-system/legacy`, y el import actual puede resolver a
la nueva API con firmas distintas.

**No intentar arreglarlo aquí.** Eso es la [tarea 05](05-migrar-file-system.md).

## Prueba rápida en dispositivo

No es el checklist completo (ese es la tarea 06), solo confirmar que no hay regresión
gruesa:

- [ ] La app arranca.
- [ ] Login como ADMIN.
- [ ] Iniciar partida y cantar un número: suena el audio.
- [ ] Modo automático: 5 números seguidos sin repetir.

Si algo de esto falla, es regresión de 53 → 54 y se corrige aquí antes de continuar.

## Criterio de aceptación

- `expo` en `54.x`, `react-native` en `0.81.x`, `react` en `19.1.x`.
- `expo-doctor` sin errores nuevos.
- `expo export` compila.
- La app arranca y el motor de partida responde.
- La exportación a Excel puede quedar rota — se resuelve en la tarea 05.
