# 03 — Arranque, login, invitado y cierre de sesión

**Depende de:** [02](02-datos-de-prueba.md) · **Técnicas:** [TECNICAS-ADB.md](TECNICAS-ADB.md)

## Objetivo

Probar la capa de sesión: lo que introdujo la etapa de seguridad y **nunca se ha ejercitado
entero en un dispositivo**.

## Por qué va primero

Si la sesión falla, todo lo demás falla por arrastre. Además es la zona de mayor riesgo:
tokens en `expo-secure-store`, un `apiFetch` central y un emisor de eventos para la
caducidad, todo escrito sin poder probarlo.

## Cómo juzgar cada prueba

`✅ pasa · ❌ falla · ⏭ no se pudo probar`

Cada prueba dice **cómo se verifica sin mirar**. Cuando haya duda entre lo que muestra la
pantalla y lo que dicen el log o la base de datos, **manda el log**. Todo ❌ se anota con el
código de estado del backend.

## Pruebas

### 3.1 — Arranque en frío

```bash
adb shell am force-stop host.exp.exponent
```

Relanzar la app y volcar la UI.

- [ ] El volcado muestra la **pantalla de login**.
- [ ] No aparece texto de error en crudo (`TypeError`, `undefined is not an object`).
      Buscarlo explícitamente en el volcado, no darlo por hecho.

### 3.2 — Login correcto (USER)

Con la cuenta de prueba: localizar los campos en el volcado, `input tap` + `input text`,
pulsar entrar.

**Verificación (log + base):**

- [ ] En la salida de `artisan serve`: `POST /api/usuario/authenticarte` con **200**.
- [ ] Se creó un token:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$u = \App\Models\Usuario::where('Telefono','+59169990002')->first();
echo 'Tokens: '.\$u->tokens()->count().PHP_EOL;"
```

Debe ser ≥ 1. **Ésta es la prueba real de que el login funcionó**, más que cualquier
pantalla.

- [ ] El volcado ya no muestra el login.

### 3.3 — Login incorrecto

Cerrar sesión y entrar con clave equivocada.

- [ ] En el log: **401**. Un **500** es el bug 3 — comprobar si esa cuenta tiene la clave
      sin hashear antes de anotarlo como hallazgo nuevo.
- [ ] La app **sigue en el login**, no avanza.

### 3.4 — La sesión sobrevive al reinicio

Con sesión abierta:

```bash
adb shell am force-stop host.exp.exponent
```

Relanzar y volcar.

- [ ] **Entra directo, sin pedir credenciales**: el volcado no muestra el login.
- [ ] En el log: un `GET /api/usuario/me` con **200**.

Si vuelve al login, el token no persiste en `expo-secure-store`: hallazgo importante de la
etapa de seguridad.

### 3.5 — Modo invitado

Cerrar sesión, entrar como invitado.

- [ ] El volcado muestra la pantalla de presentación.
- [ ] **Sin texto de error en crudo**, aunque el log muestre 401 en las peticiones que el
      invitado no puede hacer. Los 401 son esperados; lo que se prueba es que la app los
      maneje con elegancia.

### 3.6 — Cerrar sesión

- [ ] En el log: `POST /api/usuario/logout` con **200**.
- [ ] El token se borró del servidor:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$u = \App\Models\Usuario::where('Telefono','+59169990002')->first();
echo 'Tokens: '.\$u->tokens()->count().PHP_EOL;"
```

- [ ] Tras reiniciar la app, el volcado **vuelve a mostrar el login**.

### 3.7 — Token revocado (la prueba que nadie ha hecho)

Ejercita el camino de sesión caducada, escrito en la etapa de seguridad y **jamás
ejecutado**. Con sesión abierta y la app en primer plano:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$u = \App\Models\Usuario::where('Telefono','+59169990002')->first();
\$u->tokens()->delete();
echo 'Tokens revocados'.PHP_EOL;"
```

Navegar a cualquier pantalla que cargue datos y volcar.

- [ ] En el log: un **401**.
- [ ] La app **vuelve al login**, en vez de quedarse en una pantalla vacía o reventar.

Es el circuito `apiFetch` → `borrarToken` → `emitirSesionExpirada` → `AppProvider`. Si
falla, un usuario con token caducado se queda con la app inutilizable hasta reinstalarla.
**Es el hallazgo más valioso que puede dar esta tarea.**

## Verificación

- [ ] Las siete pruebas anotadas con ✅/❌/⏭.
- [ ] Cada ❌ con el código de estado del backend y lo que se vio en el volcado.
- [ ] Las comprobaciones de tokens de 3.2, 3.6 y 3.7 registradas con su cifra.

## Criterio de finalización

Las siete anotadas. **Si 3.2 falla, detén la sesión**: sin poder entrar, las tareas 04–06
son inejecutables.
