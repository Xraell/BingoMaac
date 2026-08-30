---
name: refactorizar-app
description: Ejecuta de forma autonoma y sin interrupciones el plan de refactor de doc/refactor-autonomo de la app, mejorando calidad interna sin cambiar nada observable. Usar cuando se pida refactorizar la app, limpiar logs, quitar codigo muerto o ejecutar una tarea del plan de refactor.
---

# Refactorizar la app

Ejecuta el plan de `doc/refactor-autonomo/`: calidad interna, sin cambiar nada observable.

**Esta skill está diseñada para correr sola, sin supervisión y sin la máquina del usuario
disponible.** No hay nadie a quien preguntar. Todo lo que sigue está pensado para eso.

## Argumento

| Valor | Acción |
|---|---|
| _(vacío)_ | **Modo continuo**: ejecuta todas las tareas pendientes, una tras otra, sin parar |
| `01`–`06` | Ejecuta solo esa tarea y se detiene |
| `estado` | Muestra el progreso; no modifica nada |
| `hallazgos` | Muestra `HALLAZGOS.md`; no modifica nada |

Si el argumento no coincide, muestra esta tabla y detente.

## Lo que hace esta etapa distinta: no hay tests

El plan hermano del backend tiene 25 tests. **Aquí no hay ninguno, ni linter.** La única
verificación automática es:

```bash
npx expo export --platform android --output-dir <scratchpad>/exp-check --clear
```

Eso prueba que **compila**, no que funcione. Los fallos de React Native aparecen en
ejecución.

Consecuencia práctica para ti: **sé más conservador de lo que te parezca necesario.** Si
dudas si un cambio es seguro, no lo hagas. El coste de dejar código mejorable es cero; el
de romper la app sin que nadie lo note hasta mañana es alto.

## La regla que gobierna todo

> **Si un cambio altera lo que el usuario ve o lo que la app envía, no pertenece a este plan.**

Ni un texto, ni un estilo, ni un orden, ni el cuerpo de una petición, ni un operador de
comparación. Ante la duda, gana la opción que menos código mueve.

## Zonas prohibidas

**No tocar nunca**, aunque el código parezca mejorable:

| Fichero | Por qué |
|---|---|
| `src/components/Conjunto/PartidaEnCurso.js` | 39 usos de refs; el estado se espeja para los `setTimeout`. **Excepción única: quitar sus `console.log` en la tarea 02** |
| `src/components/Items/ItemMiBoleto.js` | `Object.values(boleto).slice(4)` depende del orden de las claves |
| `src/components/Items/ItemNro.js` | El audio se dispara con `index === 0` |
| `src/Utils/sesion.js`, `src/Utils/http.js` | De la etapa de seguridad, verificados en dispositivo. Salvo añadir los ayudantes de la tarea 04 |
| `src/components/Data/` | Tablas de datos que pueden indexarse dinámicamente |
| `src/images/`, `src/sounds/` | Assets referenciados por `require()` |

Los tres primeros **fallan en silencio**: no lanzan error, simplemente hacen algo
distinto. Sin dispositivo no hay forma de detectarlo.

## Modo continuo: cómo no detenerse

1. Lee `ESTADO.md` y localiza la primera tarea pendiente.
2. Ejecútala siguiendo su documento.
3. Verifica.
4. **Pase lo que pase, decide y sigue.** No preguntes. No esperes.
5. Actualiza `ESTADO.md` y pasa a la siguiente.

### Cuando algo falla

**No preguntes. Aplica esta tabla:**

| Situación | Qué haces |
|---|---|
| `expo export` falla | Revierte esa tarea, márcala ❌ con la salida del error, **continúa** |
| Un check falla | Igual: revierte, ❌, continúa |
| Un comando falla por entorno | ⏭ saltada con el motivo, continúa |
| Una premisa ya no se cumple | ⏭ saltada, anótalo, continúa |
| **La tarea 01 falla** | **Detente del todo.** Sin `expo export` no hay verificación posible |
| Encuentras un bug | `HALLAZGOS.md`, **no lo arregles**, sigue |
| Dudas entre dos diseños | El más conservador, y anótalo |
| Dudas si algo es visible para el usuario | **Asume que sí**: no lo hagas |

