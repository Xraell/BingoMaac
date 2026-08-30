# 01 — Línea base y reproducción

**Riesgo:** — · **Depende de:** nada

## Objetivo

Confirmar que la red de seguridad está verde y dejar constancia del bug **antes** de
tocarlo.

## Pasos

### 1. Instalar y verificar

```bash
pnpm install
npx jest
npx expo export --platform android --output-dir <scratchpad>/exp-base --clear
```

Anotar: número de tests, de snapshots y **tamaño del bundle** (la última medición fue
**5.45 MB**).

**Notas de entorno, ya conocidas:**

- `pnpm install --frozen-lockfile` puede fallar por `xlsx` (se instala desde
  `cdn.sheetjs.com`, fuera del registro). Usar `pnpm install` a secas.
- Si Jest falla con `TypeError: ansiRegex is not a function`, es una copia duplicada de
  `ansi-regex` anidada, no un bug del código: `rm -rf node_modules && pnpm install`.
- En Git Bash, `$TMPDIR` puede resolverse a una ruta sin permiso de escritura y el export
  falla con `EPERM`. Usar la ruta absoluta del scratchpad.
- Tras el resumen en verde, Jest imprime un `TypeError: _bezier is not a function` de un
  timer de `Animated`. Es ruido preexistente, `exit=0`. No es un fallo.

### 2. Punto de retorno

```bash
git tag pre-correccion-app
```

### 3. Dejar constancia del contrato roto

No hace falta emulador para esto:

```bash
grep -n "creditos" src/Utils/Usuario.js
grep -n "creditos" ../BACKEND/routes/api.php
```

El cliente construye `/usuario/agregar-creditos/{id}/{n}` con **GET**; el servidor declara
`POST /usuario/agregar-creditos/{id}` con `puntos` en el body. **Esa discrepancia es el
bug.** Guardar ambas salidas.

Si además hay backend levantado, reproducir el 404 con `curl` usando un token de ADMIN y la
URL que arma la app hoy. Es la prueba más directa, pero **no es obligatoria**: el par de
`grep` ya demuestra el desajuste.

## Verificación automática

- [ ] `npx jest` en verde, con las cifras anotadas.
- [ ] `npx expo export` con código 0 y el tamaño del bundle anotado.
- [ ] El tag `pre-correccion-app` existe.
- [ ] Las dos salidas de `grep` guardadas, mostrando el desajuste.

## Criterio de finalización

Los cuatro checks. **Si `jest` o `expo export` fallan antes de tocar nada, detenerse**: sin
red de seguridad no se puede cambiar comportamiento a ciegas. Anotarlo en `HALLAZGOS.md`.

Esta tarea no genera commit de código; el tag es su entregable.
