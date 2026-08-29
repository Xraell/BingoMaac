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

### 6. Verificación de compilación (tareas 01–04)

El proyecto **no tiene tests ni linter**, pero sí una verificación automática que no
requiere al usuario: compilar el bundle real.

```bash
npx expo export --platform android --output-dir <scratchpad>/exp-check --clear
```

Usa el directorio de scratchpad de la sesión, **nunca** una carpeta del proyecto. Bórralo
al terminar.

Debe completar sin errores e imprimir el bundle (`AppEntry-*.hbc`, ~5 MB) junto con los
assets de audio. Esto prueba que Metro resuelve todo el árbol de módulos — que es
justamente el riesgo de agregar, quitar o cambiar de versión una dependencia.

Prefiérelo a `npx expo start`: no se queda en primer plano, falla de forma explícita y no
necesita que nadie mire una pantalla.

**No pidas pruebas manuales al usuario en las tareas 01–04.** Toda la validación funcional
en dispositivo está concentrada en la tarea 05. Si una tarea sale sospechosa, anótalo en el
informe del paso 8 para que la 05 lo revise con atención — pero no bloquees el avance.

> **Sobre el target web:** no está disponible. Faltan `react-dom` y `react-native-web`, e
> instalarlos violaría el alcance de la etapa. Aunque estuvieran, el audio (`expo-av`),
> `AsyncStorage`, los permisos de Android y `expo-sharing` no se comportan igual en
> navegador, así que no sustituirían la prueba en dispositivo.

### 6b. Prueba manual (solo tarea 05)

La tarea 05 es la única que involucra al usuario. Ahí sí:

- Pídele que ejecute el checklist completo de
  `doc/actualizacion-dependencias/05-verificacion-final.md`.
- **Espera su confirmación explícita** antes de dar la etapa por cerrada.
- Si algo falla, usa la tabla de diagnóstico de ese documento para identificar qué tarea
  revertir. No improvises parches sobre la marcha.

### 7. Commit

En las tareas **01–04**, si el paso 5 y la compilación del paso 6 salieron bien, commitea
sin esperar al usuario. En la **05**, solo tras su confirmación.

Commitea **solo los archivos de dependencias**:

```bash
git add package.json package-lock.json
```

Nunca uses `git add -A` ni `git add .`: puede arrastrar trabajo ajeno, ya que hay otros
agentes operando sobre este repositorio. Si `git status` muestra cambios que no hiciste tú,
déjalos fuera del commit y menciónalos en el informe.

Usa el mensaje indicado en la tabla del `README.md` de la etapa. Termina el mensaje con:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

No hagas `push` salvo que el usuario lo pida.

### 8. Informar

Cierra con:

- Métricas antes → después (`expo-doctor`, total de vulnerabilidades).
- Resultado de la compilación del paso 6.
- **Señales de alerta para la tarea 05**: si esta tarea tocó paquetes de audio
  (`expo-av`), de archivos (`expo-file-system`, `expo-sharing`) o `xlsx`, dilo
  explícitamente para que la prueba manual final se enfoque ahí.
- Qué quedó pendiente y por qué.
- Cuál es la siguiente tarea.

## Notas del proyecto

- App **Expo SDK 52 / React Native 0.76** de bingo 90 bolas, JavaScript plano.
- Sin tests, sin linter, sin TypeScript. La verificación automática posible es
  `npx expo export` (compila el bundle real); la validación funcional en dispositivo se
  concentra en la tarea 05.
- Hay **otros agentes trabajando en paralelo** sobre este repositorio: nunca hagas
  `git add -A`, y revisa `git status` antes de commitear.
- Lo más frágil es el motor de partida en vivo (`PartidaEnCurso.js`) y el audio
  (`expo-av`, 5 archivos). Ante cualquier duda sobre estos, prioriza la prueba manual.
- Contexto arquitectónico completo en `CLAUDE.md`.
