# 04 — El flujo del jugador: comprar y ver boletos

**Depende de:** [03](03-humo-y-sesion.md) · **Técnicas:** [TECNICAS-ADB.md](TECNICAS-ADB.md)

## Objetivo

Probar la razón de ser del producto: que un jugador pueda comprar un boleto y verlo.

## Aviso: hay una regresión confirmada en 4.2/4.3

Los planes de corrección **ya se ejecutaron**, así que 4.1 debería dar **200**. Pero el
arreglo del bug 2 introdujo una regresión en la app, confirmada contra la API real el
2026-08-30:

`obtenerBoletosPartida` ahora devuelve `idUsuario` como **booleano** (`false` libre, `true`
vendido) en vez de `null`/id — correcto, es lo que evita la fuga de datos. Comprobado con
`curl`: 99 libres y 1 vendido en la partida 86, todos con `idUsuario` de tipo `bool`.

El problema está en `ItemBoleto.js:12`, que **no se adaptó**:

```js
disabled={boleto.idUsuario != null}
```

En JavaScript **`false != null` es `true`**. Con `idUsuario` booleano, esa expresión da
`true` para *todos* los boletos: **los 99 libres quedan sin responder al toque.**

Y es un fallo silencioso: la línea 14 usa truthiness (`boleto.idUsuario ? ... : ...`), que
sí distingue, así que los libres **se verán habilitados pero no reaccionarán**. Sin error,
sin aviso.

**Consecuencia para esta tarea:** se espera que 4.3 falle y que 4.4–4.7 queden bloqueadas.
El bug de "el jugador no puede comprar" no está resuelto: se movió del backend (403) a la
app (boletos que no responden).

**No lo arregles aquí.** Anótalo como regresión confirmada y sigue. El arreglo es de una
línea, pero necesita su propio commit y una verificación real.

## Pruebas

Con la cuenta USER de prueba, con saldo, y la partida creada en la tarea 02.

### 4.1 — Ver boletos disponibles

Navegar a la pestaña **Boletos** y volcar.

- [ ] En el log: `GET /api/boleto/obtener-boletos-partida/{id}` con **200**.
      Un **403** significaría que el arreglo del backend se revirtió.
- [ ] El volcado muestra boletos (números de serie).

### 4.2 — Vendidos vs. libres

- [ ] El volcado muestra alguno como **NO DISPONIBLE**, y pulsarlo no abre nada.
- [ ] **Los libres abren el modal.** ⚠️ Aquí es donde muerde la regresión: se espera que
      **no** se abran. Confirmarlo pulsando varios boletos libres distintos y comprobando
      que el volcado no cambia.

Ésta es la prueba que verifica si el cambio de `idUsuario` a booleano rompió `ItemBoleto`.
Según el análisis del código, lo rompió. Confirmarlo en ejecución es el objetivo.

### 4.3 — Abrir un boleto

Pulsar uno libre y volcar.

- [ ] El modal muestra **15 números**.
- [ ] Están entre 1 y 90, sin repetidos dentro del cartón.

**Anotar los 15 números y el número de serie.** Los necesita la prueba 4.5.

### 4.4 — Comprar

**Antes**, medir:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$u = \App\Models\Usuario::where('Telefono','+59169990002')->first();
echo 'Creditos: '.\$u->Creditos.' Compras: '.\App\Models\Compra::count().PHP_EOL;"
```

Confirmar la compra en la app, y volver a medir con el mismo comando.

- [ ] En el log: `POST /api/compra/crear` con **200**.
- [ ] **El saldo bajó exactamente el precio del boleto** (30 en la partida al redactar el
      plan). Ni más, ni menos, ni igual.
- [ ] `Compra::count()` subió en **exactamente 1**.
- [ ] El boleto quedó asignado:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$b = \App\Models\Boleto::where('NroSerial','<serial>')->first();
echo 'idUsuario: '.var_export(\$b->idUsuario, true).PHP_EOL;"
```

El saldo es el punto crítico: es dinero real. Si baja de más, de menos, o la compra se
duplica, es **grave**. Anotar las cifras exactas antes y después.

### 4.5 — Mis Boletos

Navegar a **Mis Boletos** y volcar.

- [ ] Aparece el boleto comprado.
- [ ] **Los 15 números coinciden** con los anotados en 4.3.

Esto es lo que se prueba de verdad: `ItemMiBoleto.js:46` usa `Object.values(boleto).slice(4)`,
que **depende del orden de las columnas** que devuelve la API. Si el backend reordena sus
campos, aquí se verían números equivocados **sin ningún error**. Es un fallo silencioso y
ésta es la única forma de detectarlo.

Contrastar con la base para no depender solo del volcado:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$b = \App\Models\Boleto::where('NroSerial','<serial>')->first();
for (\$i=1; \$i<=15; \$i++) { echo \$b->{'Nro'.\$i}.' '; } echo PHP_EOL;"
```

Si no cuadran: **hallazgo grave**. Anotar ambas listas.

### 4.6 — Saldo insuficiente

Comprar hasta quedar por debajo del precio, e intentar uno más.

- [ ] En el log: **422**.
- [ ] **El saldo no queda negativo** (comprobar por consola).
- [ ] `Compra::count()` **no subió** en ese intento.
- [ ] El volcado muestra un mensaje con sentido, no un error genérico.

### 4.7 — Boleto ya vendido

Difícil de forzar. Si sale de forma natural, anotar qué pasa; si no, ⏭.

- [ ] Mensaje razonable y **sin doble cobro** (`Compra::count()` sube como mucho 1).

## Verificación

- [ ] Las siete pruebas anotadas con ✅/❌/⏭.
- [ ] Las cifras de saldo y `Compra::count()` antes/después de 4.4 y 4.6, registradas.
- [ ] Los 15 números de 4.3 y 4.5, anotados y comparados.
- [ ] La regresión de `ItemBoleto.js:12` confirmada o desmentida **en ejecución**, no solo
      por lectura del código.

## Criterio de finalización

Las siete anotadas. Si 4.3 falla por la regresión, 4.4–4.7 se marcan ⏭ con ese motivo y se
pasa a la tarea 05. Confirmar la regresión **es** el resultado valioso de esta tarea.
