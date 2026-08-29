# Tarea 04 — Resolver la vulnerabilidad de `xlsx`

**Riesgo:** medio · **Depende de:** [03](03-corregir-vulnerabilidades-transitivas.md) · **Commit:** `fix(deps): actualizar xlsx a version parcheada`

## Problema

```
xlsx 0.18.5 · severidad: high · fix available: NO
  - Prototype Pollution in sheetJS  (GHSA-4r6h-8v6p-xvw6)
  - SheetJS ReDoS                   (GHSA-5pgg-2g8v-p4x9)
```

**No hay fix en npm porque SheetJS dejó de publicar ahí.** La última versión en el registro
sigue siendo `0.18.5` (de 2022); las versiones parcheadas se distribuyen únicamente desde
`cdn.sheetjs.com`. `npm audit fix` no lo va a resolver nunca.

### Exposición real

Moderada. `xlsx` se usa solo para **escribir** reportes, y los datos vienen de la API propia
del proyecto, no de archivos subidos por terceros. Ambas CVE se explotan al **parsear**
entrada hostil. Aun así conviene cerrarla: es la única alta de dependencia directa que queda.

### Archivos afectados

- `src/components/Botones/BotonExportarReporte.js`
- `src/components/Botones/BotonExportarReporteNuevo.js`

Ambos usan la misma superficie mínima de la API: `utils.book_new`, `utils.json_to_sheet`,
`utils.book_append_sheet`, `write` y `ws["!cols"]`.

## Opciones

### Opción A — Tarball oficial de SheetJS (recomendada)

Mantiene la misma API; **no hay que tocar código de la app**.

```bash
npm remove xlsx
npm install https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

Contra: la dependencia deja de resolverse desde npm, lo que exige que el entorno de CI/build
tenga acceso a ese CDN.

### Opción B — Migrar a `exceljs`

Mantenido en npm y sin estas CVE, pero con **API completamente distinta**: hay que reescribir
los dos botones de exportación. Eso es refactorización — pertenece a la Etapa 2.

### Decisión

**Opción A** en esta etapa. Cierra la vulnerabilidad sin tocar lógica, que es justo el
criterio de la Etapa 1. Si más adelante el CDN resulta incómodo para los builds de EAS, se
evalúa `exceljs` en la Etapa 2.

## Verificación

1. Versión instalada:

   ```bash
   node -e "console.log(require('./node_modules/xlsx/package.json').version)"
   ```

   Debe imprimir `0.20.3` o superior.

2. La vulnerabilidad desapareció:

   ```bash
   npm audit --registry=https://registry.npmjs.org/
   ```

   `xlsx` ya no debe figurar.

3. **El código de exportación no se tocó**:

   ```bash
   git diff --stat src/
   ```

   Sin cambios en `src/`. Si aparecen, esta tarea se salió de su alcance.

## Prueba manual (obligatoria)

Esta tarea **debe** validarse a mano — es el único modo de saber que el reporte sigue bien:

1. Entrar como **ADMIN**.
2. Ir a la pantalla de Partida y pulsar **EXPORTAR EN EXCEL NUEVO**.
3. Confirmar que se abre el diálogo de compartir y que el `.xlsx` se genera.
4. **Abrir el archivo** y comprobar:
   - Encabezado con fecha, hora y número de partida.
   - La grilla de boletos en 10 columnas.
   - El bloque *RESUMEN DE PARTIDA* con totales y monto recaudado.
5. Repetir con el botón de exportación anterior (`BotonExportarReporte`).

## Criterio de aceptación

- `xlsx` ≥ 0.20.3 instalado.
- `npm audit` ya no reporta `xlsx`.
- Los dos reportes se generan y se abren correctamente en Excel.
- Cero cambios en `src/`.

## Notas

Si el tarball del CDN falla en el build de EAS, el rollback es inmediato
(`git revert`) y se pasa a evaluar la Opción B en la Etapa 2.
