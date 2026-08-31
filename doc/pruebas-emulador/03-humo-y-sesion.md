# 03 — Arranque, login, invitado y cierre de sesión

**Depende de:** [02](02-datos-de-prueba.md)

## Objetivo

Probar la capa de sesión: la parte que introdujo la etapa de seguridad y que **nunca se ha
ejercitado entera en un dispositivo**.

## Por qué esto va primero

Si la sesión falla, todo lo demás falla por arrastre y no aprenderías nada de las tareas
siguientes. Además es la zona de mayor riesgo del proyecto: tokens en `expo-secure-store`,
un `apiFetch` central y un emisor de eventos para la caducidad, todo escrito sin poder
probarlo.

## Cómo anotar

Cada prueba: **✅ pasa · ❌ falla · ⏭ no se pudo probar**. Un fallo se anota con lo que
se vio en pantalla y, si aparece, lo que dijo la terminal de Metro o la del backend. La
terminal del backend es la más útil: enseña la petición y su código de estado.

## Pruebas

### 3.1 — Arranque en frío

Cerrar la app por completo y abrirla.

- [ ] Llega a la pantalla de login sin pantalla en blanco ni error rojo.
- [ ] No aparece ningún error en crudo (`TypeError`, `undefined is not an object`).

### 3.2 — Login correcto (USER)

Con la cuenta de prueba de la tarea 02.

- [ ] Entra y muestra la pantalla del jugador.
- [ ] El **saldo mostrado coincide** con los créditos asignados.
- [ ] En la terminal del backend: `POST /api/usuario/authenticarte` con **200**.

### 3.3 — Login incorrecto

Misma cuenta, clave equivocada.

- [ ] Mensaje de credenciales inválidas, **no** un error genérico ni una pantalla colgada.
- [ ] En el backend: **401**. Si ves un **500**, es el bug 3 — anótalo y comprueba si la
      cuenta tiene la clave sin hashear.

### 3.4 — La sesión sobrevive al reinicio

Con la sesión abierta, cerrar la app del todo y volver a abrirla.

- [ ] **Entra directo, sin pedir credenciales.** Es la prueba de que el token se guardó en
      `expo-secure-store` y se relee.
- [ ] En el backend: un `GET /api/usuario/me` con **200**.

Si vuelve al login, el token no persiste: es un hallazgo importante de la etapa de
seguridad.

### 3.5 — Modo invitado

Desde el login, entrar como invitado.

- [ ] Muestra la pantalla de presentación.
- [ ] **No hay pantallas colgadas ni errores en crudo**, aunque el backend devuelva 401 en
      las peticiones que el invitado no puede hacer. Los 401 son esperados; lo que se está
      probando es que la app los maneje con elegancia.

### 3.6 — Cerrar sesión

Con la sesión de USER abierta.

- [ ] Vuelve al login limpio.
- [ ] En el backend: `POST /api/usuario/logout` con **200**.
- [ ] Al reabrir la app **pide credenciales otra vez**: el token se borró de verdad.

### 3.7 — Token inválido (la prueba que nadie ha hecho)

Ésta ejercita el camino de sesión caducada, escrito en la etapa de seguridad y **jamás
ejecutado**. Con la sesión abierta y la app en primer plano, revoca el token desde consola:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$u = \App\Models\Usuario::where('Telefono','+591 69990002')->first();
\$u->tokens()->delete();
echo 'Tokens revocados'.PHP_EOL;"
```

Ahora, en la app, navega a cualquier pantalla que cargue datos.

- [ ] La app **detecta la sesión caducada y vuelve al login**, en vez de quedarse en una
      pantalla vacía o reventar.
- [ ] En el backend: un **401**.

Éste es el circuito `apiFetch` → `borrarToken` → `emitirSesionExpirada` →
`AppProvider`. Si falla, un usuario con token caducado se queda con la app inutilizable
hasta que la reinstale. **Es el hallazgo más valioso que puede dar esta tarea.**

## Verificación

- [ ] Las siete pruebas ejecutadas y anotadas con ✅/❌/⏭.
- [ ] Cada ❌ tiene: qué se vio, y el código de estado del backend.

## Criterio de finalización

Las siete anotadas. **Si 3.2 falla, detén la sesión**: sin poder entrar, las tareas 04–06
son inejecutables.
