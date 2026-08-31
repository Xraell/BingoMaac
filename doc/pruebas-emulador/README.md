# Pruebas en emulador — App + Backend real

Plan de **pruebas manuales guiadas** de la app contra el backend levantado en local, en el
emulador `Xpancity_API_31`.

A diferencia de todas las etapas anteriores, esta **no cambia código**. Su entregable es
una respuesta: *¿qué funciona y qué no?*

## Por qué esta etapa es distinta

Las cinco etapas anteriores (refactor, estilos, seguridad, correcciones) se ejecutaron sin
poder abrir la app. Todas terminaron con la misma frase en su informe: *nada se probó en
ejecución*. Los tests demuestran que el código compila y que las peticiones salen bien
formadas; **no** que un jugador pueda comprar un boleto.

Esta etapa cierra ese hueco.

> **Regla que la gobierna: se observa, no se arregla.**

Si una prueba falla, se documenta con evidencia y se sigue con la siguiente. Arreglar sobre
la marcha invalida el resto de la sesión: ya no sabrías si lo que falló después es un bug
o consecuencia de tu parche.

## Requisito: la sesión es asistida

**Esta etapa necesita a la persona delante.** No es autónoma como sus hermanas:

- Hay que arrancar el emulador y mirar la pantalla.
- Hay pasos que solo un humano puede juzgar ("¿se ve bien?", "¿suena el audio?").
- Toca datos reales: la base tiene **226 compras y 52 partidas** de uso real.

El agente conduce, ejecuta comandos, guía paso a paso y va anotando. La persona mira,
responde y confirma.

## Tareas

| # | Tarea | Necesita mirar la pantalla |
|---|---|---|
| [01](01-preparacion-entorno.md) | Levantar backend, emulador y app | Parcial |
| [02](02-datos-de-prueba.md) | Preparar cuentas y partida de prueba | No |
| [03](03-humo-y-sesion.md) | Arranque, login, invitado, cerrar sesión | Sí |
| [04](04-flujo-jugador.md) | Comprar boleto y ver Mis Boletos | Sí |
| [05](05-flujo-admin.md) | Créditos, partidas, participantes, Excel | Sí |
| [06](06-partida-en-curso.md) | El juego: números, audio, ganadores | Sí |
| [07](07-informe.md) | Informe de resultados | No |

## El estado del código que se va a probar

Importa saberlo antes de empezar, porque cambia qué se espera de cada prueba:

| Etapa | Estado |
|---|---|
| Refactor, estilos, seguridad 01–04 | Aplicadas, **verificadas en emulador el 2026-08-30** |
| `correccion-hallazgos` (app y backend) | **Plan escrito, sin ejecutar** |

Es decir: **los tres bugs conocidos siguen presentes** salvo que se hayan ejecutado esos
planes entre medias. La tarea 01 lo comprueba y ajusta lo que se espera. No los des por
arreglados sin verificarlo.

## Lo que NO se hace aquí

- **No se arregla nada.** Ni un typo. Los hallazgos van a `RESULTADOS.md`.
- **No se tocan datos de producción a lo bruto.** La tarea 02 crea cuentas y una partida
  nuevas para no ensuciar las 226 compras existentes.
- No se prueban builds de producción (`api.js` sigue con el placeholder) ni EAS.
