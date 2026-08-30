# Estado del refactor autónomo — app

El agente actualiza este fichero al cerrar cada tarea. Consultarlo con
`/refactorizar-app estado`.

## Progreso

| # | Tarea | Estado | Commit | Notas |
|---|---|---|---|---|
| 01 | Línea base | ❌ bloqueada por entorno | `23ea324` | **Obligatoria** — ver «Bloqueo» abajo |
| 02 | Limpiar logs | ✅ completada (sin `expo export`) | `910d8a9` | Autorizado explícitamente por el usuario — ver «Verificación degradada» |
| 03 | Imports y código muerto | ✅ completada (sin `expo export`) | `7282377` | Autorizado por el usuario — ver «Verificación degradada» |
| 04 | Utils duplicados | ✅ completada (sin `expo export`) | `94ceb1b` | Autorizado explícitamente por el usuario tras advertirle del riesgo — ver «Verificación degradada» |
| 05 | Constantes | ✅ completada (sin `expo export`) | `232ef0d` | Autorizado por el usuario — ver «Verificación degradada». Se hizo antes que la 04 en esta sesión |
| — | Testing (fuera del plan) | ✅ completada | `1a81035` | Jest + testing-library, pedido por el usuario tras proponerlo como oportunidad. Ver `doc/pruebas-automatizadas/` |
| 06 | Informe | ✅ completada | — (este commit) | Ver `INFORME.md` |

Estados: ⬜ pendiente · 🟡 en curso · ✅ completada · ❌ revertida · ⏭ saltada

## Línea base

Reconfirmado el **2026-08-30**, sesión de ejecución del plan:

- Árbol limpio al empezar (`git status --short` vacío) — no hay otros agentes con cambios
  a medio hacer.
- Tag `pre-refactor-app` **creado** en esta sesión (paso 1 de la tarea 01).
- **Sin tests y sin linter.** `package.json` solo tiene los cuatro scripts de Expo y dos
  devDependencies (`@babel/core`, `@types/react`) — confirmado.
- `console.log`: **47** en **15** ficheros — confirmado igual al valor del plan.
- `console.error`: **68** — medido esta sesión (el plan no traía esta cifra).
- `src/Utils/`: **942 líneas** — confirmado igual. Bloques `try {`: **60** (el plan
  registraba 59; diferencia de 1, no investigada, no bloquea nada).
- **81 ficheros `.js`** en `src/` — confirmado igual.
- **`npx expo export` NO se pudo ejecutar: ver «Bloqueo de entorno» abajo.** Por tanto el
  bundle de referencia (5.47 MB en el plan) **no se ha podido reproducir ni confirmar en
  esta sesión.**

## Bloqueo de entorno (tarea 01, obligatoria)

`node_modules/` no existía al empezar la sesión. Al instalar con
`pnpm install --frozen-lockfile` (sin tocar el lockfile ni las versiones — solo
materializar lo que ya estaba fijado), la instalación falla en la dependencia `xlsx`:

```
"xlsx": "https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz"
```

`pnpm` intenta descargar ese tarball y el proxy de salida del entorno lo rechaza:

```
ERR_PNPM_FETCH_403  GET https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz: Forbidden - 403
```

`curl -sS "$HTTPS_PROXY/__agentproxy/status"` confirma que es una denegación de política
de red de la organización, no un fallo transitorio: `cdn.sheetjs.com` no está en la lista
de hosts permitidos para esta sesión. La documentación del proxy (`/root/.ccr/README.md`)
es explícita: un 403/407 del proxy es una denegación de política y **no se debe
reintentar ni rodear**.

