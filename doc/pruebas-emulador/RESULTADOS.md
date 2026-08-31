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

## Tarea 01 — Preparación del entorno

- Commits: APP `8635420`, BACKEND `ab79e4f`. Ambos árboles limpios (`git status --short` sin salida).
- Los tres bugs conocidos siguen arreglados (verificado por código, sin levantar nada):
  - Bug 1: `Usuario.js:54` usa `"/usuario/agregar-creditos/" + id` como path param.
  - Bug 2: `obtener-boletos-partida` está fuera del grupo `admin` en `routes/api.php:64`, con comentario explícito referenciando `doc/correccion-hallazgos/02-boletos-partida-rol.md` para no volver a moverla.
  - Bug 3: `UsuarioController.php:222` comprueba `Hash::info($usuario->Clave)['algoName'] !== 'bcrypt'` y invalida el usuario antes de llegar a `Hash::check()`.
  - Regresión de `ItemBoleto.js` (`idUsuario != null`): no se encontró — sigue arreglada.
- MariaDB: `php artisan tinker` cuenta **20 usuarios**. Backend ve la base sin problemas.
- Backend: `php artisan serve --host=0.0.0.0 --port=8080` en segundo plano. `curl http://127.0.0.1:8080/api/premio` → **401** (correcto, `auth:sanctum` responde).
- Emulador `Xpancity_API_31` arrancado con `-no-snapshot-load`; `adb devices` lo lista como `device`. Volumen subido.
- `pnpm install`: sin problemas (lockfile al día, "reused 10, added 0").
- **Nota de entorno**: el puerto **8081 estaba ocupado** por un proceso `node.exe` (PID 25444) ya en marcha antes de esta sesión, así que `expo start --android` en 8081 salió con "Skipping dev server" (no interactivo). Se arrancó Metro en **puerto 8090** en su lugar (`npx expo start --android --port 8090`), sin tocar ese proceso ajeno. No es un bug de la app.
- **Nota de entorno**: la app (`com.israelrvmwork.BingoMaac`, dev-client custom — no Expo Go) ya tenía una **sesión persistida** de una sesión de pruebas anterior (usuario `ClaudeTest Verificacion`, tel. `+591 69990001`, 0 créditos). Se limpió con `adb shell pm clear com.israelrvmwork.BingoMaac` para partir de un estado conocido, ya que no se pudo localizar un botón de "Cerrar sesión" visible en Perfil (posiblemente tras un ícono sin texto accesible; no se investigó más porque limpiar datos era más directo).
- Lanzar la app con `adb shell monkey -p <pkg> -c android.intent.category.LAUNCHER 1` (el launcher normal) conectó a Metro correctamente y llegó a **Inicio de sesión**. Lanzarla en cambio con el intent `VIEW` + deep link `exp+bingomaac://expo-development-client/?url=...` abrió el **menú de desarrollador** de Expo en vez de la pantalla de la app; no se investigó más porque el launcher normal ya daba el resultado esperado.
- Confirmado con captura: pantalla "Inicio de sesión" con selector de país, número de celular, contraseña, INGRESAR e INGRESAR COMO INVITADO.

## Tarea 02 — Datos de prueba

- Respaldo: `mysqldump` no estaba en PATH; se usó el binario de XAMPP directamente
  (`/c/xampp/mysql/bin/mysqldump.exe`). Volcado guardado en el scratchpad (fuera del
  repositorio), 96 KB, 13 tablas con datos (`boleto`, `compra`, `ganador`, `mensaje`,
  `migrations`, `numero`, `partida`, `partida_premio`, `personal_access_tokens`, `premio`,
  `promocion`, `usuario`, `usuario_promocion`).
- Cuenta USER de prueba registrada **desde la app** (Perfil de invitado → Registro de
  Usuario): Nombres `PruebaEmulador`, Apellidos `SesionUno`, país Bolivia, tel.
  `+591 69990002`, clave `Prueba1234`. Verificado en base: `id=35`, `Rol=USER` (antes de
  promover), clave con **bcrypt confirmado**. Créditos asignados por consola: 300.
