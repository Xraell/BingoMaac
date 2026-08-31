# Informe — Sesión de pruebas en emulador

**Fecha:** 2026-08-31. **Duración aproximada:** ~6 horas (con un corte por reinicio del entorno a mitad de sesión).

Éste es el primer documento del proyecto que puede afirmar que algo funciona **sin la
coletilla de "no verificado en dispositivo"**. Todo lo marcado ✅ se verificó contra la base
de datos o el log del backend, no contra lo que decía la pantalla.

## 1. Qué se probó

| Dato | Valor |
|---|---|
| Commit APP | `8635420` — "docs(pruebas): la regresion de ItemBoleto ya esta arreglada" — árbol limpio |
| Commit BACKEND | `ab79e4f` — "docs(04): registrar el commit del informe de cierre en ESTADO.md" — árbol limpio |
| Bug 1 (créditos por GET) | Arreglado — `agregar-creditos/{id}` como path param, confirmado en código y en ejecución |
| Bug 2 (boletos fuera del grupo admin) | Arreglado — ruta fuera de `admin`, confirmado en código y en ejecución |
| Bug 3 (login 500 con clave en texto plano) | Arreglado — se comprueba bcrypt antes de `Hash::check()`, confirmado en código y en ejecución (401, no 500) |
| Regresión `ItemBoleto.js` | No reapareció — verificado en código y en ejecución (4.3) |

Al terminar la sesión, `git status --short` en `src/` (APP) y `app/`, `routes/` (BACKEND) no
muestra ningún cambio: solo se tocó documentación, tal como exige esta etapa.

## 2. Resultado, de un vistazo

| Tarea | ✅ | ❌ | ⏭ |
|---|---|---|---|
| 03 Sesión | 6 | 1 | 0 |
| 04 Jugador | 2 | 1 | 4 |
| 05 Admin | 8 | 0 | 0 |
| 06 Partida | 4 | 0 | 3 |
| **Total** | **20** | **2** | **7** |

(29 pruebas individuales en total, sin contar 6.1b/audio que va aparte por convención.)

## 3. Lo que funciona

Confirmado en ejecución, contra base de datos y log — no solo contra la pantalla:

- **La sesión de seguridad, de punta a punta.** Login correcto (token creado), login
  incorrecto (401, sin repetir el bug 3), cierre de sesión (token borrado del servidor),
  sesión persistiendo tras un `force-stop` **y tras un reinicio completo del emulador y de
  todos los procesos del montaje** (el token siguió siendo válido cuando MariaDB/backend/
  emulador volvieron a arrancar). Y el hallazgo más valioso de la tarea 03: **un token
  revocado por consola hace que la app vuelva sola al login** en la siguiente petición, sin
  quedarse en una pantalla rota. Es el primer ejercicio real del circuito
  `apiFetch → borrarToken → emitirSesionExpirada`, escrito en la etapa de seguridad y nunca
  antes probado.
- **El panel de administración, completo.** Visible solo para ADMIN (confirmado con ambos
  roles). Listados de Usuarios y Participantes cargan. Agregar créditos funciona **por los
  dos caminos** — botones ±10 y campo tecleado — sin que reaparezca el bug 1 ni el defecto
  encadenado de validación (`integer` estricto contra un string) que se temía. Retirar
  créditos baja el saldo exacto y rechaza limpiamente un retiro mayor al disponible, sin
  dejarlo negativo. El bono de referido del 20% se calcula exacto (100 créditos → +20 para
  el referidor). Exportar a Excel genera un `.xlsx` real (17.4 KB) y abre el share sheet.
  Eliminar un usuario de prueba borra sus registros con confirmación explícita.
- **El corazón del juego, `PartidaEnCurso.js` — el archivo más complejo del repo, sin un
  solo test.** Cantar un número a mano queda en base, en rango. **El modo automático generó
  30 números sin un solo repetido y ninguno fuera de 1-90**, a ritmo constante de ~5 s: la
  lógica de espejado en refs (39 usos, la razón por la que esta zona estaba prohibida en
  todas las etapas anteriores) funciona correctamente. Detener el automático no deja ningún
  `setTimeout` huérfano (comprobado esperando 15 s sin que el total subiera) y reanudar
  sigue sin repetir. Los números persisten al salir de la pantalla y volver.
- **El registro y la compra de saldo, para el jugador.** Registrar una cuenta nueva desde
  la app queda con clave bcrypt y login inmediato — probado dos veces sin fallar. Ver la
  lista de boletos disponibles de una partida (100 boletos por página, `obtener-boletos-
  partida`) funciona y devuelve datos completos y correctos. Abrir un boleto muestra sus
  15 números, sin repetidos, coincidiendo exactamente con la base de datos.

## 4. Fallos encontrados

### 4.1 — Bugs ya conocidos, confirmados que siguen arreglados

Ninguno de los tres bugs de `doc/PENDIENTE.md` reapareció. Se confirmaron arreglados tanto
por código (tarea 01) como en ejecución real durante la sesión (login correcto/incorrecto en
03, agregar créditos en 05.3). No hay nada nuevo que reportar aquí.

### 4.2 — Hallazgos nuevos

#### H2 — `ModalBoleto.js` bloquea la compra en toda partida activa (condición invertida)

**Gravedad: bloqueante y grave** (toca la razón de ser del producto — dinero real — y además
impide usarlo).

`src/components/Modales/ModalBoleto.js:206` rechaza la compra de cualquier boleto con el
mensaje "Partida Ya Iniciada" cuando `partidaActual.Activo == 1`. Pero `Activo` no
significa "ya se cantaron números": significa "la partida está habilitada", el opuesto de
INACTIVO — el mismo campo y el mismo sentido que usan `Admin/Juego.js`,
`ListaMisBoletos.js` y `TablaPartidas.js` en el resto de la app. Una partida a la venta
tiene `Activo=1` por definición, así que esta condición **bloquea el 100% de las compras
normales**.

