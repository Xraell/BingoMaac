# Tarea 03 — Corregir vulnerabilidades transitivas

**Riesgo:** bajo-medio · **Depende de:** [02](02-alinear-versiones-sdk52.md) · **Commit:** `fix(deps): corregir vulnerabilidades transitivas`

## Problema

El proyecto arrastra **39 vulnerabilidades** (3 críticas, 19 altas, 13 moderadas, 4 bajas).
Casi todas son **transitivas**: vienen de dependencias de Metro, del CLI de Expo y de
herramientas de build, no de código que la app ejecute en el dispositivo.

Críticas: `tar`, `shell-quote`, `form-data`.
Altas destacadas: `ws`, `undici`, `lodash`, `node-forge`, `minimatch`, `glob`, `nanoid`.

Solo **dos son dependencias directas**: `xlsx` (tarea 04) y `expo` (su fix propuesto es
saltar a SDK 57, fuera del alcance de esta etapa).

> **Importante:** `npm audit` falla contra el registro por HTTP plano en este equipo. Hay
> que forzar HTTPS en todos los comandos:
> `--registry=https://registry.npmjs.org/`

## Pasos

```bash
npm audit fix --registry=https://registry.npmjs.org/
```

> **Nunca usar `npm audit fix --force`.** Ese flag instalaría `expo@57`, saltando cinco
> versiones de SDK de golpe y rompiendo navegación y audio. Es exactamente lo que esta
> etapa evita.

## Verificación

1. El conteo de vulnerabilidades bajó:

   ```bash
   npm audit --registry=https://registry.npmjs.org/
   ```

   Comparar contra la línea base: **39 (3 críticas, 19 altas, 13 moderadas, 4 bajas)**.

2. **`expo` y `react-native` no cambiaron de major**:

   ```bash
   node -e "const p=require('./package.json').dependencies; console.log(p.expo, p['react-native'])"
   ```

   `expo` debe seguir en `52.x`. Si saltó a 57, `audit fix` se pasó de la raya:

   ```bash
   git checkout package.json package-lock.json && rm -rf node_modules && npm install
   ```

3. `expo-doctor` no empeoró:

   ```bash
   npx expo-doctor
   ```

4. Arranque limpio:

   ```bash
   npx expo start --clear
   ```

## Resultado esperado

Las que **no** se van a resolver aquí, y está bien:

- **`xlsx`** — sin parche en npm; es la tarea 04.
- **`expo` / `@expo/cli` / `postcss` / `cacache` / `tar`** — su único fix es SDK 57
  (Etapa 2). Son herramientas de build, no llegan al dispositivo del usuario.

## Criterio de aceptación

- El total de vulnerabilidades bajó respecto de la línea base.
- `expo` sigue en 52.x y `react-native` en 0.76.x.
- La app arranca y el login funciona.

## Notas

`npm audit fix` reescribe `package-lock.json`. Como el proyecto no tiene tests, la única
red de seguridad es el arranque manual y el commit aislado: si algo se rompe días después,
`git revert` de este commit deja el árbol como estaba.