- **Hallazgo nuevo**: como invitado, `obtenerPartidaActual` responde **401** (esperado, ya
  que el invitado no tiene token) y la app lo deja **sin capturar**: sube como excepción no
  manejada y dispara el **LogBox de desarrollo en pantalla completa** pocos segundos después
  de entrar como invitado, tapando toda la interfaz incluido el tab bar. Reproducible de
  forma consistente. En un build de producción esto no mostraría el LogBox (solo en dev), pero
  indica que la promesa de `obtenerPartidaActual` no tiene manejo de error para el caso sin
  sesión — ver `RESULTADOS.md` → Hallazgos nuevos.
- Cuenta ADMIN: no se pudo usar la real (clave desconocida, `+591 73258781`, id=2, uso real —
  no tocada). Se promovió la cuenta de prueba (`id=35`) a `Rol=ADMIN` por consola, siguiendo
  la guía del plan. Login **por la app** con esa cuenta verificado exitoso: panel TabsAdmin
  cargó con datos reales (52 partidas, partida actual Nº2563). Confirmado en base de datos,
  no solo en pantalla: nuevo `personal_access_tokens` con `created_at`/`last_used_at`
  coincidiendo con el momento del login (id=21, 2026-08-31 01:19:40).
- **Nota de entorno**: `php artisan serve --host=0.0.0.0 --port=8080` lanzado en segundo
  plano no vuelca líneas de petición a su archivo de salida (posible buffering de stdout al
  background). No es un problema de la app — se verifica cada acción contra la base de datos
  en su lugar, tal como indica la técnica de esta etapa.
- Segunda cuenta USER creada **desde la app** (mismo flujo: invitado → Perfil → Registro):
  Nombres `PruebaEmulador`, Apellidos `SesionDos`, país Bolivia, tel. `+591 69990003`, clave
  `Prueba1234`. Verificado en base: `id=36`, `Rol=USER`, bcrypt confirmado, 300 créditos
  asignados por consola.
- Partida de prueba creada **desde el panel ADMIN** (Agregar partida): `NroPartida=2564`
  (mayor que 2563, correcto), Descripción `PruebaSesion01`, Costo de boleto `30`, Estado
  `ACTIVO`, premio Cartón lleno habilitado con monto 100 (Terna/Cuarta/Línea deshabilitados).
  Verificado en base: `id=87`, `NroPartida=2564`, `Activo=1`, `CostoBoleto=30`. Se convirtió
  automáticamente en la partida actual (`PARTIDA ACTUAL Nº2564`), como se esperaba por ser el
  `NroPartida` más alto.
- Boletos generados con **REINICIAR BOLETOS** desde la tab Partida (la acción real detrás del
  botón es `ReiniciarBoletos`, en `src/screens/Admin/Partida.js:51`, que llama a
  `src/Utils/Boleto.js`). Verificado en base: **500 boletos** para `idPartida=87` (antes: 0).
- **Nota de entorno**: durante esta tarea el dev-client quedó atascado varias veces en la
  splash screen de Expo tras relanzar la app con `adb shell monkey ... LAUNCHER` (el `pm
  clear` inicial parece haber dejado el `DevLauncherActivity` sin auto-conectar). Se resolvió
  cada vez con el deep link explícito: `adb shell am start -a android.intent.action.VIEW -d
  "exp+bingomaac://expo-development-client/?url=http%3A%2F%2F192.168.0.5%3A8090"`. No es un
  bug de la app: solo afecta al arranque del propio dev-client, no a la lógica de negocio.
- **Nota de entorno**: el LogBox de error (ver hallazgo del 401 como invitado) intercepta
  temporalmente el tab bar y algunos botones cuando se auto-expande. Mitigado tocando
  "Dismiss" y reintentando la acción inmediatamente después.

## Tarea 03 — Humo y sesión