Las tareas 02 a 05 son independientes: un fallo en la 04 no impide la 05. Dentro de la 04,
además, **cada fichero es independiente**: si uno falla, revierte solo ese y sigue con el
siguiente.

### Revertir bien

```bash
git checkout -- src/          # descarta cambios sin commitear
git clean -fd src/            # borra ficheros nuevos de esa tarea
```

Nunca `git reset --hard` a un commit anterior: borrarías tareas ya commiteadas. Nunca
toques `pre-refactor-app` ni ningún tag.

## Antes de cada tarea

1. Lee el documento (`NN-*.md`) **completo**. Si contradice a esta skill, manda el documento.
2. **Comprueba el árbol.** Hay **otros agentes trabajando en este repositorio**: si
   `git status --short` muestra cambios que no hiciste tú, **no los incluyas en ningún
   commit** y anótalos en `ESTADO.md`.
3. Reconfirma las premisas con comandos. El plan se escribió el 2026-08-30.

## Verificación

Ejecuta **todos** los checks del documento. Un check es verde si **la salida coincide con
lo esperado**, no si el comando no dio error.

### El check que nunca se omite

Al terminar cada tarea:

```bash
npx expo export --platform android --output-dir <scratchpad>/exp-check --clear
```

Debe terminar con **código 0**. Compara el tamaño del bundle con la línea base (5.47 MB):
si **creció**, algo se añadió sin querer — investiga o revierte.

Usa el scratchpad de la sesión y **bórralo al terminar**. Nunca exportes a una carpeta del
proyecto: un `dist/` a medias confunde a los siguientes agentes.

**Nota de entorno:** en Git Bash, `$TMPDIR` puede resolverse a una ruta sin permisos de
escritura y el export falla con `EPERM`. Usa la ruta absoluta del scratchpad.

## Commits

Un commit por tarea:

```
refactor(NN): <descripcion>
```

Termina siempre con:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

**Añade los ficheros de forma explícita, uno por uno. Nunca `git add -A` ni `git add .`** —
hay otros agentes operando sobre el repositorio. No hagas `push`: el usuario decide cuándo
sube.

## Al terminar

Escribe el informe (tarea 06) y para. Lo más importante del informe **no** es lo que se
hizo: es el **checklist de verificación manual**, porque esta etapa no ha podido abrir la
app ni una vez.

En el resumen final, sé literal:

- Qué se completó, qué se revirtió, qué se saltó, con motivos.
- Las cifras antes/después.
- **Deja claro que nada se probó en ejecución** y qué hay que comprobar en el emulador.

Un informe que dé a entender que la app está verificada sería falso. Una tarea revertida y
bien explicada es un buen resultado.

## Límites

**No hagas nunca, aunque parezca obvio:**

- Cambiar textos, estilos, layout, navegación o tiempos. Es la razón de ser del plan.
- Cambiar `==` por `===`, ni ningún otro operador.
- Tocar las zonas prohibidas de la tabla de arriba.
- Arreglar bugs. Van a `HALLAZGOS.md`.
- Añadir, actualizar o quitar dependencias. (`npx expo install` además ensucia
  `package-lock.json` en este repo, ya migrado a pnpm.)
- Añadir un framework de tests. Sería lo más valioso, pero implica dependencias y config
  de Babel: queda recomendado en el informe.
- Migrar de SDK. Eso es `doc/migracion-sdk54/`.
- Tocar el backend (`D:\BINGO_MAAC\BACKEND`). Esta etapa es solo app.
- `git push`, `git reset --hard`, borrar tags, `eas build`.

**No preguntes al usuario.** No está, y su máquina puede estar apagada. Si algo exige una
decisión suya, está fuera del plan: anótalo en `HALLAZGOS.md` y sigue.

## Notas del proyecto

- App de bingo 90 bolas, JavaScript plano, Expo SDK 52. **Sin tests ni linter.**
- Gestor de paquetes: **pnpm** (`node-linker=hoisted`). No uses `npm install`.
- La app habla con un backend que **está cerrado con `auth:sanctum`** desde la etapa de
  seguridad. No hace falta para esta etapa —nada aquí ejecuta la app— pero explica por qué
  `src/Utils/` manda siempre el token.
- Contexto arquitectónico completo en `CLAUDE.md`.