No hay forma de instalar `xlsx` desde otra fuente sin tocar `package.json` (cambiar la
versión o el origen del paquete es justo lo que este plan tiene prohibido: "no se añade,
actualiza ni elimina ningún paquete"). Sin `node_modules` completo, Metro no puede
resolver el import de `xlsx` que usan `BotonExportarReporte` / `BotonExportarReporteNuevo`,
así que `npx expo export` no puede completarse — ni siquiera para medir el bundle de
línea base.

La tarea 01 es explícita sobre este escenario: **"Si `expo export` falla aquí, detener el
plan entero: sin la única verificación disponible, el resto de tareas serían a ciegas."**
Por eso esta sesión se detiene aquí, sin tocar `src/`, y no ejecuta las tareas 02-06.

**Esto no es un hallazgo del código de la app** (por eso no va a `HALLAZGOS.md`): es una
restricción del entorno de ejecución de esta sesión concreta (política de red del proxy
de salida), no del proyecto ni de sus dependencias declaradas.

### Qué hace falta para desbloquear esta etapa

Cualquiera de estas, decidida por quien opera el entorno (no soy yo quien puede decidirlo):

- Permitir `cdn.sheetjs.com` en la política de red de la sesión, o
- Ejecutar esta skill en un entorno donde `node_modules/` ya esté instalado (p. ej. la
  máquina de desarrollo habitual, fuera de este contenedor con proxy restringido), o
- Vendorizar el tarball de `xlsx` de antemano (fuera del alcance de esta sesión: implica
  tocar cómo se resuelve una dependencia, decisión humana).

No se ha intentado ninguna de las anteriores por iniciativa propia: la primera excede lo
que esta sesión puede tocar (política de red externa), la segunda no aplica (este
contenedor es el entorno de ejecución), y la tercera cuenta como tocar dependencias, fuera
del alcance del plan.

## Verificación degradada (autorizada por el usuario, tareas 02, 03, 05 y 04)

El usuario, informado del bloqueo, pidió explícitamente avanzar las tareas mecánicas y de
bajo riesgo (02, 03, 05) sin la verificación automática que el plan exige
(`expo export`), asumiendo el riesgo residual. Se le advirtió aparte que la 04 (Utils
duplicados) es la única de riesgo medio del plan — reescribe la capa de comunicación con
el backend y un error ahí no rompe la compilación, rompe llamadas en ejecución — y el
usuario pidió explícitamente hacerla también ("Realizalo"), aceptando ese riesgo mayor.

Lo que sí se pudo hacer sin `node_modules` completo:

- `node_modules/` quedó parcialmente instalado (312 paquetes) del intento fallido de la
  tarea 01 — incluye `@babel/parser`, aunque no `@babel/core` ni el resto de la cadena de
  Metro/Expo.
- Con `@babel/parser` se validó la **sintaxis JS+JSX** de cada fichero tocado en ambas
  tareas (script en el scratchpad, borrado al terminar). Todos los ficheros modificados
  parsean correctamente.
- Esto **no sustituye a `expo export`**: no resuelve imports, no genera bundle, no detecta
  módulos rotos ni referencias a símbolos inexistentes. Es una validación de sintaxis
  únicamente.
- Tarea 02: revisión manual línea por línea de cada `console.log` eliminado, comprobando
  que ninguno estuviera dentro de un `if` sin llaves y que `PartidaEnCurso.js` solo
  perdiera líneas de log.
- Tarea 03: los imports sin usar y las funciones muertas de `Utils/` se detectaron con un
  script propio (AST vía `@babel/parser`) que busca, para cada símbolo importado o
  exportado, si aparece como palabra completa en el resto del proyecto — más estricto que
  el grep sugerido por el documento de la tarea (compara contra **todo** `src/`, no solo
  fuera de `Utils/`, así que respeta también la excepción de "puede usarse dentro del
  propio `Utils/`"). Se revisó a mano una muestra de los cambios más grandes
  (`ModalComoFunciona.js`, `ItemBoleto.js`, `ModalDetallesParticipante.js`,
  `src/Utils/Boleto.js`) leyendo el fichero completo antes y después.
- Se reprodujeron a mano los checks automáticos de ambos documentos que no dependen de
  `expo export`: conteo de `console.log`/`console.error`, `git diff --stat` contra
  `pre-refactor-app`, diff aislado de `PartidaEnCurso.js`, imports sin nombre no tocados,
  zonas prohibidas sin tocar, conteo de `import React` sin cambios. Todos en verde.
- **No se tocó** el paso 2 de la tarea 03 (variables locales asignadas y nunca leídas,
  p. ej. un `useState` cuyo valor no se lee). El documento pide dejar el hueco del
  destructuring cuando el setter sí se usa, lo cual es más una decisión caso por caso que
  un patrón mecánico seguro de automatizar a este volumen sin poder ejecutar la app —
  se dejó fuera por prudencia, no se intentó.
- Tarea 05: se creó `src/constants/roles.js` (`ROL_ADMIN`, `ROL_USER`, `ROL_GUEST`) y se
  sustituyeron las 6 comparaciones de rol encontradas en `BotonesLogin.js` (×2),
  `TabsUser.js`, `Boletos.js`, `MisBoletos.js` y `Perfil.js`, más el literal `"USER"` de
  `BotonRegistro.js` al construir un usuario nuevo. **Cada operador (`==` / `===`, con o
  sin espacio) se conservó exactamente igual** — solo se sustituyó el literal, verificado
  línea por línea en el diff. El paso de colores (buscar hex que coincidan con
  `Colors.js`) no encontró ningún candidato: los 16 colores hardcodeados del proyecto no
  coinciden con ninguno de los 6 de la paleta, así que no había nada que sustituir — se
  comprobó, no se saltó.
- Tarea 05, excepción documentada: **`src/components/Data/usuarioInvitado.js` no se
  tocó.** El propio documento de la tarea 05 contempla este fichero y permite usar la
  constante ahí "si no genera un import circular", pero está dentro de
  `src/components/Data/`, que la skill marca como zona prohibida en general. Se optó por
  la lectura más conservadora: dejarlo como literal `Rol: "GUEST"`, sin tocar el fichero.
- **Tarea 04**, la de mayor riesgo del plan (reescribe la capa de red), se hizo con una
  regla más estricta que la del documento: **solo se unificó una función si calzaba byte a
  byte con el molde exacto**, no solo "aproximadamente". Se catalogó cada función
  exportada de `Boleto.js`, `Compra.js`, `Ganador.js`, `Mensaje.js`, `Numero.js`,
  `Partida.js`, `Usuario.js` y `UsuarioPromocion.js` contra estos criterios de exclusión,
  cualquiera que se cumpliera bastaba para dejar la función intacta:
  - Valida la forma de la respuesta con `!Array.isArray(data)` en vez de `!data` (mensaje
    de error distinto: "La respuesta no es un arreglo..." vs "No se pudo obtener datos de
    la API"). Ejemplos: `ObtenerUsuarios`, `ObtenerPartidas`, `ObtenerNumeros`,
    `ObtenerNumerosUsuario`, `ObtenerNumerosPartida` (en `Numero.js` y
    `UsuarioPromocion.js`), `ObtenerReportePartida`, `ObtenerBoletosUsuario`.
  - El texto exacto del `console.error` no coincide con la plantilla `` `Error en
    ${etiqueta}:` `` del ayudante (por ejemplo falta los dos puntos finales). Único caso:
    `ObtenerReportePartidaNuevo` en `Boleto.js` ("Error en Obtener Reporte" sin `:`).
  - Devuelve algo distinto de `data` o de `null`/relanzar tras el `apiFetch` — típicamente
    `return true` en vez de devolver el cuerpo de la respuesta. Todos los `actualizar*` y
    `eliminar*` de cada fichero (`actualizarNumero`, `eliminarNumero` ×2,
    `actualizarPartida`, `eliminarPartida`, `eliminarUsuario`).
  - Tiene lógica propia antes o dentro del `try` más allá de construir la ruta como una
    única expresión (p. ej. una variable `ruta` con un ternario para un query param
    condicional): `ObtenerDatosPartida`. Se dejó fuera aunque probablemente sería seguro
    de extraer, por prudencia.
  - Explícitamente excluida por el documento: `VerificarUsuario` (login, verificada en la
    etapa de seguridad) y `ObtenerBoletosAleatorios` (desviación documentada previa).

  Con esos criterios, se unificaron **21 funciones** (13 al molde `pedirODevolverNull`, 8
  al molde `pedirOLanzar`) en `Mensaje.js`, `Ganador.js`, `Compra.js`, `Numero.js`,
  `Partida.js`, `UsuarioPromocion.js`, `Boleto.js` y `Usuario.js` (en ese orden, de menor a
  mayor riesgo, `Usuario.js` al final). Se añadieron `pedirODevolverNull` y `pedirOLanzar`
  a `http.js` — la única adición permitida ahí. `sesion.js` no se tocó.

  Para cada función unificada se pasó la ruta ya construida (cuando la ruta era una
  concatenación directa en la llamada, como `"/boleto/reiniciar-boletos/" + idPartida +
  "/" + Precio`, se pasó esa misma expresión tal cual) y la `etiqueta` de log **copiada
  literal** del mensaje original, typos y etiquetas incorrectas incluidas (p. ej.
  `AgregarCreditosUsuario` seguía logueando "Error en VerificarUsuario:" — se conservó ese
  error de copy-paste en vez de corregirlo, porque corregirlo sería un cambio de
  comportamiento fuera del alcance de esta tarea).

**No se ejecutó `expo export` ni se generó un bundle.** No hay confirmación de que la app
siga bundleando ni funcionando en tiempo de ejecución. Esto debe verificarse en el
checklist manual final (tarea 06 / emulador) antes de dar las tareas por buenas de verdad.

## Zonas prohibidas

Ninguna tarea las toca. Verificado el 2026-08-30:

| Fichero | Por qué |
|---|---|
| `PartidaEnCurso.js` | **39 usos de refs**; el estado se espeja para los `setTimeout`. Solo se le quitan logs (tarea 02) |
| `ItemMiBoleto.js:46` | `Object.values(boleto).slice(4)` depende del orden de las claves |
| `ItemNro.js:18,84` | El audio se dispara con `index === 0` |
| `Utils/sesion.js`, `Utils/http.js` | De la etapa de seguridad, verificados en dispositivo |

## Mediciones

Se rellenan durante la ejecución; alimentan la sección 2 del informe.

| Métrica | Antes | Después |
|---|---|---|
| `console.log` | 47 | **2** (los de `ItemNro.js`, zona prohibida, dejados a propósito) |
| `console.error` | 68 | **68** (confirmado igual) |
| Líneas en `src/Utils/` | 942 | **570** (-372 en total: -233 tarea 03 por funciones muertas, -139 tarea 04 por unificar 21 funciones a dos ayudantes) |
| Bloques `try` en `Utils/` | 60 | 24 (43 tras la tarea 03; -21 en la 04 por las funciones unificadas, +2 porque `pedirODevolverNull` y `pedirOLanzar` tienen su propio `try` en `http.js` — antes esos 21 `try` estaban repetidos, ahora viven en dos sitios) |
| Ficheros `.js` | 81 | 81 (ningún fichero creado ni borrado) |
| Imports sin usar eliminados | — | 125 especificadores en 39 ficheros (import React nunca tocado) |
| Comparaciones de rol con literal | 7 (6 comparaciones + 1 asignación) | 0 fuera de `roles.js` y `usuarioInvitado.js` (excepción documentada) |
| Bundle | 5.47 MB (declarado en el plan, no reproducido) | — no se pudo generar en ninguna tarea |

## Aviso sobre la verificación

**Este plan no puede probar la app.** `expo export` demuestra que compila, no que funcione.
La validación real es el checklist manual de la tarea 06, que requiere emulador.

## Desviaciones

Anotar aquí cualquier apartamiento del plan escrito, con su motivo. Alimenta la
sección 3 del informe final.

- **El plan se detuvo en la tarea 01** por el bloqueo de entorno descrito arriba
  (`cdn.sheetjs.com` rechazado por la política de red de la sesión, dependencia `xlsx`
  no instalable, `expo export` no ejecutable). No es un apartamiento de diseño: es la
  consecuencia directa de la regla explícita de la tarea 01 ("si `expo export` falla
  aquí, detener el plan entero").
- **El usuario autorizó explícitamente avanzar las tareas 02, 03, 05 y, tras una
  advertencia aparte sobre su riesgo, también la 04, sin `expo export`**, aceptando el
  riesgo en todos los casos. Se hizo con revisión manual línea por línea (02, 05, 04) o de
  una muestra representativa más scripts de detección basados en AST (03), y un chequeo de
  sintaxis JS/JSX (no equivalente a `expo export`) — ver «Verificación degradada» arriba.
  `PartidaEnCurso.js` solo perdió líneas de log, según lo permitido; en `ItemNro.js` (zona
  prohibida, sin excepción para logs) se dejaron sus 2 `console.log` intactos a propósito.
- **Tarea 04: criterio más estricto que el documento.** El documento solo pide catalogar
  qué devuelve cada función al fallar; en la práctica había más diferencias sutiles entre
  funciones "parecidas" (validación por `!data` vs `!Array.isArray(data)`, mensajes de
  `console.error` con o sin los dos puntos finales, `return true` en vez del cuerpo de la
  respuesta). Se excluyó cualquier función que no calzara byte a byte, incluso cuando el
  documento sugiere ejemplos de "envolver" la validación extra alrededor del ayudante
  (como con `ObtenerUsuarios`) — no se aplicó esa técnica porque cambia el texto exacto
  del `console.error` en el caso límite de una respuesta vacía, y verificar que ese caso
  límite no importa exige poder ejecutar la app. Detalle completo arriba.
- **Tarea 05, la constante de `usuarioInvitado.js` no se aplicó** por estar el fichero
  dentro de `src/components/Data/` (zona prohibida). El propio documento de la tarea lo
  permitía condicionalmente; se optó por la lectura más conservadora igualmente.
- **Tarea 03, paso 2 (variables locales muertas) no se intentó**, ver «Verificación
  degradada» — riesgo de automatizar mal el caso del hueco en un destructuring de
  `useState`, sin forma de probarlo en ejecución.
- **`src/Utils/storagePermissions.js` quedó como fichero huérfano** tras eliminar su única
  función (muerta) y el import muerto que la traía. No se borró el fichero: decisión de
  alcance, ver `HALLAZGOS.md`.
