# 04 — El flujo del jugador: comprar y ver boletos

**Depende de:** [03](03-humo-y-sesion.md) · **Técnicas:** [TECNICAS-ADB.md](TECNICAS-ADB.md)

## Objetivo

Probar la razón de ser del producto: que un jugador pueda comprar un boleto y verlo.

## Estado al empezar: todo arreglado

Los planes de corrección ya se ejecutaron, y la regresión que introdujo el arreglo del bug 2
también está corregida (commit `fix: los boletos libres vuelven a responder al toque`).

Eso significa que **esta tarea debería pasar entera**, y es justo lo que viene a comprobar:
que la cadena completa —ver boletos, abrir uno, comprarlo, verlo en Mis Boletos— funciona
de principio a fin contra el backend real.

Contexto útil por si algo falla: `obtener-boletos-partida` devuelve `idUsuario` como
**booleano** (`false` libre / `true` vendido), no como `null`/id. `ItemBoleto` ya usa
truthiness (`!!boleto.idUsuario`) y hay 5 tests que lo cubren. Si 4.2 o 4.3 fallaran, mirar
primero ahí.

## Pruebas

Con la cuenta USER de prueba, con saldo, y la partida creada en la tarea 02.

### 4.1 — Ver boletos disponibles

Navegar a la pestaña **Boletos** y volcar.

- [ ] En el log: `GET /api/boleto/obtener-boletos-partida/{id}` con **200**.
      Un **403** significaría que el arreglo del backend se revirtió.
- [ ] El volcado muestra boletos (números de serie).

### 4.2 — Vendidos vs. libres

- [ ] El volcado muestra alguno como **NO DISPONIBLE**, y pulsarlo no abre nada.
- [ ] **Los libres abren el modal.** Probar con varios distintos, no solo uno.

Ésta es la verificación en ejecución del arreglo de `ItemBoleto`: los tests demuestran que
el componente se comporta bien con `idUsuario` booleano, pero no que la pantalla real
responda al toque. Es exactamente el hueco que esta sesión cierra.

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
- [ ] El arreglo de `ItemBoleto` verificado **en ejecución**: un boleto libre se abre al
      pulsarlo.

## Criterio de finalización

Las siete anotadas. Si 4.3 fallara, 4.4–4.7 se marcan ⏭ con ese motivo y se pasa a la
tarea 05.
