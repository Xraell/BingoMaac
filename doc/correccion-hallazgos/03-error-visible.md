# 03 — Que el fallo de créditos no se trague el error

**Riesgo:** Bajo · **Depende de:** [02](02-creditos-contrato.md)

## El problema

Este es el motivo de que el bug de la tarea 02 sobreviviera tanto tiempo sin que nadie lo
viera.

`AgregarCreditosUsuario` usa `pedirODevolverNull`, que **captura el error y devuelve
`null`**. En el modal:

```js
const usuarioActualizado = await AgregarCreditosUsuario(usuario.id, cantidad)
let list = listUsers.map((e) => e.id == usuarioActualizado.id ? usuarioActualizado : e)
```

Con `null`, la línea siguiente lanza `TypeError: Cannot read property 'id' of null`. El
`catch` del modal lo recoge y muestra **"Ocurrió un error desconocido"**.

Y ahí está el daño: el backend respondió un 404 clarísimo, y por el camino se convirtió en
un mensaje que no dice nada. Con la tarea 02 hecha, un 422 por saldo o validación
correría la misma suerte: el ADMIN vería "error desconocido" sin saber que el problema es
la cantidad que escribió.

`apiFetch` ya construye mensajes útiles para 403, 409 y 422 — pero `pedirODevolverNull` los
descarta antes de que nadie los pueda mostrar.

## El arreglo

Cambiar las dos funciones de crédito a `pedirOLanzar`, que **relanza** en vez de devolver
`null`, y hacer que los dos modales muestren `error.message`.

El `try/catch` de los modales **ya existe y ya llama a `Alert.alert("Error", ...)`**: solo
hay que cambiar el texto fijo por el mensaje del error, con el texto actual como respaldo
cuando no haya `message`.

## Por qué esto es seguro aquí y no lo era antes

`HALLAZGOS.md` advierte de que unificar el manejo de errores de `src/Utils/` es peligroso:
una pantalla que hoy recibe `null` y muestra una lista vacía pasaría a recibir una excepción
sin capturar.

**Ese riesgo no aplica a estas dos funciones**, y conviene ver por qué antes de tocarlas:

1. Sus **únicos** llamantes son `ModalAgregarCredito.js` y `ModalRetirarCredito.js`
   (confirmado con `grep` en la tarea 01). No son utilidades compartidas.
2. Los dos llamantes **ya envuelven la llamada en `try/catch`**. La excepción no se escapa.
3. Hoy el `null` **ya provoca una excepción** una línea más abajo, atrapada por ese mismo
   `catch`. El flujo de fallo no cambia: cambia el mensaje que llega.

**Antes de cambiar nada, reconfirmar el punto 1 con `grep`.** Si apareciera un tercer
llamante sin `try/catch`, esta tarea se salta y se anota. El razonamiento entero depende de
eso.

**No tocar ninguna otra función de `src/Utils/`.** La unificación general sigue fuera de
alcance.

## Pasos

1. Reconfirmar por `grep` los llamantes de ambas funciones.
2. Cambiar `pedirODevolverNull` por `pedirOLanzar` en las dos.
3. En los dos modales, mostrar `error.message` con respaldo al texto actual.
   **Ese es el único cambio permitido en los modales**, y no toca su árbol de componentes.
4. Comprobar que `setLoading(false)` sigue ejecutándose en el camino de fallo: si el spinner
   se queda girando, el modal se cuelga.

## Verificación automática

- [ ] `npx jest` en verde.
- [ ] Los **21 snapshots sin reescribir**. Cambiar el texto de un `Alert` no altera el árbol
      renderizado; si un snapshot cambia, se tocó algo de más.
- [ ] `npx expo export` con código 0.
- [ ] `grep -rn "pedirODevolverNull\|pedirOLanzar" src/Utils/Usuario.js` muestra que **solo**
      cambiaron las dos funciones de crédito.
- [ ] `git diff pre-correccion-app -- src/components/Modales/` toca **únicamente** los dos
      modales de crédito, y solo en la línea del mensaje.

## Criterio de finalización

Los cinco checks en verde.

```
fix(03): mostrar el error real al fallar una operacion de creditos
```