| # | Prueba | Res. | Notas |
|---|---|---|---|
| 3.1 | Arranque en frío | ✅ | Entra directo a TabsAdmin (sesión ADMIN previa), sin texto de error crudo |
| 3.2 | Login correcto | ✅ | USER id=36, `POST /usuario/authenticarte` 14:20:23, token id=24 creado |
| 3.3 | Login incorrecto | ✅ | 401 confirmado en pantalla y `laravel.log` sin crecer (no es el bug 3/500), sigue en login |
| 3.4 | Sesión sobrevive al reinicio | ✅ | Mismo evento que 3.1: token id=23 usado a las 18:17:24, `/api/usuario/me` respondido |
| 3.5 | Modo invitado | ❌ | Pantalla de presentación carga bien, pero el 401 esperado de `obtenerPartidaActual` sube sin capturar y dispara LogBox con stack trace en pantalla — ver hallazgo |
| 3.6 | Cerrar sesión | ✅ | `POST /usuario/logout` 14:21:20, tokens de USER 36 pasaron de 1 a 0, vuelve al login |
| 3.7 | Token revocado → vuelve al login | ✅ | Token borrado por consola con la app en primer plano; al navegar a Boletos, `obtener-boletos-partida/87` dio 401 (14:25:57) y la app volvió sola al login, sin quedarse en pantalla rota. El circuito apiFetch→borrarToken→emitirSesionExpirada funciona |

## Tarea 04 — Jugador

**Nota de entorno sobre 4.1:** las primeras 5 peticiones a `obtener-boletos-partida/87` desde
el emulador fallaron con `SyntaxError: JSON Parse error: Unexpected end of input` (body
truncado o vacío), mostrando "No hay boletos disponibles" en pantalla. Verificado que el
backend **no es la causa**: 4 peticiones consecutivas con `curl` directo desde el host,
mismo endpoint y token, dieron **200** con 100 boletos y ~24.7 KB cada vez, sin fallar
ninguna. Dos de las peticiones fallidas desde la app respondieron en el log en **0.09-0.10ms**
(vs. ~500ms de una respuesta real), sugiriendo que la conexión se cortó del lado del cliente
antes de recibir el body completo — probablemente un artefacto de la capa de red NAT del
emulador (`10.0.2.2`), no un bug de la lógica de la app. Se resolvió reiniciando la app por
completo (`force-stop` + relanzar), tras lo cual cargó a la primera y se mantuvo estable en
los reintentos siguientes. **No se cuenta como hallazgo de la app**, pero se anota porque
consumió la mayor parte del tiempo de esta tarea.

| # | Prueba | Res. | Notas |
|---|---|---|---|
| 4.1 | Ver boletos disponibles | ✅ | Tras varios intentos (ver nota abajo). Muestra "Boletos disponibles para la partida Nº2564" con Nº SERIAL visibles. `GET /boleto/obtener-boletos-partida/87` en el log a las 14:33:35 |
| 4.2 | Vendidos vs. libres | ⏭ | Los 500 boletos generados están todos libres (partida recién creada); bloqueada por H2 antes de poder generar un vendido |
| 4.3 | Abrir un boleto | ✅ | Boleto SERIAL 1161: 15 números (5,19,30,57,74,4,22,32,67,90,6,24,40,61,89), únicos, en 1-90. Coinciden con la base de datos |
| 4.4 | Comprar | ❌ | **Bloqueado por H2**: la compra fue rechazada con "Partida Ya Iniciada" pese a que la partida no tiene números cantados. Saldo y Compras sin cambios (300 / 226) |
| 4.5 | Mis Boletos: números coinciden | ⏭ | Depende de 4.4 |
| 4.6 | Saldo insuficiente | ⏭ | Depende de poder comprar (4.4) |
| 4.7 | Boleto ya vendido | ⏭ | Depende de poder comprar (4.4) |

## Tarea 05 — Admin

