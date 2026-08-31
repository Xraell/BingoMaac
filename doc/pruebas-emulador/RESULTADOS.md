# Resultados en bruto

Registro de la sesión, tal cual va saliendo. **Se escribe mientras se prueba, no al final**:
lo que no se anota en el momento se olvida o se recuerda mal.

`INFORME.md` (tarea 07) es la versión ordenada de este documento. Este se conserva.

## Convención

`✅ pasa · ❌ falla · ⏭ no se pudo probar`

Cada ❌ necesita: **qué se hizo · qué se esperaba · qué pasó · código de estado del backend**.

Un ✅ solo se pone cuando se verificó contra la **base de datos o el log**, no porque la
pantalla lo dijera. El audio nunca es ✅: `adb` no puede escuchar.

---

## Tarea 03 — Humo y sesión

| # | Prueba | Res. | Notas |
|---|---|---|---|
| 3.1 | Arranque en frío | | |
| 3.2 | Login correcto | | |
| 3.3 | Login incorrecto | | |
| 3.4 | Sesión sobrevive al reinicio | | |
| 3.5 | Modo invitado | | |
| 3.6 | Cerrar sesión | | |
| 3.7 | Token revocado → vuelve al login | | |

## Tarea 04 — Jugador

| # | Prueba | Res. | Notas |
|---|---|---|---|
| 4.1 | Ver boletos disponibles | | |
| 4.2 | Vendidos vs. libres | | |
| 4.3 | Abrir un boleto | | |
| 4.4 | Comprar | | Saldo: ___→___ · Compras: ___→___ |
| 4.5 | Mis Boletos: números coinciden | | |
| 4.6 | Saldo insuficiente | | |
| 4.7 | Boleto ya vendido | | |

## Tarea 05 — Admin

| # | Prueba | Res. | Notas |
|---|---|---|---|
| 5.1 | Panel solo para ADMIN | | |
| 5.2 | Listados | | |
| 5.3 | Agregar créditos (botones) | | Código: ___ |
| 5.3 | Agregar créditos (tecleado) | | Código: ___ |
| 5.4 | Retirar créditos | | |
| 5.5 | Bono de referido 20 % | | |
| 5.6 | Crear partida y boletos | | |
| 5.7 | Exportar a Excel | | |
| 5.8 | Eliminar usuario de prueba | | |

## Tarea 06 — Partida

| # | Prueba | Res. | Notas |
|---|---|---|---|
| 6.1 | Cantar número | | |
| 6.1b | Audio (⏭ humano) | | Hora: |
| 6.2 | Automático sin repetir | | Total/únicos: ___/___ · Números: |
| 6.3 | Detener y reanudar | | |
| 6.4 | Persisten al volver | | |
| 6.5 | El jugador los ve | | |
| 6.6 | Ganadores | | |
| 6.7 | Cerrar partida | | |

---

## Hallazgos nuevos

Los que no estaban en `doc/PENDIENTE.md`.

_(vacío)_

## Regresiones y bugs conocidos, a confirmar en ejecución

### Regresión abierta: `ItemBoleto.js:12` (detectada 2026-08-30, sin arreglar)

Tras el arreglo del bug 2, `obtener-boletos-partida` devuelve `idUsuario` **booleano**
(`false` libre / `true` vendido) en vez de `null`/id. Verificado con `curl` contra la
partida 86: 99 libres, 1 vendido, todos de tipo `bool`.

`ItemBoleto.js:12` no se adaptó:

```js
disabled={boleto.idUsuario != null}   // false != null  ===  true
```

**Efecto esperado:** los boletos libres se ven habilitados (la línea 14 usa truthiness y sí
distingue) pero **no responden al toque**. El jugador sigue sin poder comprar; el bloqueo
se movió del backend a la app.

Confirmar en la prueba 4.3. Resultado: ______

### Bugs de los planes de corrección

Los tres estaban arreglados en código al empezar. Anotar aquí si alguno reapareciera.

_(vacío)_

## Pendiente de confirmación humana

Lo que el agente no pudo juzgar. **El audio va siempre aquí.**

| Qué | Cuándo | Cómo confirmarlo |
|---|---|---|
| Audio al cantar número | | Escucharlo al pasar |

## Notas de entorno

Problemas de montaje, no de la app.

_(vacío)_
