---
name: probar-app
description: Ejecuta de forma autonoma una sesion de pruebas de la app en el emulador Xpancity con el backend levantado en local, manejandolo por adb y verificando contra la base de datos. Usar cuando se pida probar la app en el emulador, verificar funcionalidades en dispositivo o ejecutar el plan de doc/pruebas-emulador. Recibe 01-07, estado, resultados o vacio.
---

# Probar la app en el emulador

Ejecuta el plan de `doc/pruebas-emulador/` contra el backend real, en `Xpancity_API_31`.

**Corre sola.** Arrancas el emulador, instalas la app, la manejas por `adb`, verificas
contra la base de datos y el log, y escribes el informe. La persona no está delante.

## La regla que gobierna todo

> **Se observa, se anota, no se arregla.**

Si una prueba falla, documéntalo y sigue con la siguiente. **No toques código durante la
sesión**, ni para un typo evidente.

Dos razones: arreglar a mitad invalida el resto (ya no sabrías si lo que falla después es un
bug o tu parche), y esta etapa tiene prohibido cambiar `src/`. Los arreglos tienen sus
propios planes, con tests.

Al terminar, `git status --short` **no debe mostrar ni un cambio en `src/`**.

## Argumento

| Valor | Acción |
|---|---|
| _(vacío)_ | Sesión completa: tareas 01 a 07, en orden |
| `01`–`07` | Solo esa tarea |
| `estado` | Muestra el progreso; no modifica nada |
| `resultados` | Muestra `RESULTADOS.md`; no modifica nada |

Si el argumento no coincide, muestra esta tabla y detente.

## Cómo se prueba sin mirar

Lo que hace posible esta etapa. **Léelo antes de empezar:**
[TECNICAS-ADB.md](../../../doc/pruebas-emulador/TECNICAS-ADB.md).

> **La interfaz sirve para operar la app. La base de datos y el log, para juzgar.**

Una compra no se da por buena porque la pantalla diga "éxito", sino porque hay una fila
nueva en `compras` y el saldo bajó **exactamente 30**.

| Fuente | Para qué | Fiabilidad |
|---|---|---|
| Base de datos (`php artisan tinker`) | El resultado real | **Alta** |
| Salida de `artisan serve` + `laravel.log` | Qué petición llegó y con qué código | **Alta** |
| `adb shell uiautomator dump` | Texto en pantalla y dónde pulsar | Media |
| `adb exec-out screencap` | Prueba adjunta | Baja para decidir |

**Nunca pongas ✅ a algo que solo viste en pantalla.** Si interfaz y base de datos
discrepan, manda la base de datos — y esa discrepancia es en sí un hallazgo grave.

## Lo único que no puedes juzgar

**El audio.** `adb` no puede escuchar, y `ItemNro.js` lo dispara con `index === 0`: si esa
condición falla, no suena, sin error.

Se trata así, sin bloquear nada: sube el volumen (tarea 01), **anota la hora exacta** de
cada número cantado, y márcalo **⏭ pendiente de confirmación humana**. La persona lo
confirmará al pasar.

**Nunca ✅.** Que la app no dé error no significa que suene.

Lo mismo con el aspecto visual: adjunta capturas, no veredictos.

## Distinguir lo conocido de lo nuevo

**Haz siempre la tarea 01**, aunque te salten a otra: comprueba si los tres bugs conocidos
siguen vivos y determina qué esperar.

Un fallo previsto no es un hallazgo. Si el bug 2 sigue, la pestaña Boletos dará 403 y eso
ya se sabe: se anota como *conocido, confirmado*. Mezclarlo con los hallazgos nuevos haría
inútil el informe, que es lo que esta etapa viene a producir.

## Cuidado: hay datos reales

La base local tiene **20 usuarios, 52 partidas y 226 compras de uso real**.

- **La tarea 02 hace copia de seguridad. No la saltes.** Sin respaldo, no empieces la 04 ni
  la 05.
- El `.sql` va **fuera del repositorio** (scratchpad): contiene datos de usuarios reales.
- **Nunca borres usuarios reales** ni cambies la clave del ADMIN del dueño.
- Crea cuentas y partida nuevas. Están para eso.

## El montaje que más falla

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan serve --host=0.0.0.0 --port=8080
```

**`--host=0.0.0.0` no es opcional.** Sin él el backend solo escucha en `127.0.0.1` y desde
el emulador todo da "connection refused": la app arranca pero nada carga. Es el fallo más
común y el que más se confunde con un bug de la app.

Lánzalo en segundo plano y **no lo mates hasta la tarea 07**: su salida es el registro de
peticiones con el que juzgas casi todo.

`src/config/api.js` ya apunta a `http://10.0.2.2:8080/api` en desarrollo. **No lo
modifiques**, ni para rellenar el placeholder de producción.

