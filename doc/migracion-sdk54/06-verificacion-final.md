# Tarea 06 — Verificación final y cierre de etapa

**Riesgo:** — · **Depende de:** [05](05-migrar-file-system.md) · **Commit:** `docs: cerrar etapa 3 de migracion`

## Objetivo

Confirmar que el proyecto quedó en **SDK 54, funcional y sin regresiones**, y registrar el
estado como línea base de la siguiente etapa.

Aquí **no se migra nada**. Si algo falla, se corrige en la tarea que lo originó.

## Verificación automática

```bash
npx expo-doctor
npm audit --registry=https://registry.npmjs.org/
npx expo export --platform android --output-dir <temporal> --clear
```

### Comparación contra la línea base

| Métrica | Antes (Etapa 1) | Meta |
|---|---|---|
| `expo` | 52.0.49 | 54.x |
| `react-native` | 0.76.9 | 0.81.x |
| `react` | 18.3.1 | 19.1.x |
| New Architecture | no | sí (o deuda anotada) |
| `expo-doctor` | 17/18 | igual o mejor |
| Vulnerabilidades | — | igual o menor |

## Verificación manual en dispositivo

Requiere el development build de la tarea 04. **Este es el checklist completo de la etapa.**

### Autenticación
- [ ] Login **ADMIN** → TabsAdmin.
- [ ] Login **USER** → TabsUser.
- [ ] **INGRESAR COMO INVITADO** → GUEST ve el mensaje de registro.
- [ ] Cerrar y reabrir: la sesión persiste (AsyncStorage).

### Partida en vivo — admin *(lo más frágil)*
- [ ] Iniciar partida; suena la locución de bienvenida.
- [ ] Cantar número manual: aparece y suena.
- [ ] Modo automático: un número cada ~5 s.
- [ ] **20 números seguidos sin repetir** (valida los refs bajo React 19).
- [ ] Detener y reanudar el automático: funciona y no deja timers huérfanos.
- [ ] Al haber ganador, el automático se detiene solo.
- [ ] Suena **solo** el número más reciente, destacado a 120 px.

### Sincronización — jugador
- [ ] SINCRONIZAR con ≥2 boletos.
- [ ] Los números llegan y el cartón se tacha.
- [ ] La tabla de 90 marca los extraídos.
- [ ] Pinch-zoom responde.
- [ ] DESINCRONIZAR detiene el polling.

### Cartones
- [ ] Grilla 3×9 correcta con sus 15 números.
- [ ] Sin celdas vacías de más (vigilar `Object.values(boleto).slice(4)`).

### Reportes
- [ ] **EXPORTAR EN EXCEL NUEVO** genera el archivo.
- [ ] El `.xlsx` abre con grilla y resumen correctos.
- [ ] El botón de exportación anterior también funciona.

### Cierre de partida
- [ ] Finalizar partida (centinela `-1`).
- [ ] El jugador sincronizado ve el modal de mensaje final.

### Layout Android
- [ ] `TopBanner` no queda bajo la barra de estado.
- [ ] Los tabs no quedan bajo la barra de navegación.
- [ ] La app respeta el modo claro.

## Diagnóstico si algo falla

| Síntoma | Tarea sospechosa | Por qué |
|---|---|---|
| Números repetidos en automático | [03](03-estabilizar-sdk53.md) | Refs desincronizados bajo React 19 |
| El automático no se detiene | [03](03-estabilizar-sdk53.md) | `automaticoRef` / cleanup del timeout |
| Audio solapado o mudo | [03](03-estabilizar-sdk53.md) | Orden de render y `index === 0` |
| Excel corrupto o vacío | [05](05-migrar-file-system.md) | API de `expo-file-system` |
| Cartón descolocado | [03](03-estabilizar-sdk53.md) | `slice(4)` — falla en silencio |
| Layout bajo las barras del sistema | [03](03-estabilizar-sdk53.md) | Edge-to-edge de SDK 53 |
| La app no arranca | [04](04-migrar-sdk54.md) | Runtime nativo 0.81 |

Rollback total de la etapa:

```bash
git reset --hard pre-sdk54
rm -rf node_modules && npm install
```

## Actualizar CLAUDE.md

La migración invalida datos del documento de arquitectura. Actualizar:

- La línea *"App Expo / React Native (SDK 52, RN 0.76)"* → SDK 54 / RN 0.81.
- Mencionar la New Architecture si quedó activada.
- Si `expo-file-system` quedó en `/legacy`, anotarlo en la sección de Reportes Excel.

## Cierre

Registrar al final de este archivo:

```markdown
## Resultado — <fecha>

- expo / react-native / react: <versiones>
- New Architecture: activada / desactivada (motivo)
- expo-doctor: <n>/18
- Commits de la etapa: <hashes>
- Deuda técnica pendiente: <lista>
```

## Criterio de aceptación

- Checklist manual completo en verde.
- SDK 54 con RN 0.81 y React 19.1.
- `CLAUDE.md` actualizado.

## Deuda técnica para la siguiente etapa

1. **`expo-file-system/legacy` → nueva API** (tarea 05, Opción B).
2. **SDK 55**: exigirá New Architecture obligatoria y **eliminará `expo-av`**.
3. Si la New Architecture quedó desactivada, activarla antes de SDK 55.
4. URL base de la API duplicada en los 8 módulos de `src/Utils/`.
5. El `return true` temprano de `arraysAreEqual` en `PartidaEnCurso.js:110`.
