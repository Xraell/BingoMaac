# 04 — El flujo del jugador: comprar y ver boletos

**Depende de:** [03](03-humo-y-sesion.md)

## Objetivo

Probar la razón de ser del producto: que un jugador pueda comprar un boleto y verlo.

## Aviso: puede estar bloqueado desde el primer paso

Si la tarea 01 confirmó que el **bug 2 sigue vivo** (`obtener-boletos-partida` dentro del
grupo `admin`), la prueba 4.1 va a fallar con un **403** y **todo lo demás de esta tarea
queda bloqueado**: sin listado no hay dónde pulsar para comprar.

No es un descubrimiento: es el bug ya conocido. Anotarlo como *esperado*, marcar el resto
⏭ y pasar a la tarea 05.

**Si quieres desbloquear la sesión** y probar la compra igualmente, ejecuta antes el plan
`BACKEND/doc/correccion-hallazgos/` (tarea 02). Es la decisión más rentable: sin eso, esta
tarea no aporta nada.

## Pruebas

Con la cuenta USER de prueba, con saldo, y la partida creada en la tarea 02.

### 4.1 — Ver boletos disponibles

Pestaña **Boletos**.

- [ ] Carga el listado de boletos de la partida actual.
- [ ] Se ve el número de partida y su descripción en la cabecera.
- [ ] En el backend: `GET /api/boleto/obtener-boletos-partida/{id}` con **200**.
      Un **403** es el bug 2.

### 4.2 — Boletos vendidos vs. libres

- [ ] Los ya vendidos aparecen marcados **NO DISPONIBLE** y **no se pueden pulsar**.
- [ ] Los libres sí se abren.

Esta prueba importa más de lo que parece: si el plan del backend ya se ejecutó, cambió
`idUsuario` por un booleano, y **ésta es la comprobación de que ese cambio no rompió
`ItemBoleto`**.

### 4.3 — Abrir un boleto

Pulsar uno libre.

- [ ] Se abre el modal con los **15 números** del cartón.
- [ ] Los números son plausibles (1–90, sin repetidos dentro del cartón).

### 4.4 — Comprar

Confirmar la compra. **Anotar el saldo antes.**

- [ ] La compra se confirma sin error.
- [ ] **El saldo baja exactamente el precio del boleto** (30 en la partida actual). Ni más,
      ni menos, ni queda igual.
- [ ] El boleto pasa a **NO DISPONIBLE** en el listado.
- [ ] En el backend: `POST /api/compra/crear` con **200**.

El saldo es el punto crítico: es dinero real. Si baja de más o no baja, es un hallazgo
grave y hay que anotar el saldo antes y después.

### 4.5 — Mis Boletos

Pestaña **Mis Boletos**.

- [ ] Aparece el boleto recién comprado.
- [ ] **Los 15 números coinciden** con los que mostraba el modal al comprarlo.

La coincidencia es lo que se está probando de verdad: `ItemMiBoleto.js:46` usa
`Object.values(boleto).slice(4)`, que **depende del orden de las columnas** que devuelve la
API. Si el backend reordena sus campos, aquí se verían números equivocados **sin ningún
error**. Es un fallo silencioso, y esta prueba es la única forma de detectarlo.

Si no cuadran: hallazgo grave. Anotar ambas listas de 15 números.

### 4.6 — Saldo insuficiente

Comprar boletos hasta quedarte por debajo del precio, e intentar uno más.

- [ ] Aparece un mensaje **con sentido** (saldo insuficiente), no un error genérico.
- [ ] **El saldo no queda negativo.**
- [ ] En el backend: **422**.

### 4.7 — Comprar un boleto ya vendido

Difícil de forzar desde la interfaz. Si sale de forma natural (dos intentos seguidos sobre
el mismo), anotar qué pasa; si no, marcar ⏭.

- [ ] Mensaje razonable, sin doble cobro.

## Verificación

- [ ] Las siete pruebas anotadas con ✅/❌/⏭.
- [ ] Las cifras de saldo antes/después de 4.4 y 4.6 registradas.
- [ ] Si 4.1 dio 403, está anotado como **bug 2 conocido**, no como hallazgo nuevo.

## Criterio de finalización

Las siete anotadas. Si 4.1 falla por el bug conocido, el resto se marca ⏭ con ese motivo y
se continúa con la tarea 05.
