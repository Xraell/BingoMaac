# Tarea 03 — Estabilizar SDK 53 y validar en dispositivo

**Riesgo:** alto · **Depende de:** [02](02-migrar-sdk53.md) · **Commit:** `fix(sdk): estabilizar sdk 53`

## Por qué esta tarea existe

En la Etapa 1 bastaba compilar el bundle porque solo cambiaban versiones de paquetes. Aquí
cambiaron **React (18 → 19), el runtime nativo y la arquitectura**. Nada de eso se detecta
compilando: se manifiesta al ejecutar.

Esta es la **puerta de control** de la etapa. No se pasa a SDK 54 sin cerrarla.

## Prueba en dispositivo (obligatoria)

Requiere el development build de la tarea 02.

### 1. Motor de partida en vivo — máxima prioridad

`PartidaEnCurso.js` es el archivo de mayor riesgo del repositorio: espeja estado en refs
(`nrosRetiradosRef`, `automaticoRef`, `ganadores*Ref`, `isAddingNumber`,
`ultimoNroAgregado`) porque los callbacks del `setTimeout` viven fuera del ciclo de render.
**React 19 cambia el manejo de refs y el batching**, que es exactamente de lo que depende
este componente.

- [ ] Iniciar partida como ADMIN; suena la locución de bienvenida.
- [ ] Cantar un número manual: aparece en la lista y suena su audio.
- [ ] **Modo automático**: sale un número nuevo cada ~5 s.
- [ ] **Sin repeticiones** en una tanda de al menos 15 números — si se repiten,
      `nrosRetiradosRef` está leyendo valores obsoletos.
- [ ] Detener el automático: se detiene de verdad y no queda ningún timer huérfano.
- [ ] Reanudar: continúa sin repetir los ya cantados.
- [ ] Al aparecer un ganador, el modo automático se detiene solo.

### 2. Audio

`ItemNro` reproduce sonido solo cuando `index === 0`, o sea depende del orden de
renderizado, que React 19 puede alterar.

- [ ] Suena **solo** el número más reciente, no varios a la vez.
- [ ] El último número se ve destacado (120 px).
- [ ] No hay fugas: tras 20 números el audio sigue limpio.

### 3. Sincronización del jugador

- [ ] SINCRONIZAR con ≥2 boletos arranca el polling de 11 s.
- [ ] El cartón se va tachando.
- [ ] La tabla de 90 números marca los extraídos.
- [ ] DESINCRONIZAR detiene el `setInterval` (sin peticiones de fondo).
- [ ] El pinch-zoom responde (`react-native-gesture-handler` con New Architecture).

### 4. Cartones

- [ ] Los cartones muestran 15 números en la grilla 3×9 correcta.
- [ ] **Vigilar `Object.values(boleto).slice(4)`**: si el cartón sale descolocado o con
      celdas vacías de más, ese cálculo se rompió. Falla en silencio.

### 5. Navegación y sesión

- [ ] Los tabs de USER y ADMIN se ven y navegan bien (migrados a Paper en la Etapa 2).
- [ ] Login en los tres roles: ADMIN, USER, GUEST.
- [ ] La sesión persiste al reabrir (AsyncStorage).

### 6. Layout en Android

SDK 53 activa `DayNight` y edge-to-edge por defecto.

- [ ] El `TopBanner` no queda bajo la barra de estado.
- [ ] Los tabs inferiores no quedan bajo la barra de navegación.
- [ ] La app respeta el modo claro (`userInterfaceStyle: light` en `app.json`).

### 7. Reportes

- [ ] Exportar a Excel funciona (en SDK 53 la API de `expo-file-system` aún no cambió).

## Correcciones permitidas

A diferencia de la Etapa 1, aquí **sí** se puede tocar `src/`, pero solo para arreglar
regresiones de la migración:

- Adaptaciones por cambios de React 19 (refs, efectos, timers).
- Ajustes de layout por edge-to-edge.
- Reemplazo de APIs eliminadas (`setImmediate` → `setTimeout(fn, 0)`).

**No** se permite refactorizar, renombrar ni "mejorar de paso". Si algo funciona, no se
toca.

## Si el modo automático falla

Es el fallo más probable. Orden de diagnóstico:

1. ¿Se repiten números? → `nrosRetiradosRef.current` está desactualizado; revisar que el
   `useEffect` que sincroniza el ref siga corriendo.
2. ¿No se detiene? → `automaticoRef.current` no refleja el estado; revisar el cleanup del
   `timeoutRef`.
3. ¿Salen dos números a la vez? → el guard `isAddingNumber` no está frenando; React 19
   cambió el batching.

Regla de `CLAUDE.md`: **al tocar este componente hay que actualizar tanto el estado como su
ref**.

## Criterio de aceptación

- Todo el checklist en verde en dispositivo real.
- Sin repeticiones en el modo automático.
- Audio correcto y sin solapamientos.
- Los arreglos aplicados son mínimos y solo por regresión.

## Si no se estabiliza

No forzar el avance. Volver atrás:

```bash
git reset --hard pre-sdk54
rm -rf node_modules && npm install
```

Y replantear qué de la Etapa 2 quedó incompleto.
