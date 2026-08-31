# Informe de cierre — corrección de hallazgos (app)

## 1. Resumen

Se arregló el contrato roto entre la app y el backend para agregar/retirar créditos de un
usuario: el cliente mandaba `GET` con la cantidad embebida en la URL y el backend, desde su
propia etapa de seguridad, solo acepta `POST` con `puntos` en el body. Con eso, **los dos
modales de crédito del panel de ADMIN no funcionaban en absoluto** — toda operación
terminaba en un 404 disfrazado de "Ocurrió un error desconocido". **Nada de esto se probó
abriendo la app**: la red de seguridad (jest + `expo export`) demuestra que la petición que
sale del cliente ahora tiene la forma que el backend espera, no que el crédito llegue a
abonarse en una ejecución real. Eso lo tiene que confirmar quien abra la app, con la
sección 4.

## 2. Antes y después

| Métrica | Antes | Después |
|---|---|---|
| Tests | 32 | 36 |
| Snapshots | 21 | 21 (sin reescribir) |
| Suites | 4 | 5 |
| Bundle (`expo export --platform android`) | 5.45 MB | 5.45 MB |
| Llamada de agregar créditos | `GET /usuario/agregar-creditos/{id}/{n}` | `POST /usuario/agregar-creditos/{id}` + `{ puntos: <entero> }` |
| Llamada de retirar créditos | `GET /usuario/retirar-creditos/{id}/{n}` | `POST /usuario/retirar-creditos/{id}` + `{ puntos: <entero> }` |
| Error al fallar | `pedirODevolverNull` → `null` → `TypeError` → "Ocurrió un error desconocido" | `pedirOLanzar` relanza → modal muestra `error.message` (403/409/422 con mensaje útil, con ese texto como respaldo) |

## 3. El segundo defecto que se encontró de paso

El `TextInput` de `cantidad` en ambos modales guarda un **string** en cuanto el ADMIN teclea
la cantidad a mano (`onChangeText={(t) => setCantidad(t)}`); solo los botones ±10 mantenían
un número. El backend valida `puntos` como `integer` estricto (`required|integer|min:1|max:100000`),
y Laravel rechaza `"50"` (string) con 422. Sin corregir esto, el arreglo del verbo HTTP
habría dejado los botones ±10 funcionando y teclear la cantidad fallando — un bug
intermitente, más caro de diagnosticar que el original porque solo aparece con una de las
dos formas de usar el mismo campo. Se corrigió convirtiendo a entero en un único sitio,
`Utils/Usuario.js` (`parseInt(nroCreditos, 10)`), no en los modales: cubre a ambos y no
toca ningún árbol de React. No se agregó validación de rango en el cliente — esa la sigue
imponiendo el servidor.

## 4. Checklist de verificación manual

Nada de esto se ejecutó. Requiere emulador o dispositivo con el backend levantado y un
usuario ADMIN. En orden:

- [ ] Login como **ADMIN**.
- [ ] **Agregar créditos** con los botones ±10 → el saldo sube y la lista se actualiza.
- [ ] **Agregar créditos escribiendo la cantidad a mano** → funciona igual.
      *(Este es el caso del defecto de la sección 3.)*
- [ ] **Retirar créditos** → el saldo baja.
- [ ] **Retirar más créditos de los que hay** → aparece un mensaje **con sentido**
      (saldo insuficiente), no "Ocurrió un error desconocido". *(Tarea 03.)*
- [ ] Dejar el campo **vacío** y confirmar → mensaje razonable, el modal no se cuelga con
      el spinner girando.
- [ ] El **bono de referido del 20 %** se abona a quien corresponda, si el usuario tiene
      `idReferido`.

Y con el backend ya corregido (`BACKEND/doc/correccion-hallazgos/`):

- [ ] Un **USER** ve la lista de boletos disponibles y **puede comprar uno**.

Si algo falla, `git log --oneline` señala la tarea (`fix(02)` o `fix(03)`) y `git revert`
de ese commit la deshace sin afectar a la otra. El tag `pre-correccion-app` es el punto de
retorno de la etapa entera.

## 5. Hallazgos

Volcado de `HALLAZGOS.md` al cierre de esta etapa:

- **`cantidad` es un string cuando se teclea** en los modales de crédito — no quedó como
  hallazgo suelto: la tarea 02 lo corrigió como parte del mismo cambio (ver sección 3). Se
  documentó ahí porque no estaba en el reporte original que dio origen al plan.
- **Los 7 puntos de deuda** de `doc/PENDIENTE.md` § 2 siguen vigentes y fuera de alcance de
  esta etapa.
- No se encontró ningún hallazgo nuevo durante la ejecución: no apareció un tercer llamante
  de las funciones de crédito (la tarea 03 reconfirmó por grep que solo llaman
  `ModalAgregarCredito.js` y `ModalRetirarCredito.js`), y ningún snapshot se movió en
  ninguna de las tareas.

## 6. Lo que sigue pendiente

Los 7 puntos de deuda de `doc/PENDIENTE.md` § 2 siguen sin tocar, **incluido
`src/config/api.js` con `https://<dominio-real>/api` como placeholder**, que rompe
cualquier build de producción hasta que alguien con el dominio real lo complete. Y las
etapas planificadas que no son esta: actualización de dependencias, seguridad 05/06, y
migración a SDK 54.

Del lado del backend, los otros dos hallazgos de la verificación en dispositivo del
2026-08-30 tienen su propio plan en `BACKEND/doc/correccion-hallazgos/` y son
independientes de este: no hace falta esperar a uno para avanzar el otro. Lo único que
cruza ambos planes es la verificación manual de compra de boletos como `USER` (última fila
de la sección 4), que necesita el arreglo del backend ya desplegado.