| # | Prueba | Res. | Notas |
|---|---|---|---|
| 5.1 | Panel solo para ADMIN | ✅ | USER (36): solo Inicio/Boletos/Mis Boletos/Perfil. ADMIN (35): las 5 tabs (Partida/Usuarios/Participantes/Créditos/Juego) |
| 5.2 | Listados | ✅ | Usuarios: carga con datos reales (Israel Roberto +591 73258781, etc.). Participantes: "Datos cargados" (típo de la app: "cargandos"), `obtener-reportes/87` en el log 14:40:11, 0/0 esperado (H2 bloquea compras) |
| 5.3 | Agregar créditos (botones) | ✅ | Código: 200. USER 36: 300→320 (+20, dos toques de +10). `POST /usuario/agregar-creditos/36` 14:44:41 |
| 5.3 | Agregar créditos (tecleado) | ✅ | Código: 200 (sin 422, el defecto encadenado no reapareció). USER 36: 320→335 (+15). `POST /usuario/agregar-creditos/36` 14:47:45 |
| 5.4 | Retirar créditos | ✅ | USER 36: 335→285 (-50 exacto, `POST /usuario/retirar-creditos/36`). Retiro de 1000 (> disponible): "CRÉDITOS INSUFICIENTES", saldo sin cambio (285→285), respuesta rápida (0.10ms, típica de un 422 temprano) |
| 5.5 | Bono de referido 20 % | ✅ | Usuario id=27 ("Definitivo", `idReferido=3`): 100→200 (+100). Referidor id=3: 750→770 (+20, exactamente 20% de 100) |
| 5.6 | Crear partida y boletos | ✅ | Ya documentado en la tarea 02: partida `NroPartida=2564`/`id=87` creada desde el panel, 500 boletos generados con REINICIAR BOLETOS, verificados en base de datos |
| 5.7 | Exportar a Excel | ✅ | Generó `Informe_partida_2564_06:55 PM.xlsx`, abrió el diálogo de compartir de Android. Archivo verificado en `/data/data/com.israelrvmwork.BingoMaac/files/`, 17491 bytes, no vacío |
| 5.8 | Eliminar usuario de prueba | ✅ | Cuenta desechable creada solo para esta prueba (id=37, "Borrar DesechableTest", tel +591 60000099). Eliminada con confirmación explícita ("se eliminarán sus boletos y participaciones"). Verificado: `Usuario::find(37)` es null, total vuelve a 22 |

## Tarea 06 — Partida

| # | Prueba | Res. | Notas |
|---|---|---|---|
| 6.1 | Cantar número | ✅ | Número 42 cantado a mano, 15:10:32. `POST /numero/crear` en el log, `Numero::where('idPartida',87)` = [42], en rango 1-90. Volcado muestra "42" destacado |
| 6.1b | Audio (⏭ humano) | ⏭ | Hora exacta: **31/08/2026 15:10:32** — número 42. Pendiente de confirmación humana |
| 6.2 | Automático sin repetir | ✅ | **Total/únicos: 14/14, fuera de rango: 0.** Iniciado 15:12:09. Lista: 42,39,32,62,29,13,64,50,81,55,61,5,28,70 (el 42 es el cantado a mano en 6.1). Salen a ritmo ~5s. Ver nota abajo |
| 6.3 | Detener y reanudar | ✅ | Al detener en 24 números, se mantuvo en 24 tras 15s (sin setTimeout huérfano). Al reanudar: 24→27 en ~20s, sin repetidos |
| 6.4 | Persisten al volver | ✅ | Salir a Partida y volver a Juego: total en base=30, sin cambios. Volcado muestra el último cantado (2) coincidiendo exactamente con el último registro de la base |
| 6.5 | El jugador los ve | ⏭ | Bloqueado en cascada por H2: SINCRONIZAR exige ≥2 boletos comprados, y ningún USER tiene boletos porque la compra está rota. Mensaje correcto: "Boletos insuficientes — Se requieren al menos 2 boletos para sincronizar la partida" (comportamiento esperado, no es un hallazgo nuevo) |
| 6.6 | Ganadores | ⏭ | Bloqueado en cascada por H2: sin boletos vendidos (idUsuario siempre false), no puede haber ganadores. `GET /boleto/obtener-ganadores-fila/87` sí se llama en cada carga (200, ver log), pero siempre con 0 boletos vendidos que evaluar. No se inyectó ningún ganador en la base |
| 6.7 | Cerrar partida | ⏭ | No se pudo automatizar: el botón "stop" de `BotonFinalizarPartida` (ícono `stop`, `right:60,top:-20` sobre el header, junto al logout) no respondió a varios toques en sus coordenadas correctas (verificadas contra el código). Puede requerir doble-toque exacto sobre un `IconButton` de 25px que colisiona con el logout adyacente. Verificado en base: `Numero::where('idPartida',87)->where('Nro',-1)` sigue en NO tras los intentos — no se cerró la partida por accidente |

---

## Hallazgos nuevos

Los que no estaban en `doc/PENDIENTE.md`.

### H1 — `obtenerPartidaActual` no captura el 401 del modo invitado

**Dónde:** el invitado (`Rol: "GUEST"`, `id: 0`) no tiene token, así que cualquier llamada
autenticada responde 401 — incluida `obtenerPartidaActual`, que se dispara igual en las
pantallas de `TabsUser` para todos los roles.

