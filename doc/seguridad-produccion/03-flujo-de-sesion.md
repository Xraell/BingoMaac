# 03 — Flujo de sesión: login, `/me`, logout y expiración

**Fase:** 1 · **Riesgo:** **Alto** · **Depende de:** [02](02-almacenamiento-seguro.md) ·
**Backend:** tarea 04 publicada · **Dispositivo:** **sí**

## Objetivo

Sustituir el `idUsuario` de `AsyncStorage` por el token: el login lo guarda, el arranque
restaura la sesión con `/me`, el logout lo revoca y un 401 devuelve al usuario al login.

## Por qué

Hoy la sesión es un número guardado en claro. `BotonesLogin.js` hace:

```js
const idUsuario = await AsyncStorage.getItem("idUsuario");
const response = await ObtenerUsuario(idUsuario);   // GET /usuario/{id}, sin credencial
```

Cambiar ese valor a `1` en un dispositivo rooteado convierte a cualquiera en el usuario 1
— que en esta base es precisamente el administrador. No hace falta ni saber su contraseña.

Es la tarea de mayor riesgo del plan de la app: **si algo sale mal, nadie puede entrar**.

## Pasos

### 1. Login: guardar el token

En `src/Utils/Usuario.js`, `VerificarUsuario` devuelve ahora `{ usuario, token }` (ver
tarea 04 del backend). Durante la transición el backend **también** manda los campos del
usuario en la raíz, así que hay que aceptar ambas formas:

```js
export const VerificarUsuario = async (tel, clave) => {
  const datos = await apiFetch("/usuario/authenticarte", {
    method: "POST",
    body: JSON.stringify({ Telefono: tel, Clave: clave }),
  });

  if (datos.token) {
    await guardarToken(datos.token);
  }

  return datos.usuario ?? datos;   // compatible con la forma antigua
};
```

**Quitar el `console.log("seendToBody: ", seendToBody)`** de esa función: hoy imprime la
contraseña en claro en los logs del dispositivo, legibles con `adb logcat`.

### 2. Arranque: restaurar con `/me`

En `BotonesLogin.js`, `verificarSession()` deja de leer un id:

```js
const verificarSession = async () => {
  setCargando(true);
  try {
    const token = await leerToken();
    if (!token) { setCargando(false); return; }

    const usuario = await apiFetch("/usuario/me");
    setUser(usuario);
    setOpc(usuario.Rol === "ADMIN" ? 2 : 1);
  } catch (error) {
    // Token invalido o caducado: sesion limpia y al login.
    await borrarToken();
    setCargando(false);
  }
};
```

La diferencia de fondo: **el servidor dice quién eres**, en vez de que el cliente lo
afirme. Un token manipulado da 401 y acaba en el login, no en la sesión de otro.

### 3. Registro

`BotonRegistro.js` también hace `AsyncStorage.setItem("idUsuario", ...)`. Tras el alta,
o bien el backend devuelve token, o la app hace login inmediatamente con las credenciales
recién creadas. **Lo segundo es más simple y usa un camino ya probado**: preferirlo salvo
que el backend ya devuelva el token en `store()`.

### 4. Logout: revocar, no solo olvidar

`BotonCerrarSesion.js` hace hoy `AsyncStorage.clear()`. Dos problemas:

- No avisa al servidor: **el token sigue siendo válido** hasta que expire. Como los de
  Sanctum no caducan por omisión, sigue válido para siempre.
- `clear()` borra **todo** `AsyncStorage`, incluida la marca de
  `ModalInicioPartida.js`, que la usa para no repetir el modal en la misma partida. Es un
  efecto colateral que hoy pasa inadvertido.

```js
const salir = async () => {
  try {
    await apiFetch("/usuario/logout", { method: "POST" });
  } catch {
    // Sin red no se puede revocar; la sesion local se cierra igual.
  }
  await borrarToken();
  await AsyncStorage.removeItem("idUsuario");   // limpiar el rastro antiguo
  setUser(usuarioInvitado);
  setOpc(0);
};
```

Sustituir `clear()` por `removeItem` del dato concreto. Y el `catch` vacío es
deliberado: sin cobertura, la sesión local debe cerrarse igual.

### 5. Manejo global del 401

En `apiFetch`, una sesión caducada debe llevar al login desde cualquier pantalla, no
producir un error suelto:

```js
if (respuesta.status === 401) {
  await borrarToken();
  emitirSesionExpirada();   // notifica a AppProvider
}
```

Con un emisor de eventos sencillo al que `AppProvider` se suscribe para hacer
`setUser(usuarioInvitado)` y `setOpc(0)`.

**Cuidado con el invitado:** un usuario en modo `GUEST` que reciba un 401 de una ruta
protegida **no debe ver «sesión expirada»** — nunca tuvo sesión. Comprobar que hay token
antes de emitir el evento.

### 6. Retirar `idUsuario` como fuente de verdad

```bash
grep -rn "idUsuario" src/ --include=*.js
```

Las apariciones legítimas son las que se mandan como parámetro a la API (por ejemplo
`obtener-boletos-usuario/{id}`), que salen de `user.id` del contexto. Las que **leen de
`AsyncStorage` para saber quién es el usuario** deben desaparecer.

## Verificación automática

- [ ] `grep -rn "AsyncStorage.getItem(\"idUsuario\")" src/` no devuelve nada.
- [ ] `grep -rn "AsyncStorage.clear" src/` no devuelve nada.
- [ ] `grep -rniE "console\.log.*(clave|password|token)" src/` no devuelve nada.
- [ ] Compila (`expo export`).
- [ ] `grep -rn "seendToBody" src/` no devuelve nada.

## Prueba en dispositivo — obligatoria

Este es el checklist que decide si la tarea se cierra:

- [ ] **Login** con usuario real: entra y ve sus datos.
- [ ] **Persistencia**: cerrar la app por completo y reabrirla → sigue dentro, sin
      volver a escribir la contraseña.
- [ ] **Logout**: sale al login. Reabrir la app → sigue fuera.
- [ ] **Invitado**: «INGRESAR COMO INVITADO» funciona, y se ve la partida en curso.
- [ ] **Credenciales incorrectas**: mensaje de error, sin quedarse colgado.
- [ ] **Sin cobertura**: activar modo avión e intentar entrar → mensaje claro, sin
      pantalla en blanco ni cierre inesperado.
- [ ] **Token inválido**: guardar a mano un token falso con `guardarToken("basura")`,
      reabrir la app → **acaba en el login**, no en la sesión de nadie. Es la prueba de
      que el agujero original está cerrado.
- [ ] **El modal de inicio de partida** sigue comportándose igual tras cerrar sesión
      (verifica que no se borró de más).

No commitear sin confirmación explícita del usuario.

## Si algo sale mal

```bash
git reset --hard pre-seguridad
```

Y avisar. **No improvisar arreglos sobre un flujo de sesión roto**: es la única parte de
la app que, si falla, deja a todos los usuarios fuera.

## Criterio de finalización

Los cinco checks automáticos y los ocho de dispositivo, en verde.

```
sec(03): sesion basada en token con /me, logout y manejo de 401
```
