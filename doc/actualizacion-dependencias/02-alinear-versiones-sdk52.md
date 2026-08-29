# Tarea 02 — Alinear versiones con Expo SDK 52

**Riesgo:** bajo · **Depende de:** [01](01-limpiar-dependencias-basura.md) · **Commit:** `chore(deps): alinear versiones con Expo SDK 52`

## Problema

Nueve paquetes están por debajo de la versión que el SDK 52 espera. Son **parches dentro
del mismo SDK**, no un salto de versión mayor:

| Paquete | Instalado | Esperado por SDK 52 |
|---|---|---|
| `expo` | 52.0.17 | ~52.0.49 |
| `react-native` | 0.76.3 | 0.76.9 |
| `expo-av` | 15.0.1 | ~15.0.2 |
| `expo-clipboard` | 7.0.0 | ~7.0.1 |
| `expo-file-system` | 18.0.4 | ~18.0.12 |
| `expo-linear-gradient` | 14.0.1 | ~14.0.2 |
| `expo-linking` | 7.0.3 | ~7.0.5 |
| `expo-sharing` | 13.0.0 | ~13.0.1 |
| `expo-status-bar` | 2.0.0 | ~2.0.1 |

`expo-doctor` advierte: *"Your project may not work correctly until you install the expected
versions"*.

## Pasos

```bash
npx expo install --check
```

Confirmar cuando pregunte si quiere corregir las versiones.

> **No usar `npx expo install --fix` a ciegas** ni `npm update`. `expo install` es el único
> que respeta la matriz de compatibilidad del SDK.

## Verificación

1. Todas las versiones alineadas:

   ```bash
   npx expo install --check
   ```

   Debe reportar que no hay dependencias por actualizar.

2. `expo-doctor`:

   ```bash
   npx expo-doctor
   ```

   El check *"Check that packages match versions required by installed Expo SDK"* debe
   pasar.

3. **`expo` sigue en la línea 52.x** y `react-native` en `0.76.x`:

   ```bash
   node -e "const p=require('./package.json').dependencies; console.log(p.expo, p['react-native'])"
   ```

   Si alguno saltó a un major distinto, revertir: esta tarea **no** sube de SDK.

4. Arranque limpio:

   ```bash
   npx expo start --clear
   ```

## Pruebas manuales

`expo-file-system` y `expo-sharing` cambian de versión, y ambos sostienen la exportación de
reportes; `expo-av` sostiene todo el audio. Probar:

- **Exportar reporte** a Excel desde la pantalla de admin (se abre el diálogo de compartir).
- **Audio del bingo**: iniciar partida y cantar un número — debe sonar la locución.
- **Login** en los tres roles.

## Criterio de aceptación

- `expo install --check` sin pendientes.
- `expo-doctor` pasa **17/18** (queda solo el aviso de React Native Directory, que se
  atiende en la Etapa 2).
- Audio y exportación funcionan.

## Notas

Son versiones de parche: el riesgo de romper API es mínimo, pero `react-native` 0.76.3 →
0.76.9 toca el runtime nativo. Si usas un build de desarrollo (development build), hay que
regenerarlo; con Expo Go no aplica.