**Qué pasa:** la promesa rechazada no se captura en el componente que la llama. En build de
desarrollo esto se ve como un LogBox de React Native en pantalla completa (con el stack
trace) que aparece unos segundos después de entrar como invitado y **tapa el tab bar y
cualquier botón que esté debajo**, interceptando toques hasta que se descarta con "Dismiss".
Reproducido de forma consistente: cada vez que se entra como invitado, en 1-3 s aparece
`Error en obtener partida actual: Error: HTTP 401` primero como badge pequeño y luego
auto-expandido a pantalla completa.

**Impacto en producción:** el LogBox solo existe en dev — en un build de producción no se
vería nada en pantalla, pero la promesa sigue sin capturarse, así que cualquier código que
dependa de que `obtenerPartidaActual` resuelva (o del estado que debería setear) para el
invitado queda en un estado indefinido sin que se note. No se verificó qué pantalla usa ese
valor para el invitado ni si depende de él más adelante — recomendado revisar
`obtenerPartidaActual` en el componente de `Inicio`/`TabsUser` y envolver la llamada en
try/catch quer trate 401-sin-sesión como "no hay partida" en vez de dejar que la excepción
suba.

**Severidad:** media. No bloquea el uso de la app (el invitado puede navegar con normalidad
tras descartar el LogBox), pero es una promesa sin manejar en producción y una experiencia
de desarrollo rota (bloquea la UI hasta descartar el error manualmente).

### H2 — `ModalBoleto.js` bloquea la compra en toda partida activa (condición invertida)

