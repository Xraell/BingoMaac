---
name: actualizar-dependencias
description: Ejecuta una tarea de la Etapa 1 de actualizacion de dependencias de BingoMaac, con sus verificaciones y su commit. Recibe el numero de tarea del 01 al 05.
---

# Actualización de dependencias — Etapa 1

Ejecuta una tarea documentada en `doc/actualizacion-dependencias/`.

**Argumento recibido:** `$ARGUMENTS`

## Resolución del argumento

| Argumento | Tarea |
|---|---|
| `01` o `limpiar` | Eliminar `@types/react-native` y `eas` |
| `02` o `alinear` | Alinear versiones con Expo SDK 52 |
| `03` o `audit` | Corregir vulnerabilidades transitivas |
| `04` o `xlsx` | Resolver la vulnerabilidad de `xlsx` |
| `05` o `verificar` | Verificación final y cierre de etapa |
| vacío | Mostrar estado de la etapa y sugerir la siguiente tarea pendiente |

Si el argumento no coincide con ninguna fila, no adivines: muestra esta tabla y detente.

## Procedimiento

Sigue estos pasos en orden. **No los combines ni te adelantes.**

### 1. Leer la tarea

Lee `doc/actualizacion-dependencias/<NN>-*.md`. Ese archivo es la fuente de verdad:
contiene los pasos, la verificación y el criterio de aceptación. Si contradice a esta
skill, manda el documento.

### 2. Comprobar precondiciones

- **El árbol de trabajo debe estar limpio** (`git status --short` vacío). Si hay cambios sin
  commitear, detente y avisa al usuario: cada tarea necesita su commit aislado para poder
  revertirse.
- Verifica que la tarea anterior ya esté commiteada (salvo en la 01). Si no, avisa y
  detente.

### 3. Registrar la línea base

Antes de tocar nada, captura el estado para poder comparar después:

```bash
npx expo-doctor
npm audit --registry=https://registry.npmjs.org/
```

> El registro npm de este equipo falla por HTTP plano. **Siempre** pasa
> `--registry=https://registry.npmjs.org/` en los comandos de `audit`.

### 4. Ejecutar los pasos

Ejecuta los comandos de la sección *Pasos* del documento, tal cual están.

**Prohibiciones absolutas** (rompen el alcance de la etapa):

- **Nunca** `npm audit fix --force` → instalaría `expo@57` y rompería navegación y audio.
- **Nunca** `npm update` ni actualizar a mano un `package.json` de Expo → usa
  `npx expo install`, el único que respeta la matriz del SDK.
- **Nunca** modifiques archivos de `src/` → esta etapa solo toca dependencias. Si una
  tarea parece exigirlo, detente y consulta: eso es Etapa 2.

### 5. Verificar

Ejecuta la sección *Verificación* del documento y compara contra la línea base del paso 3.

Comprobación obligatoria en toda tarea que toque paquetes:

```bash
node -e "const p=require('./package.json').dependencies; console.log(p.expo, p['react-native'])"
```

`expo` debe seguir en `52.x` y `react-native` en `0.76.x`. Si alguno saltó de major, algo
salió mal: revierte y avisa.

```bash
git checkout package.json package-lock.json && rm -rf node_modules && npm install
```

### 6. Pruebas manuales

El proyecto **no tiene tests ni linter**. Nunca declares una tarea verificada apoyándote
solo en comandos.

Pide al usuario que ejecute el checklist manual del documento y **espera su confirmación**
antes del commit. Como mínimo, en toda tarea:

```bash
npx expo start --clear
```

Y según la tarea, insiste en los flujos que toca: audio del bingo (tareas 02 y 03),
exportación a Excel (tarea 04), login en los tres roles (todas).

### 7. Commit

Con la confirmación del usuario, commitea **solo los archivos de dependencias**:

```bash
git add package.json package-lock.json
```

Usa el mensaje indicado en la tabla del `README.md` de la etapa. Termina el mensaje con:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

No hagas `push` salvo que el usuario lo pida.

### 8. Informar

Cierra con:

- Métricas antes → después (`expo-doctor`, total de vulnerabilidades).
- Qué quedó pendiente y por qué.
- Cuál es la siguiente tarea.

## Notas del proyecto

- App **Expo SDK 52 / React Native 0.76** de bingo 90 bolas, JavaScript plano.
- Sin tests, sin linter, sin TypeScript: **toda verificación funcional es manual**.
- Lo más frágil es el motor de partida en vivo (`PartidaEnCurso.js`) y el audio
  (`expo-av`, 5 archivos). Ante cualquier duda sobre estos, prioriza la prueba manual.
- Contexto arquitectónico completo en `CLAUDE.md`.
