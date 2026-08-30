# Estado de la etapa de seguridad — app

El agente actualiza este fichero al cerrar cada tarea. Consultarlo con
`/blindar-app estado`.

## Progreso

| # | Tarea | Estado | Commit | Notas |
|---|---|---|---|---|
| 01 | Centralizar la API | ✅ completada | `bd0bf90` | ver Desviaciones |
| 02 | Almacenamiento seguro | ⬜ pendiente | — | |
| 03 | Flujo de sesión | ⬜ pendiente | — | |
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
