# Estado de la etapa de seguridad — app

El agente actualiza este fichero al cerrar cada tarea. Consultarlo con
`/blindar-app estado`.

## Progreso

| # | Tarea | Estado | Commit | Notas |
|---|---|---|---|---|
| 01 | Centralizar la API | ✅ completada | `bd0bf90` | ver Desviaciones |
| 02 | Almacenamiento seguro | ✅ completada | `148e896` | ver Desviaciones |
| 03 | Flujo de sesión | ✅ completada | (pendiente de commit) | ver Desviaciones |
| 04 | Autorización en el cliente | ⬜ pendiente | — | |
| 05 | Endurecer el cliente | ⬜ pendiente | — | |
| 06 | Verificación final | ⬜ pendiente | — | |

Estados: ⬜ pendiente · 🟡 en curso · ✅ completada · ❌ bloqueada

## Línea base

Valores observados al redactar el plan (2026-08-29), **a reconfirmar antes de ejecutar**:

- Expo SDK 52 (`~52.0.49`), React Native 0.76.9, React 18.3.1
- Sesión: `idUsuario` en `AsyncStorage`, **sin cifrar y sin token**
- Rol decidido en el cliente (`BotonesLogin.js`: `response.Rol == "ADMIN"`)
- URL de la API: `http://10.0.2.2:8000` repetida en **8 ficheros** de `src/Utils/`
- `expo-secure-store`: **no instalado**
- Sin tests ni linter
- Modo invitado activo (`usuarioInvitado`, `Rol: "GUEST"`), sin token
- `AsyncStorage` lo usa además `ModalInicioPartida.js` para algo **no** relacionado con
  la sesión — cuidado con `clear()`

**Nota:** el README de la etapa dice SDK 54 en algunos puntos por la migración de
`doc/migracion-sdk54/`. Verificar en `package.json` cuál es el SDK real al empezar y
corregir aquí lo que no cuadre.

## Dependencias del backend

Plan hermano: `BACKEND/doc/seguridad-produccion/`. **Repositorios git distintos**.

| App | Backend requerido |
|---|---|
| 01 | ninguno |
| 02–03 | 04 (emisión de tokens) |
| 04 | 05 (rutas cerradas) |
| 05 | 07 (HTTPS y CORS) — **despliegue conjunto** |

## Decisiones pendientes

| Decisión | Tarea | Estado |
|---|---|---|
| Qué ve un invitado con la API cerrada | 04 | ⬜ sin decidir |
| Dominio de producción definitivo | 05 | ⬜ sin definir |
| Orden de despliegue app/backend en la fase 3 | 05 | ⬜ sin acordar |

## Desviaciones

### Tarea 01 (2026-08-29)

- **`expo-constants` no era dependencia directa.** Estaba instalado de forma transitiva
  (v17.0.8, vía `expo`) pero ausente en `package.json`. Se instaló explícitamente con
  `npx expo install expo-constants` (respeta la matriz del SDK 52) y luego se regeneró
  `pnpm-lock.yaml` con `pnpm install`, porque `expo install` invoca `npm` internamente y
  había dejado un `package-lock.json` modificado — descartado con `git checkout --` para
  no reintroducir npm tras la migración a pnpm del commit anterior.
- **`const UrlApi` se eliminó, no se reescribió a ruta relativa.** El check automático
  `grep -rn "const UrlApi" src/` exige que no quede ninguna. Las rutas quedaron
  inlineadas como literales en cada llamada a `apiFetch(...)`.
- **`ObtenerBoletosAleatorios` (`Boleto.js`) cambia de comportamiento en un caso límite,
  no cubierto por el check de firmas.** El original releía `response.json()` dentro del
  `catch`, lo que lanzaba un `TypeError` no controlado si `response` era `undefined`
  (fallo de red antes de recibir respuesta). Con `apiFetch` eso ya no puede ocurrir: el
  `catch` ahora siempre recibe el error original y devuelve `null`, igual que las demás
  funciones `Obtener*`. Es un endurecimiento incidental, no un cambio de contrato.
- Riesgo heredado para tareas futuras: `src/config/api.js` deja `PRODUCCION` con el
  placeholder `https://<dominio-real>/api` sin confirmar — la tarea 05 (o antes, si se
  hace un build de producción) necesita el dominio real.

Preexistente, no tocado en esta tarea: `package-lock.json` sigue trackeado en git pese a
la migración a pnpm (aviso de `expo-doctor`, "Multiple lock files detected"); fuera de
alcance de la tarea 01.

### Tarea 02 (2026-08-30)

- **Backend confirmado con `curl` real** (no el placeholder `<dominio>` del documento):
  `POST http://localhost:8080/api/usuario/authenticarte` con credenciales válidas
  devuelve `token` (formato `N|hash`) junto a los datos del usuario. Rechaza credenciales
  inválidas con 401 y trae rate limiting (`X-RateLimit-*`). Dependencia de backend de la
  tarea 02 satisfecha.
