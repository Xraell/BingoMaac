# Estado — corrección de hallazgos (app)

Leyenda: ⬜ pendiente · 🔄 en curso · ✅ hecha · ❌ revertida · ⏭ saltada

| # | Tarea | Estado | Commit | Notas |
|---|---|---|---|---|
| 01 | Línea base y reproducción | ✅ | (tag) | Tag `pre-correccion-app` creado. Sin commit de código. |
| 02 | Contrato de créditos | ✅ | `acf4849` | POST + `puntos` numérico en `Utils/Usuario.js`; 4 tests nuevos. |
| 03 | Error visible al fallar | ✅ | `dc8caa4` | `pedirOLanzar` + `error.message` en los dos modales de crédito. |
| 04 | Informe de cierre | ✅ | (pendiente de commit) | `INFORME.md` con checklist de verificación manual. |

## Línea base

| Métrica | Valor |
|---|---|
| Tests | 32 passed, 32 total |
| Snapshots | 21 passed, 21 total |
| Suites | 4 passed, 4 total |
| Bundle (`expo export`) | 5.45 MB (`index-c5571d9358b3823a4bf33cc5180c3b2f.hbc`), exit 0 |

## Bitácora

### Tarea 01 — Línea base y reproducción (✅)

- `pnpm install`: lockfile al día, sin instalar nada nuevo (no hizo falta el fallback sin
  `--frozen-lockfile`).
- `npx jest`: 4 suites, 32 tests, 21 snapshots, todo en verde. Ruido preexistente presente
  (`ReferenceError: ... Jest environment after it has been torn down` /
  `TypeError: _bezier is not a function` de un timer de `Animated`), `exit=0` como estaba
  documentado.
- `npx expo export --platform android`: exit 0, bundle 5.45 MB — igual a la línea base
  conocida.
- Tag `pre-correccion-app` creado sobre el commit de partida.
- Contrato roto confirmado con grep, sin backend levantado:
  - Cliente (`src/Utils/Usuario.js:54` y `:57`): `agregarCreditos`/`retirarCreditos` llaman
    `pedirODevolverNull("/usuario/agregar-creditos/" + id + "/" + nroCreditos, ...)` y el
    equivalente para retirar, **sin pasar `opciones`** — `apiFetch` sin `opciones.method`
    hace `fetch` con el verbo por defecto, **GET**, y el número de créditos va embebido en
    el path.
  - Backend (`../BACKEND/routes/api.php:50-51`): declara
    `Route::post('/agregar-creditos/{id}', ...)` y
    `Route::post('/retirar-creditos/{id}', ...)` — **POST**, con `{id}` como único
    parámetro de ruta (el backend espera `puntos` en el body, no en la URL).
  - Conclusión: toda llamada actual a agregar/retirar créditos devuelve 404 (verbo
    incorrecto + ruta con un segmento de más). Es el bug que corrige la tarea 02.

### Tarea 02 — Corregir la llamada de créditos (✅)

- `AgregarCreditosUsuario`/`RetirarCreditosUsuario` en `src/Utils/Usuario.js` ahora hacen
  `POST` a `/usuario/agregar-creditos/{id}` y `/usuario/retirar-creditos/{id}` (sin la
  cantidad en la URL), con `{ puntos: parseInt(nroCreditos, 10) }` en el body. Se conservó
  `pedirODevolverNull` (el cambio de ayudante es de la tarea 03), solo se le pasó el
  `opciones` que ya soporta.
- La conversión a entero vive en un único sitio (`Utils/Usuario.js`), no en los modales, tal
  como pedía la tarea — cubre ambos modales y no toca ningún árbol de React.
- No se añadió validación de rango en el cliente (queda en el servidor).
- Test nuevo: `src/Utils/__tests__/usuarioCreditos.test.js`, 4 casos — método POST, URL sin
  la cantidad, body con `puntos` numérico, y conversión a número cuando `nroCreditos` llega
  como string (el caso que protege del segundo defecto).
- Verificación: `npx jest` → 5 suites, 36 tests (32 + 4), 21 snapshots sin reescribir.
  `npx expo export --platform android` → exit 0, bundle 5.45 MB, igual a la línea base.
  `grep -n "agregar-creditos\|retirar-creditos" src/Utils/Usuario.js` ya no muestra
  concatenación de la cantidad en la ruta.

### Tarea 03 — Que el fallo de créditos no se trague el error (✅)

- Reconfirmado por grep antes de tocar nada: los únicos llamantes de
  `AgregarCreditosUsuario`/`RetirarCreditosUsuario` en `src/` son
  `ModalAgregarCredito.js` y `ModalRetirarCredito.js` (más el test de la tarea 02). No
  apareció un tercer llamante, así que la tarea no se saltó.
- `Utils/Usuario.js`: las dos funciones de crédito pasaron de `pedirODevolverNull` a
  `pedirOLanzar` (relanza en vez de devolver `null`). `pedirODevolverNull` sigue
  importado y en uso por `ObtenerTotalCreditos`, así que no quedó import muerto.
- Único cambio en los modales: la línea del `Alert.alert("Error", ...)` en el `catch`,
  en los dos ficheros, para mostrar `error.message ?? "Ocurrio un error desconocido"`.
  `setLoading(false)` ya se ejecutaba antes de esa línea en ambos — no hizo falta tocarlo.
- Verificación: `npx jest` → 5 suites, 36 tests, 21 snapshots sin reescribir.
  `npx expo export --platform android` → exit 0, bundle 5.45 MB.
  `grep -rn "pedirODevolverNull\|pedirOLanzar" src/Utils/Usuario.js` confirma que solo
  cambiaron las dos funciones de crédito (el resto de usos de ambos ayudantes sigue igual).
  `git diff pre-correccion-app -- src/components/Modales/` toca únicamente esa línea en
  los dos modales de crédito.

### Tarea 04 — Informe de cierre (✅)

- `INFORME.md` escrito con las seis secciones pedidas: resumen, antes/después, el segundo
  defecto (string→integer), checklist de verificación manual (sin marcar — nada se probó
  en ejecución), volcado de `HALLAZGOS.md` (vacío de hallazgos nuevos: no apareció tercer
  llamante, ningún snapshot se movió), y lo que sigue pendiente.
- `npx jest` → 5 suites, 36 tests, 21 snapshots. `npx expo export --platform android` →
  exit 0, 5.45 MB. `git status --short` sin cambios propios sin commitear antes de este
  commit final.
- Plan `corregir-app` completo: tareas 01-04 hechas, ninguna revertida ni saltada.
