# 05 — Endurecer el cliente: HTTPS, logs y contratos

**Fase:** 3 · **Riesgo:** Medio · **Depende de:** [04](04-autorizacion-cliente.md) ·
**Backend:** tarea 07 desplegada · **Dispositivo:** **sí**

## Objetivo

Apuntar al dominio HTTPS de producción, eliminar el registro de datos sensibles y
adaptar la app a los contratos que cambiaron en el backend.

## Despliegue conjunto

**Esta tarea se despliega a la vez que la tarea 07 del backend.** Apuntar a HTTPS antes
de que el servidor lo sirva deja la app sin backend; y forzar HTTPS en el servidor antes
de publicar esta versión deja fuera a la app anterior. Coordinar el orden con el usuario.

## Por qué

Con las contraseñas hasheadas en la base, **lo que viaja por la red sigue siendo la
contraseña original** — y ahora también el token, que es una credencial de larga duración.
Sobre HTTP, cualquiera en la misma WiFi los lee. Es el último eslabón en claro.

## Pasos

### 1. Dominio de producción

En `src/config/api.js`, poner el dominio real y **verificar que la build de release lo
usa**. `__DEV__` ya lo garantiza (tarea 01), pero conviene comprobarlo, no suponerlo:
un APK que apunte a `10.0.2.2` no funciona en ningún teléfono.

### 2. Impedir tráfico en claro

Android bloquea HTTP en claro desde API 28, pero Expo lo relaja en desarrollo. Asegurar
que la build de producción **no** lo permite:

```json
"android": { "usesCleartextTraffic": false }
```

en `app.json`. Así, si por un descuido queda una URL `http://`, **falla de forma visible**
en vez de enviar credenciales en claro sin que nadie lo note.

### 3. Quitar los logs sensibles

Barrido completo:

```bash
grep -rn "console.log" src/ --include=*.js
```

Los que **deben desaparecer sin discusión**:

- `Utils/Usuario.js` → `console.log("seendToBody: ", seendToBody)` (contiene la clave;
  la tarea 03 ya lo quitó — confirmar).
- `BotonesLogin.js` → `console.log("idUsuario: ", ...)` y `console.log("response: ", ...)`,
  que imprime el objeto de usuario completo.

En Android, `adb logcat` lee esos registros **sin root**. Cualquier app con permiso de
lectura de logs en versiones antiguas también.

Para el resto, retirar los de depuración. Si se quiere conservar alguno, envolverlo:

```js
if (__DEV__) console.log(...);
```

### 4. Adaptar los contratos que cambiaron

El backend modificó algunas respuestas en su tarea 06:

| Cambio en el backend | Qué ajustar en la app |
|---|---|
| Compra: 404 → **409** si el boleto está vendido | Mensaje específico (hecho en la 04) |
| Compra: `Monto` lo calcula el servidor | **Dejar de enviarlo** |
| Compra: `idUsuario` sale del token | **Dejar de enviarlo** |
| Crédito: rutas GET → **POST** | Cambiar el método en `Utils/Usuario.js` |
| Saldo insuficiente → **422** | Mensaje del servidor (hecho en la 04) |

El precio deja de mandarse, pero **la app sigue mostrándolo**: lo toma de
`partidaActual.CostoBoleto`, que ya usa. Solo desaparece del cuerpo de la petición.

### 5. Unificar el manejo de errores

Aplazado desde la tarea 01: unas funciones de `src/Utils/` devuelven `null` al fallar y
otras relanzan. Con `apiFetch` lanzando siempre, unificar en **relanzar** y que cada
pantalla decida.

Revisar los `catch` que hoy devuelven `null`: un `null` silencioso se convierte en
pantalla vacía sin explicación, que es lo que hace que estos fallos sean tan difíciles de
diagnosticar en producción.

### 6. Retirar el GET de `designar-promocion`

El backend elimina la variante GET en su tarea 05. Comprobar que `UsuarioPromocion.js`
usa POST.

## Verificación automática

- [ ] `grep -rn "http://" src/` no devuelve nada (solo `https://`).
- [ ] `grep -rniE "console\.log.*(clave|password|token|response)" src/` no devuelve nada.
- [ ] `app.json` tiene `usesCleartextTraffic: false`.
- [ ] `grep -rn "Monto" src/Utils/Compra.js` confirma que ya no se envía.
- [ ] `grep -rn "agregar-creditos\|retirar-creditos" src/` muestra `method: "POST"`.
- [ ] Compila (`expo export`).
- [ ] En el bundle exportado no aparece la URL de desarrollo:

      ```bash
      grep -r "10.0.2.2" <scratchpad>/exp-check/ || echo "OK: sin URL de desarrollo"
      ```

      Este check vale más que mirar el código: comprueba **lo que se va a distribuir**.

## Prueba en dispositivo — obligatoria

Sobre una build de producción (no Expo Go, no development build):

- [ ] Login contra el servidor real por HTTPS.
- [ ] Comprar un boleto: descuenta el saldo correcto y el boleto aparece en «mis boletos».
- [ ] Comprar el mismo boleto desde dos dispositivos a la vez → uno lo consigue, el otro
      recibe un mensaje claro. Comprueba de punta a punta el trabajo de la tarea 06 del
      backend.
- [ ] Una promoción con descuento se aplica igual que antes.
- [ ] Partida completa de principio a fin: números, audio, ganadores.
- [ ] `adb logcat` durante un login **no muestra la contraseña ni el token**.

El último es la verificación directa de esta tarea, y es fácil de olvidar.

No commitear sin confirmación explícita del usuario.

## Criterio de finalización

Los siete checks automáticos y los seis de dispositivo, en verde.

```
sec(05): HTTPS de produccion, limpieza de logs y contratos actualizados
```
