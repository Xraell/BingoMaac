# 01 — Línea base y la red de seguridad que sí es posible

**Riesgo:** — · **Depende de:** nada · **Obligatoria**

## Objetivo

Registrar el estado de partida y generar un bundle de referencia contra el que comparar
después de cada tarea.

## Por qué

Sin tests, la única señal automática disponible es que el proyecto compile. Es poco, pero
no es nada: detecta imports rotos, sintaxis inválida, referencias a símbolos que ya no
existen y ficheros que dejaron de resolverse — que es exactamente el tipo de error que
puede introducir un refactor mecánico.

Lo que **no** detecta: cambios de comportamiento en ejecución. Un componente que deja de
renderizar, un `useEffect` que no se dispara, un estilo que desaparece. Por eso las tareas
de este plan son conservadoras.

## Pasos

### 1. Punto de retorno

```bash
git tag pre-refactor-app
```

Antes, comprobar el árbol: **hay otros agentes trabajando en este repositorio**. Si
`git status --short` muestra cambios que no hiciste tú, anótalos en `ESTADO.md` y **no los
incluyas en ningún commit de esta etapa**.

### 2. Bundle de referencia

```bash
npx expo export --platform android --output-dir <scratchpad>/exp-base --clear
```

Usar el scratchpad de la sesión, **nunca** una carpeta del proyecto — un `dist/` a medias
dentro del repo confunde a los siguientes agentes.

Anotar en `ESTADO.md`:

- Que el export termina con **código 0**.
- El **tamaño del bundle** (`.hbc`). Al redactar el plan: **5.47 MB**.

El tamaño es la métrica más útil de esta etapa: si tras quitar código muerto no baja, es
que ese código no era muerto o el bundler ya lo eliminaba.

**Ojo con la ruta:** en Git Bash, `$TMPDIR` puede resolverse a un directorio sin permisos
de escritura (`C:\Program Files\Git\...`) y el export falla con `EPERM`. Usar la ruta
absoluta del scratchpad.

### 3. Registrar la línea base

Medir y anotar en `ESTADO.md`:

| Métrica | Comando |
|---|---|
| `console.log` | `grep -rc "console.log" src --include=*.js \| grep -v ":0" \| awk -F: '{s+=$2} END {print s}'` |
| Ficheros con logs | mismo comando, `END {print NR}` |
| Líneas en `src/Utils/` | `wc -l src/Utils/*.js \| tail -1` |
| Bloques `try {` en `Utils/` | `grep -c "try {" src/Utils/*.js` |
| Ficheros `.js` en `src/` | `find src -name "*.js" \| wc -l` |
| Tamaño del bundle | del paso 2 |

Valores medidos el 2026-08-30: **47 logs en 15 ficheros**, **942 líneas** en `Utils/`,
**59 bloques `try`**, **81 ficheros**, bundle **5.47 MB**.

### 4. Crear `HALLAZGOS.md`

```markdown
# Hallazgos

Bugs y rarezas detectados durante el refactor. **No se arreglan en esta etapa.**

## Bugs
## Rarezas
## Deuda técnica
```

### 5. No tocar código

Esta tarea **no modifica `src/`**. Solo mide y documenta.

## Verificación automática

- [ ] `npx expo export` termina con **código 0**.
- [ ] El bundle `.hbc` existe y pesa aproximadamente 5.47 MB.
- [ ] `git diff --stat pre-refactor-app -- src/` está **vacío**.
- [ ] `ESTADO.md` tiene las seis métricas de la línea base.
- [ ] `HALLAZGOS.md` existe.
- [ ] El scratchpad se borró al terminar.

## Criterio de finalización

Los seis checks en verde. **Si `expo export` falla aquí, detener el plan entero**: sin la
única verificación disponible, el resto de tareas serían a ciegas.

```
refactor(01): linea base y bundle de referencia
```
