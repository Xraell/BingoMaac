# Tarea 01 — Preparación y línea base

**Riesgo:** bajo · **Depende de:** Etapa 2 completa · **Commit:** `chore: preparar migracion a sdk 54`

## Objetivo

Dejar el entorno listo y registrar el estado previo. **No se actualiza nada aquí.**

## Precondiciones (bloqueantes)

Verificar una por una. Si alguna falla, **detenerse**:

### 1. La Etapa 2 migró `expo-av`

```bash
grep -rn "expo-av" src/ ; echo "(vacio = migrado a expo-audio)"
```

`expo-av` está deprecado y desaparece en SDK 55. Si sigue en uso, volver a la Etapa 2.

### 2. La Etapa 2 migró `material-bottom-tabs`

```bash
grep -rn "material-bottom-tabs" src/ ; echo "(vacio = migrado a Paper)"
```

Exige `@react-navigation/native ^6`, incompatible con React Navigation 7 (necesario en
SDK 54). Sin esto, la navegación se rompe entera.

### 3. Node ≥ 20.19.4

```bash
node --version
```

SDK 54 lo exige. Si es menor, actualizar Node antes de seguir.

### 4. Árbol de trabajo limpio

```bash
git status --short
```

Debe estar vacío. **Ojo:** hay otros agentes trabajando en este repositorio; si aparecen
cambios ajenos (por ejemplo `UrlApi` apuntando a un servidor local en `src/Utils/`),
consultar antes de tocar nada.

### 5. La Etapa 1 está cerrada

```bash
git log --oneline | grep -c "deps"
```

## Pasos

### 1. Marcar el punto de retorno

```bash
git tag pre-sdk54
```

Es la red de seguridad de toda la etapa.

### 2. Registrar la línea base

Guardar la salida de:

```bash
npx expo-doctor
npm audit --registry=https://registry.npmjs.org/
node -e "const p=require('./package.json').dependencies; console.log(JSON.stringify(p,null,2))"
```

### 3. Confirmar que el bundle compila hoy

```bash
npx expo export --platform android --output-dir <temporal> --clear
```

Si falla **antes** de migrar, arreglarlo primero: no se arranca una migración sobre una
base rota.

### 4. Anotar el estado en este archivo

Añadir al final la sección *Línea base* con las versiones y métricas obtenidas.

## Criterio de aceptación

- Las 5 precondiciones se cumplen.
- Tag `pre-sdk54` creado.
- Línea base registrada en este documento.
- El bundle compila.

## Notas

Esta tarea no modifica dependencias; su commit solo lleva la documentación actualizada.

---

## Línea base — <completar al ejecutar>

```
Fecha:
expo:                    52.0.49
react-native:            0.76.9
react:                   18.3.1
Node:
expo-doctor:             /18
Vulnerabilidades:
Bundle compila:          si / no
```