**Dónde:** [`src/components/Modales/ModalBoleto.js:206`](../../src/components/Modales/ModalBoleto.js#L206).

```js
if (response.Activo == 1) {
  setComprando(false);
  return Alert.alert(
    "Partida Ya Iniciada",
    "No es posible comprar boletos para una partida que ya ha comenzado."
  );
}
```

**Qué pasa:** al confirmar la compra de cualquier boleto, la app vuelve a pedir la partida
actual y rechaza la compra si `Activo == 1`. Pero `Activo` en el modelo `Partida` no
significa "ya empezó a cantar números" — significa "la partida está habilitada", el
opuesto de INACTIVO. Es el mismo campo, y el mismo criterio, que usa el resto de la app:

- `src/screens/Admin/Juego.js:12` usa `Activo == 1` como condición para **permitir**
  iniciar la vista de juego (lo contrario de "ya terminó/bloqueada").
- `src/components/Conjunto/ListaMisBoletos.js:203` usa `Activo == 1` para **permitir**
  sincronizar boletos en vivo, y con `Activo != 1` muestra "La partida aún no ha sido
  iniciada por el encargado" — el sentido correcto.
- `src/components/Tablas/TablaPartidas.js:33` pinta `Activo==1` como "ACTIVO" en el listado
  de partidas del admin (visto en la tarea 02: la partida de prueba se crea con `Activo=1` y
  aparece como "ACTIVO", el estado que se espera para que esté a la venta).

`ModalBoleto.js` es el único lugar que usa `Activo == 1` con el sentido opuesto. No existe
ningún otro campo en el modelo `Partida` (`NroPartida`, `Descripcion`, `Activo`,
`CostoBoleto`) que indique "ya se cantaron números" — nada distingue una partida recién
creada de una partida en curso salvo consultar `Numero::where('idPartida', ...)`.

**Reproducido:** partida de prueba `id=87`/`Nº2564`, creada minutos antes, **0 números
cantados**, `Activo=1` (el estado normal tras crearla desde el panel admin — así aparece
"ACTIVO" en el listado). Al intentar comprar el boleto SERIAL 1161: `Alert` con "Partida Ya
Iniciada — No es posible comprar boletos para una partida que ya ha comenzado." Saldo y
`Compra::count()` sin cambios, confirmado por consola.

**Impacto:** máximo. Cualquier partida visible para comprar boletos tiene, por definición,
`Activo=1` (si no lo tuviera, no aparecería como partida actual jugable). Esta condición
bloquea la compra en el 100% de los casos normales — nadie puede comprar un boleto en
ninguna partida activa. Es la razón de ser del producto (dinero real) y está rota.

**Severidad: crítica.** Bloqueó por completo las pruebas 4.4 a 4.7. Recomendado revisar
`ModalBoleto.js:206` contra la intención real (probablemente debía comprobar si la partida
ya tiene números cantados, no su estado `Activo`) antes de la próxima release.

### H3 — El buscador de Usuarios (admin) no filtra por teléfono ni apellido

**Dónde:** panel ADMIN → Usuarios → campo "Buscar".

**Qué pasa:** buscar por número de teléfono (`69990003`, con o sin `+591`/espacio) siempre
devuelve `1-0 of 0`, aunque el usuario existe y su columna Teléfono lo muestra sin ambigüedad.
Buscar por Apellido (`SesionDos`) también da 0 resultados. Solo buscar por el campo Nombres
funciona (`PruebaEmulador`, `Definitivo`, `Borrar` sí encontraron sus filas).

**Impacto:** menor — hay solución alternativa (buscar por nombre), y no bloquea ninguna
operación administrativa, solo la hace más lenta cuando el admin solo tiene el teléfono del
usuario a mano (el caso más común al atender un reclamo de un jugador).

**Severidad: baja.**

## Bugs y regresiones ya arregladas, a confirmar en ejecución

Todo lo conocido está arreglado en código al empezar esta sesión. Anotar aquí solo si algo
reapareciera.

- Bugs 1, 2 y 3 de `correccion-hallazgos`: arreglados, 46 tests del backend en verde.
- Regresión de `ItemBoleto.js` (los boletos libres no respondían al toque, por
  `idUsuario != null` contra un booleano): arreglada con `!!boleto.idUsuario`, 5 tests.
  **Verificar en ejecución en la prueba 4.3.**

_(sin reapariciones)_

## Pendiente de confirmación humana

Lo que el agente no pudo juzgar. **El audio va siempre aquí.**

| Qué | Cuándo | Cómo confirmarlo |
|---|---|---|
| Audio al cantar número 42 (a mano) | 31/08/2026 15:10:32 | Escucharlo al pasar. El emulador debería haber sonado justo después de la petición `POST /numero/crear` |
| Audio de los números del automático | 31/08/2026 15:12:09 a ~15:15:30 aprox. | Números salieron cada ~5s: 39,32,62,29,13,64,50,81,55,61,5,28,70 y varios más hasta 68,27,25,79,57,59,... El automático quedó corriendo durante varios minutos de la sesión |
| Aspecto visual general | Toda la sesión | Ninguna captura sustituye a un ojo — ver capturas adjuntas en el scratchpad de la sesión, sin veredicto |

## Notas de entorno

Problemas de montaje, no de la app. Consolidado de lo anotado por tarea:

- **Puerto 8081 ocupado** por un proceso `node.exe` previo a la sesión → Metro se arrancó en el puerto 8090.
- **`mysqldump` no está en PATH** → se usó `/c/xampp/mysql/bin/mysqldump.exe` directamente.
- **`php artisan serve` en background no vuelca sus líneas en tiempo real** al archivo de salida cuando corre detrás de un pipe — se verificó cada acción contra la base de datos en su lugar.
- **El dev-client (`com.israelrvmwork.BingoMaac`) queda atascado en su splash tras `pm clear` + `monkey launcher`** en varias ocasiones a lo largo de la sesión. En algunos casos la causa real era que la app sí había cargado pero el **menú de desarrollador de Expo** se abría por encima tapándolo todo (confirmado con captura en la tarea 06); en otros, un relanzamiento con el deep link `exp+bingomaac://expo-development-client/?url=...` + "Reload" resolvió el atasco. Ninguno de los dos es un bug de la app: son artefactos del dev-client/Metro, no de la lógica de negocio.
- **`adb shell uiautomator dump` devuelve "ERROR: could not get idle state"** de forma recurrente en la pantalla de Partida en Curso, por la animación continua del carrusel de números extraídos — el propio `dump` puede devolver un snapshot desactualizado (stale) en ese estado. Se mitigó apoyándose en capturas de pantalla (`screencap`) y en la base de datos como fuente de verdad, tal como indica la técnica de esta etapa.
- Un intento de retirar créditos con el campo de texto sin resetear (residuo "Definitivo" tecleado sobre el campo numérico del modal de RETIRAR CREDITOS) se cerró sin confirmar — no hubo ningún retiro accidental, verificado por consola.
