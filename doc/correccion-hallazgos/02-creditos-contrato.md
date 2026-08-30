# 02 — Corregir la llamada de créditos

**Riesgo:** Medio · **Depende de:** [01](01-linea-base.md)

## El bug

`src/Utils/Usuario.js`:

```js
export const AgregarCreditosUsuario = async (id, nroCreditos) => {
  return pedirODevolverNull("/usuario/agregar-creditos/" + id + "/" + nroCreditos, "VerificarUsuario");
};
```

`pedirODevolverNull` no pasa `method`, así que sale un **GET** con la cantidad en la URL.
El backend declara:

```php
Route::post('/agregar-creditos/{id}', [UsuarioController::class, 'agregarCreditos']);
```

**POST**, con `{id}` en la ruta y `puntos` en el body. La URL que manda la app no existe:
**404**. Los dos modales de crédito muestran "Ocurrió un error desconocido" y **el crédito
nunca se abona**.

Idéntico en `RetirarCreditosUsuario`.

## Por qué pasó

La tarea 06 del plan de seguridad del backend cambió estas rutas de GET a POST a propósito:
con la cantidad en la URL y sin validar, el endpoint aceptaba **negativos, decimales y
texto**. Un ADMIN podía "agregar" −500 créditos. El backend se arregló, se le pusieron
tests y un `FormRequest`; **la app nunca se actualizó**.

El backend es el lado correcto y su contrato está fijado por `tests/Feature/CreditosTest.php`.
**El arreglo va aquí, en el cliente.**

## Hay un segundo defecto encadenado

Arreglar solo el método HTTP **no basta**. El `FormRequest` valida:

```php
'puntos' => 'required|integer|min:1|max:100000'
```

Y en `ModalAgregarCredito.js`:

```js
const [cantidad, setCantidad] = useState(0);
...
onChangeText={(t) => setCantidad(t)}      // <- guarda un STRING
```

Los botones ±10 mantienen `cantidad` numérica, pero **escribir a mano en el campo la
convierte en string**. Laravel valida `integer` de forma estricta: `"50"` en el JSON body
**no** pasa esa regla, y el resultado sería un **422**.

Es decir: sin este segundo arreglo, los botones funcionarían y teclear la cantidad
seguiría fallando — un bug más difícil de diagnosticar que el actual, porque sería
intermitente.

## Pasos

### 1. Corregir las dos funciones de `Utils/Usuario.js`

Que envíen `POST` a `/usuario/agregar-creditos/{id}` (y `/retirar-creditos/{id}`) con
`{ puntos: <entero> }` en el body. El molde ya existe en el fichero: `agregarUsuario` usa
`pedirOLanzar` con `method` y `body`. **Seguir ese molde**, no inventar uno nuevo.

Sobre el ayudante a usar, ver la tarea [03](03-error-visible.md): el cambio de
`pedirODevolverNull` a `pedirOLanzar` **pertenece a esa tarea**, no a esta. Aquí se corrige
el verbo, la URL y el cuerpo, conservando el ayudante actual. Así, si algo se rompe, el
`git bisect` distingue qué mitad lo hizo.

### 2. Garantizar que `puntos` viaja como entero

Convertir a entero **en un solo sitio**, y que ese sitio sea `Utils/Usuario.js`, no los
modales:

- Es donde vive el contrato con la API.
- Los dos modales llaman a las mismas funciones: arreglarlo aquí cubre ambos.
- Tocar los modales entra en el territorio de los 21 snapshots. Tocar `Utils/` no.

Cuidado con el caso vacío: si el campo queda en blanco, la conversión puede dar `NaN`, y
`JSON.stringify({puntos: NaN})` produce `null`. El backend responderá 422 con "required",
que es correcto — pero conviene que el mensaje que ve el ADMIN tenga sentido. Eso lo
resuelve la tarea 03.

**No añadir validación de rango en el cliente** (`min:1`, `max:100000`). Duplicar reglas de
validación es cómo se desincronizan: el servidor ya las tiene y son las que mandan.

### 3. Test

`src/Utils/__tests__/` ya prueba los builders y los ayudantes de `http.js`. Añadir un test
que, con `apiFetch` simulado, compruebe de `AgregarCreditosUsuario` y
`RetirarCreditosUsuario`:

1. El **método es POST**.
2. La **URL no lleva la cantidad** (`/usuario/agregar-creditos/7`, no `.../7/50`).
3. El body es `{"puntos": 50}` con **50 numérico, no `"50"`**.
4. Pasando `"50"` (string, como lo deja el `TextInput`) el body sigue siendo numérico.

El caso 4 es el que protege del segundo defecto. Sin él, el arreglo se puede deshacer sin
que nada se ponga rojo.

## Verificación automática

- [ ] `npx jest` en verde, con **al menos 4 tests más** que en la línea base.
- [ ] Los 21 snapshots **sin reescribir**. Si alguno cambia, se tocó un modal: revertir esa
      parte. Esta tarea no debe alterar ningún árbol de React.
- [ ] `npx expo export` con código 0.
- [ ] `grep -n "agregar-creditos\|retirar-creditos" src/Utils/Usuario.js` **no muestra**
      ninguna concatenación de la cantidad en la ruta.
- [ ] El bundle no creció de forma apreciable respecto a la línea base.

## Criterio de finalización

Los cinco checks en verde.

```
fix(02): enviar los creditos por POST con puntos numerico en el cuerpo
```