## Esperar bien

Nunca duermas a ciegas. Espera **comprobando una condición**, con un tope por si algo se
colgó:

- Emulador arrancado: `adb wait-for-device` y luego `getprop sys.boot_completed` hasta `1`.
- Bundle cargado: volcar la UI y buscar el texto esperado.
- Números del automático: consultar el recuento en base hasta llegar a 10, con tope.

Si se agota el tope, es un resultado: anótalo y sigue.

## Cuándo detenerte

| Situación | Qué haces |
|---|---|
| La app no llega al login (tarea 01) | **Detente.** Todo lo demás fallaría por lo mismo |
| El login falla (3.2) | **Detente.** Las tareas 04–06 son inejecutables |
| MySQL no arranca y no puedes arrancarlo | **Detente** y anótalo: sin base no hay sesión |
| Falla una prueba suelta | Anota, sigue con la siguiente |
| Una tarea entera queda bloqueada | Sus pruebas ⏭ con el motivo, pasa a la siguiente |
| Una pantalla no se deja manejar por `adb` | Captura, ⏭ con lo que intentaste, sigue |
| Fallo del montaje (backend caído, emulador colgado) | Arréglalo, anótalo como **nota de entorno**, no como bug |
| Encuentras un bug nuevo | `RESULTADOS.md`, **no lo arregles**, sigue |

Las tareas 04, 05 y 06 son **independientes**: que la 04 quede bloqueada por el bug 2 no
impide hacer la 05.

## Anota mientras pruebas

En `RESULTADOS.md`, **en el momento**, no al final. Una sesión larga que lo deja todo para
el cierre pierde detalles, y el detalle es el entregable.

## Al terminar

Escribe `INFORME.md` (tarea 07). Sé literal: qué pasó, qué falló, qué no se pudo probar.

Dos cosas que suelen quedar mal:

- **Lo que funciona también se escribe.** Es la mitad útil que se olvida, y evita que la
  próxima sesión repita lo comprobado.
- **Un ⏭ bien explicado vale más que un ✅ dudoso.** Éste es el primer informe del proyecto
  que puede afirmar que algo funciona de verdad; no lo malgastes con suposiciones.

Commit final: `INFORME.md`, `RESULTADOS.md`, `ESTADO.md`, `PENDIENTE.md`. **Nada de
código.** Ficheros uno por uno, nunca `git add -A`. No hagas `push`.

Deja el emulador y el backend corriendo, salvo que la persona pidiera lo contrario: puede
querer mirar algo.

## Límites

**No hagas nunca:**

- Modificar `src/` ni el código del backend. Ni un typo.
- Rellenar `src/config/api.js`: nadie sabe el dominio real y no hace falta aquí.
- Borrar usuarios, partidas o compras reales.
- Cambiar la clave del ADMIN del dueño.
- Empezar la 04 o la 05 sin el respaldo de la 02.
- Inyectar ganadores en la base para que 6.6 pase. Un ganador fabricado no prueba la lógica
  de detección, que es justo lo que se quiere probar.
- Ejecutar los planes de corrección para desbloquear una prueba. Recomiéndalo en el
  informe; no lo hagas.
- Marcar ✅ el audio, o cualquier cosa que no verificaras contra base de datos o log.
- `git push`, `git reset --hard`, borrar tags.

**No preguntes a la persona.** No está. Si algo exige su decisión, anótalo y sigue.

## Notas del proyecto

- App de bingo 90 bolas de **dinero real**: cualquier fallo en saldos, compras o créditos es
  **grave**, aunque parezca pequeño.
- Emulador: `Xpancity_API_31`. AVDs en
  `$LOCALAPPDATA/Android/Sdk/emulator/emulator.exe -list-avds`.
- Gestor: **pnpm**, nunca `npm install`.
- Backend: Laravel 12 + MariaDB (XAMPP); hay que arrancar MySQL.
- Precio del boleto al redactar el plan: **30**.
- `PartidaEnCurso.js` y `ItemMiBoleto.js` no tienen tests y son zona prohibida en las otras
  etapas. **Las pruebas 6.2 y 4.5 son la única verificación que van a recibir.**
- Contexto arquitectónico completo en `CLAUDE.md`.
