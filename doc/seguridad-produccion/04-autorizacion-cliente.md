# 04 — Rol del servidor y pantallas de administración

**Fase:** 2 · **Riesgo:** Medio · **Depende de:** [03](03-flujo-de-sesion.md) ·
**Backend:** tarea 05 desplegada · **Dispositivo:** **sí**

## Objetivo

Que el rol venga siempre del servidor, y que la app trate los 403 como una respuesta
esperada en vez de como un fallo.

## Por qué

La app decide hoy con `response.Rol == "ADMIN"` sobre un objeto que llega del login.
Mientras el backend no comprobaba nada, **esa condición era la única barrera** entre un
usuario y el panel de administración.

Con la tarea 05 del backend desplegada, el reparto cambia: el servidor decide de verdad y
el rol del cliente pasa a ser **cosmético** — sirve para no enseñar botones que van a dar
403. Eso es correcto y suficiente, siempre que se entienda que **ocultar un botón no es
seguridad**. La seguridad la pone el 403.

## Pasos

### 1. El rol siempre viene de `/me`

Tras la tarea 03 esto ya es así en el arranque. Revisar que no queda ningún sitio donde
el rol se guarde localmente y se lea después como fuente de verdad.

```bash
grep -rn "Rol" src/ --include=*.js
```

Los usos legítimos son comparaciones sobre `user.Rol` del contexto, que viene de `/me`.
Cualquier lectura desde almacenamiento local debe desaparecer.

### 2. Refrescar el rol al reanudar

Un administrador degradado a usuario normal mantendría el panel abierto mientras no
cierre la app. Revalidar cuando la app vuelve a primer plano:

```js
useEffect(() => {
  const sub = AppState.addEventListener("change", async (estado) => {
    if (estado === "active" && (await leerToken())) {
      try {
        setUser(await apiFetch("/usuario/me"));
      } catch { /* el 401 ya lo trata apiFetch */ }
    }
  });
  return () => sub.remove();
}, []);
```

Va en `AppProvider`, que es donde vive `user`.

**No añadir un temporizador periódico.** La app ya tiene bastante actividad en segundo
plano durante la partida, y `PartidaEnCurso.js` es sensible a los ciclos de render.

### 3. Tratar el 403 como respuesta esperada

En `apiFetch`, un 403 no es un fallo del sistema: es el servidor diciendo que no. Debe
producir un mensaje comprensible («No tienes permiso para esta acción») y **no** cerrar
la sesión — a diferencia del 401.

Distinguir bien los tres casos es lo que evita el bucle más molesto: cerrar sesión ante
un 403, reentrar, volver a intentarlo y cerrar sesión otra vez.

| Código | Significado | Qué hace la app |
|---|---|---|
| 401 | Sesión inválida o caducada | Borra token, va al login |
| 403 | Sesión válida, sin permiso | Mensaje, mantiene la sesión |
| 409 | Boleto ya vendido (backend 06) | Mensaje específico, refresca la lista |
| 422 | Validación (saldo insuficiente) | Muestra el mensaje del servidor |

### 4. Revisar las pantallas de administración

`TabsAdmin.js` y las pantallas de `src/screens/Admin/` llaman a rutas que ahora exigen
ADMIN. Comprobar que ninguna se renderiza para un usuario normal, y que si alguna llamada
da 403 la pantalla **no se queda cargando para siempre**.

### 5. Revisar el modo invitado

`Rol: "GUEST"` no tiene token, así que **toda ruta protegida le devolverá 401**. Repasar
qué ve un invitado hoy:

- `Boletos.js` → `setOpcBoleto(user.Rol == "GUEST")`
- `Perfil.js` → `setOpcUser(user.Rol == "GUEST")`
- `MisBoletos.js` → condicionado a `Rol == "USER"`

Decidir, **con el usuario**, qué debe ver un invitado ahora que la API está cerrada. Dos
opciones razonables:

- **Que el invitado pueda ver la partida en curso.** Requiere que el backend deje
  públicas las rutas de consulta, lo que contradice su tarea 05.
- **Que el invitado solo vea una pantalla de presentación** que invite a registrarse.

**Es una decisión de producto, no técnica.** Este plan no la toma: la plantea y espera
respuesta. Si se elige la primera, hay que abrir esas rutas en el backend y anotarlo como
desviación en ambos `ESTADO.md`.

### 6. Ocultar lo que va a fallar

Con el rol del servidor, esconder las acciones que darían 403. No es seguridad —es no
enseñar botones rotos.

## Verificación automática

- [ ] `grep -rn "Rol" src/` no muestra ninguna lectura de rol desde almacenamiento local.
- [ ] Compila (`expo export`).
- [ ] `apiFetch` distingue explícitamente 401, 403, 409 y 422.
- [ ] `grep -rn "AppState" src/context/AppProvider.js` encuentra el listener del paso 2.

## Prueba en dispositivo — obligatoria

Con **dos cuentas**, una `ADMIN` y otra `USER`:

- [ ] Como **USER**: no aparece el panel de administración por ninguna vía.
- [ ] Como **ADMIN**: el panel funciona y las operaciones de crédito responden 200.
- [ ] Como **USER**, forzar una llamada de administración (por ejemplo desde la consola,
      `apiFetch("/usuario", {})`): devuelve 403, se ve un mensaje **y la sesión sigue
      abierta**. Es el check clave de esta tarea.
- [ ] Como **invitado**: la app se comporta según lo decidido en el paso 5, sin pantallas
      colgadas ni errores en crudo.
- [ ] Comprar un boleto ya vendido → mensaje claro (409), sin quedarse cargando.
- [ ] Comprar sin saldo → mensaje de saldo insuficiente (422).
- [ ] **La partida en curso funciona igual que antes**: números que salen, audio, y el
      modo automático sin repetir. `PartidaEnCurso.js` no se tocó, pero usa el cliente
      HTTP nuevo y conviene confirmarlo.

No commitear sin confirmación explícita del usuario.

## Criterio de finalización

Los cuatro checks automáticos y los siete de dispositivo, en verde. La decisión sobre el
invitado, tomada y anotada en `ESTADO.md`.

```
sec(04): rol desde el servidor y manejo de 403 en el cliente
```
