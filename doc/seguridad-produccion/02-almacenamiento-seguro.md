# 02 — Guardar el token en SecureStore

**Fase:** 1 · **Riesgo:** Medio · **Depende de:** [01](01-centralizar-api.md) ·
**Backend:** tarea 04 publicada · **Dispositivo:** **sí**

## Objetivo

Añadir `expo-secure-store` y crear la capa que guarda, lee y borra el token, **sin usarla
todavía en el flujo de login**.

## Por qué

`AsyncStorage` **no está cifrado**. En Android es un fichero dentro del sandbox de la
app: cualquiera con el dispositivo rooteado, un respaldo ADB o acceso físico lo lee en
claro. Vale para preferencias; no para credenciales.

`expo-secure-store` usa el **Keystore** de Android y el **Keychain** de iOS: el material
queda cifrado por el sistema y ligado al dispositivo.

Se separa de la tarea 03 a propósito: aquí se añade una dependencia nativa, que **obliga
a recompilar el development build**. Mezclarlo con el cambio de flujo de sesión haría
imposible saber si un fallo viene del módulo nativo o de la lógica.

## Pasos

### 1. Instalar el paquete

```bash
npx expo install expo-secure-store
```

**Siempre `npx expo install`**, nunca `npm install` ni edición manual de versiones: es el
único que respeta la matriz del SDK 54.

### 2. Recompilar el development build

`expo-secure-store` incluye código nativo, así que **no basta con recargar Metro**:

```bash
eas build --profile development --platform android
```

Sin esto, las llamadas fallan con un error de módulo no encontrado que parece un fallo de
código y no lo es.

### 3. Capa de sesión

Crear `src/Utils/sesion.js`:

```js
import * as SecureStore from "expo-secure-store";

const CLAVE_TOKEN = "auth_token";

export async function guardarToken(token) {
  await SecureStore.setItemAsync(CLAVE_TOKEN, token);
}

export async function leerToken() {
  try {
    return await SecureStore.getItemAsync(CLAVE_TOKEN);
  } catch {
    // Keystore no disponible o dato corrupto: equivale a no tener sesion.
    return null;
  }
}

export async function borrarToken() {
  await SecureStore.deleteItemAsync(CLAVE_TOKEN);
}
```

El `catch` que devuelve `null` importa: si el Keystore falla, la app debe comportarse
como si no hubiera sesión —mandar al login— y no reventar en el arranque.

### 4. Inyectar el token en `apiFetch`

En `src/Utils/http.js`, añadir la cabecera cuando haya token:

```js
const token = await leerToken();

const respuesta = await fetch(`${API_BASE}${ruta}`, {
  ...opciones,
  headers: {
    "Content-type": "application/json; charset=UTF-8",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opciones.headers,
  },
});
```

El condicional es esencial por el **modo invitado**: `usuarioInvitado` tiene
`Rol: "GUEST"` y no tiene token. Mandar `Authorization: Bearer null` produciría un 401
donde hoy hay una respuesta válida. Sin token, no se manda la cabecera.

Como todavía nadie guarda un token, `leerToken()` devuelve `null` y **el comportamiento
no cambia**. Esa es la razón de que esta tarea sea segura.

### 5. No tocar el login todavía

`BotonesLogin.js` sigue con `AsyncStorage.setItem("idUsuario", ...)`. Cambiarlo es la
tarea 03.

## Verificación automática

- [ ] `expo-secure-store` aparece en `package.json` con una versión de la matriz del SDK 54.
- [ ] `npx expo-doctor` sin avisos nuevos respecto a antes de la tarea.
- [ ] Compila (`expo export`).
- [ ] `grep -rn "SecureStore" src/` aparece **solo** en `src/Utils/sesion.js`.
- [ ] `leerToken()` devuelve `null` en arranque limpio, y `apiFetch` **no** manda
      `Authorization` en ese caso. Comprobable con un `console.log` temporal de las
      cabeceras, que se quita antes de commitear.

## Prueba en dispositivo — obligatoria

Sobre el development build nuevo:

- [ ] La app **arranca**. Es lo que demuestra que el módulo nativo quedó bien enlazado.
- [ ] Entrar como invitado y ver la partida en curso: sigue funcionando **sin token**.
- [ ] Iniciar sesión con un usuario real: sigue funcionando igual que antes.
- [ ] Prueba de ida y vuelta del almacén, con un botón temporal o desde la consola:

      ```js
      await guardarToken("prueba123");
      console.log(await leerToken());   // "prueba123"
      await borrarToken();
      console.log(await leerToken());   // null
      ```

      **Cerrar la app por completo y reabrirla entre `guardarToken` y `leerToken`**: es lo
      único que demuestra que persiste de verdad y no vive en memoria.

No commitear sin confirmación explícita del usuario.

## Criterio de finalización

Los cinco checks automáticos y los cuatro de dispositivo, en verde.

```
sec(02): almacenamiento seguro del token con expo-secure-store
```
