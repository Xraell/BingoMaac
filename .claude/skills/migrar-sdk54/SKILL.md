---
name: migrar-sdk54
description: Ejecuta una tarea de la Etapa 3 de migracion de BingoMaac desde Expo SDK 52 hasta SDK 54, pasando por SDK 53. Recibe el numero de tarea del 01 al 06.
---

# Migración a Expo SDK 54 — Etapa 3

Ejecuta una tarea documentada en `doc/migracion-sdk54/`.

**Argumento recibido:** `$ARGUMENTS`

## Resolución del argumento

| Argumento | Tarea |
|---|---|
| `01` o `preparar` | Preparación y línea base |
| `02` o `sdk53` | Migrar a SDK 53 (React 19 + New Architecture) |
| `03` o `estabilizar` | Estabilizar SDK 53 y validar en dispositivo |
| `04` o `sdk54` | Migrar a SDK 54 |
| `05` o `filesystem` | Adaptar `expo-file-system` |
| `06` o `verificar` | Verificación final y cierre |
| vacío | Mostrar estado de la etapa y sugerir la siguiente pendiente |

Si el argumento no coincide, no adivines: muestra esta tabla y detente.

## Diferencia clave con la Etapa 1

En `/actualizar-dependencias` bastaba compilar el bundle porque solo cambiaban versiones de
paquetes. **Aquí no.** Cambian React (18 → 19), el runtime nativo y la arquitectura, y esos
cambios se manifiestan **en ejecución, no al compilar**.

Consecuencia: un `expo export` en verde no autoriza a avanzar. Las tareas **03 y 06 exigen
prueba en dispositivo real** y **no se pueden completar sin el usuario**.

## Procedimiento

### 1. Leer la tarea

Lee `doc/migracion-sdk54/<NN>-*.md`. Ese documento es la fuente de verdad; si contradice a
esta skill, manda el documento.

### 2. Comprobar precondiciones

- **Árbol de trabajo limpio.** Hay **otros agentes trabajando en este repositorio**: si
  `git status` muestra cambios que no hiciste tú, **detente y consulta**. En particular,
  vigila que `UrlApi` en `src/Utils/*.js` no esté apuntando a un servidor local de
  desarrollo — eso no debe llegar a un commit de migración.
- La tarea anterior debe estar commiteada (salvo en la 01).
- **Antes de la tarea 02**, verifica los dos bloqueos de entrada:

  ```bash
  grep -rn "expo-av\|material-bottom-tabs" src/
  ```

  Si aparece cualquiera de los dos, **detente**: la Etapa 2 no está completa y la migración
  romperá audio y navegación a la vez.

### 3. Registrar la línea base

```bash
npx expo-doctor
node -e "const p=require('./package.json').dependencies; console.log(p.expo, p['react-native'], p.react)"
```

### 4. Ejecutar los pasos

Sigue la sección *Pasos* del documento.

**Prohibiciones absolutas:**

- **Nunca saltes de 52 a 54 directo.** Expo solo admite subir de SDK en SDK: 52 → 53 → 54.
- **Nunca avances a la tarea 04 sin que la 03 esté verificada en dispositivo.** Mezclar dos
  saltos hace imposible el diagnóstico.
- **Nunca edites versiones de paquetes de Expo a mano** ni uses `npm update`: usa
  `npx expo install`, el único que respeta la matriz del SDK.
- **No refactorices.** En las tareas 03 y 05 se puede tocar `src/`, pero solo para reparar
  regresiones de la migración. Nada de mejoras de paso.

### 5. Verificar la compilación

```bash
npx expo export --platform android --output-dir <scratchpad>/exp-check --clear
```

Usa el scratchpad de la sesión, nunca una carpeta del proyecto, y bórralo al terminar.

Luego confirma las versiones:

```bash
node -e "const p=require('./package.json').dependencies; console.log(p.expo, p['react-native'], p.react)"
```

Deben corresponder al SDK que la tarea buscaba. Si no, algo salió mal: revierte con
`git reset --hard pre-sdk54` y avisa.

### 6. Prueba en dispositivo

**Tareas 01, 02, 04:** basta la verificación automática; puedes commitear sin el usuario.
Si la tarea sugiere una prueba rápida, pídela pero no bloquees por ella.

**Tareas 03, 05 y 06: obligatoria.** Presenta el checklist del documento, **espera
confirmación explícita** y no commitees sin ella. En la 03 insiste especialmente en el modo
automático del bingo: 20 números sin repetir es lo que demuestra que los refs sobreviven a
React 19.

Recuerda al usuario que a partir de la tarea 02 hace falta un development build (Expo Go
solo soporta el SDK más reciente):

```bash
eas build --profile development --platform android
```

### 7. Commit

Commitea solo lo que tocó la tarea:

```bash
git add package.json package-lock.json app.json doc/migracion-sdk54/
```

Si la tarea modificó `src/`, añade esos archivos de forma explícita, uno por uno.

**Nunca `git add -A` ni `git add .`**: hay otros agentes operando sobre el repositorio.

Usa el mensaje de la tabla del `README.md` de la etapa y termínalo con:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

No hagas `push` salvo que el usuario lo pida.

### 8. Informar

- Versiones antes → después (`expo`, `react-native`, `react`).
- Resultado de la compilación.
- **Riesgos que hereda la siguiente tarea** (qué mirar con lupa en la prueba manual).
- Cuál es la siguiente tarea.

## Notas del proyecto

- App de bingo 90 bolas, JavaScript plano, **sin tests ni linter**.
- El punto más frágil es `PartidaEnCurso.js`: espeja estado en refs porque los callbacks del
  `setTimeout` viven fuera del ciclo de render. **React 19 cambia refs y batching**, así que
  es el principal candidato a romperse. Regla de `CLAUDE.md`: al tocarlo, actualizar tanto
  el estado como su ref.
- Otros puntos que fallan **en silencio**: `Object.values(boleto).slice(4)` en
  `ItemMiBoleto` y el audio por `index === 0` en `ItemNro`.
- Punto de retorno de la etapa: tag `pre-sdk54`.
- Contexto arquitectónico completo en `CLAUDE.md`.
