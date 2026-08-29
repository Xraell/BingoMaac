# 01 — Centralizar la URL y el cliente HTTP

**Fase:** 0 · **Riesgo:** Bajo · **Depende de:** nada · **Dispositivo:** no

## Objetivo

Un único punto donde vivan la URL base y la lógica de `fetch`, para que las tareas
siguientes tengan dónde inyectar el token.

## Por qué

La URL está repetida en 8 ficheros de `src/Utils/`, todos con
`http://10.0.2.2:8000` — la IP con la que el emulador de Android alcanza el `localhost`
del anfitrión. En un teléfono real esa dirección no existe: **la app tal cual no funciona
fuera del emulador**.

Y sin un punto único, meter la cabecera `Authorization` obligaría a editar decenas de
llamadas a `fetch` una por una, con la certeza de olvidar alguna. Esta tarea convierte
ese trabajo en una sola edición.

Es refactor, no seguridad, y va primero solo porque **reduce** el trabajo posterior.

## Pasos

### 1. Punto de retorno

```bash
git tag pre-seguridad
```

**Antes**, comprobar el árbol: hay otros agentes trabajando en este repositorio. Si
`git status` muestra cambios que no hiciste tú, **detente y consulta**. Al redactar este
plan había `package.json` modificado y `.npmrc`, `index.js`, `pnpm-lock.yaml` sin
seguimiento.

### 2. Configuración por entorno

Crear `src/config/api.js`:

```js
import Constants from "expo-constants";

const PRODUCCION = "https://<dominio-real>/api";
const DESARROLLO = "http://10.0.2.2:8000/api";

export const API_BASE = __DEV__
  ? (Constants.expoConfig?.extra?.apiUrl ?? DESARROLLO)
  : PRODUCCION;
```

`__DEV__` es la variable estándar de React Native: `true` con Metro, `false` en una
compilación de producción. Así **una build de release nunca puede apuntar al emulador**,
que es justo el error que este plan quiere hacer imposible.

El `extra.apiUrl` de `app.json` permite probar contra un servidor de la red local sin
tocar código — hoy eso se hace editando los 8 ficheros a mano, que es como acaban
colándose URLs de desarrollo en un commit.

### 3. Cliente HTTP único

Crear `src/Utils/http.js` con un envoltorio sobre `fetch`:

```js
import { API_BASE } from "../config/api";

export async function apiFetch(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_BASE}${ruta}`, {
    ...opciones,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Accept: "application/json",
      ...opciones.headers,
    },
  });

  if (!respuesta.ok) {
    const error = new Error(`HTTP ${respuesta.status}`);
    error.status = respuesta.status;   // lo usaran las tareas 03 y 04
    throw error;
  }

  return respuesta.status === 204 ? null : respuesta.json();
}
```

Exponer `error.status` es lo que permitirá luego distinguir un 401 (sesión caducada) de
un 403 (sin permiso) de un fallo de red. Hoy todos los `catch` de `src/Utils/` los
tratan igual.

### 4. Migrar los 8 ficheros

Sustituir en `Boleto.js`, `Compra.js`, `Ganador.js`, `Mensaje.js`, `Numero.js`,
`Partida.js`, `Usuario.js` y `UsuarioPromocion.js`:

```js
const UrlApi = "http://10.0.2.2:8000/api/usuario";   // fuera
```

por llamadas a `apiFetch("/usuario/...")`.

**Conservar la firma de cada función exportada.** `VerificarUsuario(tel, clave)` debe
seguir llamándose igual y devolviendo lo mismo: cambian las tripas, no el contrato. Así
ningún componente se entera y el diff queda acotado a `src/Utils/`.

**No cambiar el comportamiento ante errores todavía.** Algunas funciones devuelven `null`
al fallar y otras relanzan; unificarlo ahora mezclaría dos cambios en un commit. Se hace
en la tarea 05.

### 5. Comprobar que no queda ninguna suelta

```bash
grep -rn "10.0.2.2\|http://" src/ --include=*.js
```

Solo debe aparecer en `src/config/api.js`. Ojo con `RedesSociales.js` y
`CreditosUsuario.js`, que salen en las búsquedas de URLs pero **son enlaces externos**
(redes sociales, WhatsApp), no la API: se quedan como están.

## Verificación automática

- [ ] `grep -rn "10.0.2.2" src/` devuelve **solo** `src/config/api.js`.
- [ ] `grep -rn "const UrlApi" src/` no devuelve nada.
- [ ] Compila:

      ```bash
      npx expo export --platform android --output-dir <scratchpad>/exp-check --clear
      ```

      Usar el scratchpad de la sesión, nunca una carpeta del proyecto, y borrarlo al terminar.
- [ ] Ninguna función exportada de `src/Utils/` cambió de nombre ni de número de
      argumentos:

      ```bash
      git diff pre-seguridad -- src/Utils/ | grep "^-export" | sort > /tmp/antes.txt
      git diff pre-seguridad -- src/Utils/ | grep "^+export" | sed 's/^+/-/' | sort > /tmp/despues.txt
      diff /tmp/antes.txt /tmp/despues.txt
      ```

      Sin diferencias. Es el check que demuestra que el refactor fue interno.
- [ ] `git diff --stat pre-seguridad` toca **solo** `src/Utils/`, `src/config/` y
      `app.json`. Si aparece `src/components/` o `src/screens/`, el refactor se salió de
      su alcance.

## Prueba en dispositivo

No es obligatoria en esta tarea, pero **conviene** una pasada rápida por el emulador:
entrar, ver la partida en curso y abrir «mis boletos». Si algo se rompió, el diff es
pequeño y el culpable está claro.

## Criterio de finalización

Los cinco checks en verde.

```
sec(01): centralizar la URL de la API y el cliente HTTP
```
