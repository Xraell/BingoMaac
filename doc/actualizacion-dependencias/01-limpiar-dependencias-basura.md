# Tarea 01 — Eliminar dependencias no utilizadas

**Riesgo:** bajo · **Depende de:** nada · **Commit:** `chore(deps): eliminar dependencias no utilizadas`

## Problema

Dos paquetes en `package.json` no aportan nada:

### `@types/react-native` (devDependency)

`expo-doctor` lo reporta explícitamente:

> The package "@types/react-native" should not be installed directly in your project, as
> types are included with the "react-native" package.

Además la versión instalada (`0.73.0`) es **superior a la última publicada** (`0.72.8`),
o sea que ni siquiera resuelve a algo real y vigente. El proyecto es JavaScript plano, sin
TypeScript configurado, así que estos tipos no los consume nadie.

### `eas` (dependency)

Paquete fantasma. La herramienta real es `eas-cli` y se usa **global**, no como dependencia
del proyecto. Todo indica un `npm install eas` accidental. El paquete `eas` en npm es un
placeholder sin relación con Expo Application Services.

`eas.json` **no depende de este paquete** y no debe tocarse.

## Pasos

```bash
npm remove @types/react-native eas
```

## Verificación

1. `package.json` ya no menciona `@types/react-native` ni `eas`:

   ```bash
   grep -E '"(@types/react-native|eas)"' package.json
   ```

   No debe devolver nada.

2. `eas.json` sigue intacto:

   ```bash
   git diff --stat eas.json
   ```

   Sin cambios.

3. `expo-doctor` ya no reporta el aviso de `@types/react-native`:

   ```bash
   npx expo-doctor
   ```

   El check *"Check dependencies for packages that should not be installed directly"* debe
   pasar. Los otros dos fallos siguen ahí — se resuelven en las tareas 02 y 04.

4. La app arranca:

   ```bash
   npx expo start --clear
   ```

## Criterio de aceptación

- Ambos paquetes fuera de `package.json` y de `package-lock.json`.
- `expo-doctor` pasa **16/18** checks (antes 15/18).
- La app compila y abre.

## Notas

Cambio de bajo riesgo: ninguno de los dos paquetes se importa desde `src/`. Si algo se
rompe, el problema estaba latente antes.