- **Qué se hizo:** comprar el boleto SERIAL 1161 de la partida de prueba (`id=87`, recién
  creada, **0 números cantados**, `Activo=1` — el estado normal de "ACTIVO" en el listado).
- **Qué se esperaba:** `POST /api/compra/crear` con 200, saldo bajando 30, `Compra::count()`
  subiendo en 1.
- **Qué pasó:** `Alert.alert("Partida Ya Iniciada", ...)`, sin llamar al backend. Saldo y
  `Compra::count()` sin cambios (confirmado por consola: 300/226 antes y después).
- **Reproducible:** sí, siempre, con cualquier partida activa.
- **No es un fallo del backend**: `curl` directo al endpoint de compra no se llegó a probar
  porque la app nunca lo invoca — el rechazo ocurre completamente en el cliente antes de la
  petición HTTP.

Bloqueó en cascada las pruebas 4.4, 4.5, 4.6, 4.7, 4.2 (parcialmente), 6.5 y 6.6.

#### H1 — `obtenerPartidaActual` no captura el 401 del modo invitado

**Gravedad: media.**

El invitado no tiene token, así que cualquier llamada autenticada — incluida
`obtenerPartidaActual`, que se dispara igual para todos los roles — responde 401. La
promesa rechazada no se captura en el componente que la llama. En build de desarrollo esto
dispara el LogBox de React Native en pantalla completa (con stack trace) unos segundos
después de entrar como invitado, **tapando el tab bar y cualquier botón debajo** hasta
descartarlo con "Dismiss". Reproducido de forma consistente en cada entrada como invitado.

En un build de producción el LogBox no se vería, pero la promesa sigue sin capturarse — se
recomienda envolver la llamada en un try/catch que trate el 401-sin-sesión como "no hay
partida" en vez de dejar que la excepción suba, tanto por higiene como porque no se
verificó si algún código depende silenciosamente de que esa promesa resuelva.

#### H3 — El buscador de Usuarios (admin) no filtra por teléfono ni apellido

**Gravedad: baja.**

Buscar por teléfono (`69990003`, con o sin `+591`/espacio) o por Apellido (`SesionDos`)
siempre da `1-0 of 0`, aunque el usuario existe. Solo el campo Nombres funciona. Hay
solución alternativa (buscar por nombre) y no bloquea ninguna operación — solo la hace más
lenta cuando el admin solo tiene el teléfono a mano, el caso más común al atender un
reclamo.

## 5. Lo que no se pudo probar

| Prueba | Motivo |
|---|---|
| 4.2 (vendidos vs. libres, la mitad "vendido") | Bloqueada por H2: no se pudo generar ningún boleto vendido para comparar |
| 4.4–4.7 (comprar, saldo insuficiente real, boleto ya vendido) | Bloqueadas por H2 |
| 6.5 (el jugador ve los números cantados vía sincronización) | Bloqueada en cascada por H2: SINCRONIZAR exige ≥2 boletos comprados y ningún USER tiene boletos |
| 6.6 (ganadores) | Bloqueada en cascada por H2: sin boletos vendidos no puede haber ganadores. No se inyectó ningún ganador en la base, según la regla de esta etapa |
| 6.7 (cerrar la partida) | No se pudo automatizar: el botón "stop" de `BotonFinalizarPartida` no respondió a varios toques en sus coordenadas correctas (verificadas contra el código, `right:60,top:-20` sobre el header). Verificado que no se cerró la partida por accidente (`Numero` con `Nro=-1` sigue en NO) |

**Audio — nunca ✅, siempre pendiente de confirmación humana:**

| Qué | Cuándo |
|---|---|
| Número 42 cantado a mano | 31/08/2026 15:10:32 |
| Automático: 39,32,62,29,13,64,50,81,55,61,5,28,70,68,27,25,79,57,59... (30 números en total) | 31/08/2026 desde 15:12:09, cada ~5 s, durante varios minutos |

`adb` no puede escuchar. Confirmar al pasar, comprobando que sonó justo tras cada `POST
/numero/crear` en las horas anotadas.

## 6. Qué hacer ahora

1. **Arreglar H2 antes que nada.** Es lo más grave con diferencia: bloquea comprar boletos
   en el 100% de los casos, que es la razón de ser de la app. Revisar
   `ModalBoleto.js:206` — probablemente la intención era comprobar si la partida ya tiene
   números cantados (`Numero::where('idPartida', ...)->exists()`), no su campo `Activo`.
2. **Repetir las tareas 04 y 06 (6.5/6.6) de esta sesión tras el arreglo de H2.** Son las
   únicas verificaciones reales que va a recibir el flujo de compra completo y la detección
   de ganadores, y hoy están bloqueadas.
3. **H1** (LogBox del invitado) y **H3** (buscador sin teléfono/apellido) son de menor
   urgencia; se pueden atender en cualquier momento sin bloquear nada.
4. **6.7 queda sin verificar** — si se retoma esta pantalla, vale la pena revisar por qué el
   `IconButton` de `BotonFinalizarPartida` no respondió a los toques (puede ser un problema
   real de hitbox, no solo de la automatización).
5. **Confirmar el audio** de las dos horas anotadas en la sección 5, cuando alguien pueda
   sentarse delante del emulador.

No se recomienda seguir con `doc/actualizacion-dependencias/` ni `doc/migracion-sdk54/`
hasta que H2 esté resuelto: son mejoras de mantenimiento, y H2 es un bug que le cuesta
dinero real a la operación cada día que sigue así.
