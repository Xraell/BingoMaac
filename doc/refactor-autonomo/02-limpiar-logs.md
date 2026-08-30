# 02 — Quitar los `console.log` de depuración

**Riesgo:** Nulo · **Depende de:** [01](01-linea-base.md)

## Objetivo

Eliminar los 47 `console.log` repartidos por 15 ficheros, conservando el manejo de errores.

## Por qué

Son rastro de depuración que quedó en el código. Tres motivos para quitarlos, en orden de
importancia:

1. **Privacidad.** En Android se leen con `adb logcat` **sin root**. La etapa de seguridad
   ya quitó los que imprimían la contraseña, pero quedan otros que vuelcan objetos de
   usuario completos.
2. **Rendimiento.** `PartidaEnCurso.js` tiene **16 logs**, y es el componente que corre en
   bucle durante la partida cantando números.
3. **Ruido.** Un log por cada llamada a la API hace inútil la consola cuando de verdad hay
   que depurar algo.

Es la tarea de menor riesgo del plan y va primera por eso.

## La distinción que importa

**`console.log` se va. `console.error` se queda.**

Los `catch` de `src/Utils/` usan `console.error` para reportar fallos de red. Eso no es
depuración: es el único rastro que queda cuando una llamada falla en un dispositivo real.
Quitarlos dejaría los fallos completamente mudos.

```js
// SE QUITA — depuracion
console.log("response: ", response);

// SE QUEDA — manejo de errores
console.error("Error en Obtener Usuarios:", error);
```

## Pasos

### 1. Inventariar

```bash
grep -rn "console.log" src --include=*.js
```

Guardar la lista. Es la referencia de la verificación.

### 2. Eliminar, no comentar

Borrar la línea entera. **No** dejarla comentada: un `// console.log(...)` es ruido
igualmente y el siguiente que lo lea no sabrá si hacía falta.

Cuidado con los logs multilínea y con los que estén dentro de un bloque de una sola
sentencia sin llaves:

```js
if (algo) console.log("x");   // borrar la linea entera deja el if huerfano
```

En ese caso hay que borrar el `if` completo si se queda sin cuerpo. **Si el caso es
ambiguo, dejar el log y anotarlo en `HALLAZGOS.md`** — el objetivo no es llegar a cero, es
no romper nada.

### 3. Orden de ficheros

Empezar por los que más tienen: `PartidaEnCurso.js` (16), `BotonExportarReporte.js` (7),
`ListaMisBoletos.js` (5), `ModalEditarPartida.js` (3).

**`PartidaEnCurso.js` es zona prohibida para todo lo demás, pero sus logs sí se pueden
quitar.** Es una eliminación de líneas sueltas, no un cambio de lógica. Aun así: revisar
que ninguno esté dentro de una condición sin llaves, y **no tocar ni una línea más** de
ese fichero.

### 4. Ejecutar el export tras cada 3-4 ficheros

No al final. Si algo se rompe, así se sabe cuál fue sin bisecar.

## Verificación automática

- [ ] `grep -rn "console.log" src --include=*.js` devuelve **muchos menos** que 47. No
      tiene por qué ser cero: los ambiguos se dejan a propósito.
- [ ] **`console.error` intacto:**

      ```bash
      grep -rc "console.error" src --include=*.js | grep -v ":0" | awk -F: '{s+=$2} END {print s}'
      ```

      Mismo número que en la línea base. Este es el check que define la tarea.

- [ ] `npx expo export` en verde.
- [ ] `git diff --stat pre-refactor-app -- src/` muestra **solo líneas borradas**, ninguna
      añadida:

      ```bash
      git diff --numstat HEAD -- src/ | awk '{if ($1 != 0) print "AÑADIDAS en " $3}'
      ```

      Sin salida. Si aparece algo, esta tarea hizo más de lo que debía.

- [ ] `PartidaEnCurso.js` solo perdió líneas de log:

      ```bash
      git diff HEAD -- src/components/Conjunto/PartidaEnCurso.js | grep "^-" | grep -v "console.log" | grep -v "^---"
      ```

      Sin salida.

## Criterio de finalización

Los cinco checks en verde. El último es el más importante: demuestra que la zona frágil no
se tocó más allá de lo permitido.

```
refactor(02): quitar los console.log de depuracion
```
