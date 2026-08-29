# Tarea 05 — Adaptar `expo-file-system` a la nueva API

**Riesgo:** medio · **Depende de:** [04](04-migrar-sdk54.md) · **Commit:** `refactor(reportes): adaptar a la nueva api de expo-file-system`

## Problema

SDK 54 reorganiza `expo-file-system`: la API clásica pasa a `expo-file-system/legacy` y la
nueva —orientada a objetos— se vuelve la predeterminada.

## Código afectado

Ambos botones de exportación usan el mismo patrón:

- `src/components/Botones/BotonExportarReporte.js`
- `src/components/Botones/BotonExportarReporteNuevo.js`

```js
import * as FileSystem from "expo-file-system";

const fileUri = `${FileSystem.documentDirectory}${fileName}`;
await FileSystem.writeAsStringAsync(fileUri, wbout, {
  encoding: FileSystem.EncodingType.Base64,
});
await Sharing.shareAsync(fileUri, { mimeType: "..." });
```

Se apoyan en `documentDirectory`, `writeAsStringAsync` y `EncodingType.Base64`.

## Opciones

### Opción A — Import legacy (recomendada)

Cambio mínimo: una línea por archivo.

```js
import * as FileSystem from "expo-file-system/legacy";
```

El resto del código queda igual. Es la ruta de migración oficial de Expo.

**Contra:** es una API en vías de desaparición; habrá que migrarla de verdad más adelante.

### Opción B — Nueva API orientada a objetos

Más futura, pero exige reescribir la escritura de archivos en ambos botones y probar de
nuevo el flujo completo de reportes.

### Decisión

**Opción A.** El objetivo de esta etapa es llegar a SDK 54 con la app funcionando, no
modernizar APIs. Adoptar la nueva API es trabajo de refactorización y merece su propia
tarea, con su propia validación.

Registrar la Opción B como deuda técnica en la [tarea 06](06-verificacion-final.md).

## Pasos

1. En ambos archivos, cambiar el import a `expo-file-system/legacy`.
2. No tocar nada más de esos archivos.

## Verificación

```bash
grep -n "expo-file-system" src/components/Botones/BotonExportarReporte*.js
```

Ambos deben importar desde `expo-file-system/legacy`.

```bash
npx expo export --platform android --output-dir <temporal> --clear
```

## Prueba en dispositivo (obligatoria)

Compilar **no** valida esto: el archivo puede generarse corrupto sin que Metro se queje.

1. Entrar como **ADMIN**.
2. Pantalla de Partida → **EXPORTAR EN EXCEL NUEVO**.
3. Se abre el diálogo de compartir y el `.xlsx` se genera.
4. **Abrir el archivo** y comprobar:
   - Encabezado con fecha, hora y número de partida.
   - Grilla de boletos en 10 columnas.
   - Bloque *RESUMEN DE PARTIDA* con totales y monto recaudado.
5. Repetir con el botón anterior (`BotonExportarReporte`).

## Criterio de aceptación

- Ambos botones importan desde `expo-file-system/legacy`.
- Los dos reportes se generan y abren bien en Excel.
- Sin más cambios en `src/` que los dos imports.

## Notas

Si el `.xlsx` sale corrupto, sospechar del manejo de base64: la codificación es lo primero
que cambia entre la API legacy y la nueva.
