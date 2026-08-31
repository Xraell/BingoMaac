# Pruebas en emulador — App + Backend real

Sesión de pruebas de la app contra el backend local, en el emulador `Xpancity_API_31`.

**El agente ejecuta las pruebas solo.** Arranca el emulador, instala la app, la maneja por
`adb`, comprueba los resultados contra la base de datos y el log del backend, y escribe el
informe. No hay que estar delante.

> **Regla que la gobierna: se observa, no se arregla.**

Si una prueba falla, se documenta con evidencia y se sigue. Arreglar sobre la marcha
invalida el resto de la sesión: ya no sabrías si lo que falla después es un bug o el parche.

## Cómo se prueba sin ojos

La clave de esta etapa es **no depender de mirar la pantalla**. Cuatro fuentes, y la más
importante no es la interfaz:

| Fuente | Para qué | Fiabilidad |
|---|---|---|
| **Base de datos** | ¿El saldo bajó 30? ¿Se creó la compra? | **Alta** — es la verdad |
| **Log de Laravel** + `--host` en primer plano | Qué petición llegó y con qué código | **Alta** |
| `adb shell uiautomator dump` | Texto en pantalla, y dónde pulsar | Media |
| `adb exec-out screencap` | Captura, como prueba adjunta | Baja para decidir |

**El orden importa.** Una compra se da por buena porque la fila está en `compras` y el saldo
bajó exactamente 30 — no porque la pantalla dijera "éxito". La interfaz sirve para *operar*
la app; la base de datos y el log, para *juzgar* el resultado.

Ese es el motivo de que esta etapa pueda correr sola: casi todo lo que importa es
verificable sin ver nada.

## Lo que sigue necesitando a una persona

Poco, y no bloquea:

| Qué | Por qué | Cómo se trata |
|---|---|---|
| **El audio** | `adb` no puede escuchar | Se deja sonando; el agente anota **cuándo** debía sonar para que lo confirmes al pasar |
| **Aspecto visual** | Ninguna captura sustituye a un ojo | Capturas adjuntas al informe, sin veredicto |

Todo lo demás —sesión, compras, saldos, créditos, números sin repetir— se verifica solo.

## Tareas

| # | Tarea | Autónoma |
|---|---|---|
| [01](01-preparacion-entorno.md) | Levantar backend, emulador y app | Sí |
| [02](02-datos-de-prueba.md) | Respaldo, cuentas y partida de prueba | Sí |
| [03](03-humo-y-sesion.md) | Arranque, login, invitado, token caducado | Sí |
| [04](04-flujo-jugador.md) | Comprar boleto y ver Mis Boletos | Sí |
| [05](05-flujo-admin.md) | Créditos, partidas, participantes, Excel | Sí |
| [06](06-partida-en-curso.md) | El juego: números, ganadores | Sí (audio aparte) |
| [07](07-informe.md) | Informe de resultados | Sí |

## El estado del código que se va a probar

| Etapa | Estado |
|---|---|
| Refactor, estilos, seguridad 01–04 | Aplicadas y verificadas en emulador el 2026-08-30 |
| `correccion-hallazgos` (app y backend) | **Ejecutadas.** 46 tests del backend en verde |

Los tres bugs conocidos están arreglados. Esta sesión es de **aseguramiento**: confirmar en
ejecución lo que los tests no pueden demostrar.

Durante la preparación de esta sesión se detectó y arregló una regresión: el arreglo del
bug 2 hizo que `obtener-boletos-partida` devolviera `idUsuario` como booleano, y
`ItemBoleto.js` seguía comparándolo con `!= null` — en JavaScript `false != null` es `true`,
así que **ningún boleto respondía al toque**. Corregido y cubierto con 5 tests.

Queda verificarlo en ejecución, que es lo que ningún test puede hacer: la prueba 4.3.

## Lo que NO se hace aquí

- **No se arregla nada.** Ni un typo. Los hallazgos van a `RESULTADOS.md`.
- **No se tocan datos reales a lo bruto.** La base tiene **226 compras** de uso real: la
  tarea 02 hace respaldo y crea cuentas y partida nuevas.
- No se prueban builds de producción ni EAS.