- **El documento menciona "matriz del SDK 54" dos veces** (pasos 1 y verificación
  automática), pero el proyecto sigue en SDK 52 (confirmado en la tarea 01). Es el mismo
  desfase de redacción que ya advertía la sección de Línea base. `npx expo install`
  resolvió la versión correcta para SDK 52 automáticamente (`expo-secure-store@~14.0.1`),
  así que no bloqueó nada.
- **`expo-dev-client` no estaba instalado, pese a que `eas.json` ya tenía
  `developmentClient: true` en el perfil `development`.** Sin él, `eas build --profile
  development` fallaba antes de llegar a la nube ("you don't have expo-dev-client
  installed"). No lo pide el documento de la tarea 02, pero es un prerrequisito de
  infraestructura sin el cual ningún development build de esta etapa es posible.
  Instalado con `npx expo install expo-dev-client` (`~5.0.20`), confirmado con el
  usuario antes de proceder. Se incluye en el mismo commit que el resto de la tarea 02
  porque separarlo habría exigido dos pasadas de `pnpm install` intermedias sobre el
  lockfile, más frágil que documentarlo aquí.
- **`npx expo install` (ambas veces, `expo-secure-store` y `expo-dev-client`) volvió a
  ensuciar `package-lock.json` vía `npm`.** Mismo patrón que en la tarea 01: descartado
  con `git checkout --` y reconciliado con `pnpm install`.
- **La segunda instalación (`expo-dev-client`) falló tres veces seguidas con
  `ERR_SSL_CIPHER_OPERATION_FAILED` al ejecutar `npm install` internamente** (error
  transitorio de red/TLS, no de código). La entrada quedó en `package.json` sin que
  `node_modules` tuviera el paquete; se resolvió con `pnpm install`, que sí completó sin
  problemas de red.
- Build de desarrollo generado en EAS con `expo-secure-store` y `expo-dev-client` ya
  enlazados nativamente:
  https://expo.dev/accounts/israelrvmwork/projects/BingoMaac/builds/04a0cf0d-5771-4608-9f39-b3691d7224e8
- Prueba en dispositivo confirmada por el usuario: arranque correcto, modo invitado sigue
  funcionando sin token, login con usuario real sin cambios, y ciclo completo
  `guardarToken` → cierre total de la app → reapertura → `leerToken` → `borrarToken` →
  `leerToken` verificado persistente entre reinicios.
- `BotonesLogin.js` no se tocó, tal como exige el documento — sigue guardando
  `idUsuario` en `AsyncStorage` sin cifrar. Eso es la tarea 03.

### Tarea 03 (2026-08-30)

- **Se creó el emisor de eventos de sesión expirada con `DeviceEventEmitter` de
  `react-native`**, no mencionado explícitamente por el documento pero requerido por el
  paso 5 ("un emisor de eventos sencillo al que `AppProvider` se suscribe"). Vive en
  `src/Utils/sesion.js` junto al resto de la capa de sesión, sin dependencias nuevas.
  `AppProvider.js` se suscribe en un `useEffect` y vuelve a `usuarioInvitado`/`opc=0`.
- **`verificarUsuarioPorID` se eliminó por completo de `BotonesLogin.js`.** Era la
  función que hacía `ObtenerUsuario(id)` sin credencial — el agujero exacto que describe
  el documento. `verificarSession` ahora restaura con `GET /usuario/me` usando el token.
- **`BotonRegistro.js`: se optó por login inmediato tras el alta**, tal como recomienda
  el documento ("más simple, camino ya probado"). Se eliminó la asignación manual
  `nuevousuario.Clave = usuario.Clave` porque ya no hace falta guardar la clave en el
  estado del usuario.
- **El check literal `grep -rn "seendToBody" src/` exigía eliminar también la variable**,
  no solo el `console.log` que la exponía. Se inlineó el objeto del body directamente en
  la llamada a `apiFetch`, seguiendo el ejemplo de código del propio documento.
- **Bug de entorno descubierto durante la prueba en dispositivo, no de esta tarea:**
  `src/config/api.js` (tarea 01) apuntaba a `http://10.0.2.2:8000/api`, pero el backend
  real de desarrollo corre en el puerto `8080` (confirmado con `curl` en la tarea 02).
  El login daba 401 en el emulador pese a que el mismo `curl` contra `localhost:8080`
  devolvía 200 con token. Corregido el puerto a `8080`. Se incluye en el commit de la
  tarea 03 porque fue la propia prueba de esta tarea la que lo destapó y era bloqueante
  para completarla.
- Prueba en dispositivo confirmada por el usuario: los 8 puntos del checklist (login,
  persistencia, logout, invitado, credenciales incorrectas, modo avión, token inválido
  con `guardarToken("basura")` → reabre y cae al login, y el modal de inicio de partida
  sin alterar) verificados en el emulador tras corregir el puerto.
- `PartidaEnCurso.js` no se tocó.
