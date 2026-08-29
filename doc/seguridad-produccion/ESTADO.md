# Estado de la etapa de seguridad — app

El agente actualiza este fichero al cerrar cada tarea. Consultarlo con
`/blindar-app estado`.

## Progreso

| # | Tarea | Estado | Commit | Notas |
|---|---|---|---|---|
| 01 | Centralizar la API | ⬜ pendiente | — | |
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

Anotar aquí cualquier apartamiento del plan escrito, con su motivo. Alimenta la
sección 3 del informe final.

_(vacío — el plan no ha empezado)_
