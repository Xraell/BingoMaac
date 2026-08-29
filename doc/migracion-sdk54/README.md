# Etapa 3 — Migración a Expo SDK 54

Estado de partida: **Expo SDK 52** · React Native 0.76.9 · React 18.3.1
Destino: **Expo SDK 54** · React Native 0.81 · React 19.1

## Por qué es la Etapa 3 y no la 2

Esta migración **depende** de la Etapa 2 (refactorización). Dos bloqueos la hacen inviable
antes:

| Bloqueo | Por qué impide el salto |
|---|---|
| `@react-navigation/material-bottom-tabs` | Exige `@react-navigation/native ^6.0.0`; SDK 54 con React 19 necesita React Navigation 7. El paquete está marcado *"no longer supported"* en npm |
| `expo-av` | Deprecado en SDK 53, **eliminado en SDK 55**. Sostiene todo el audio del juego en 5 archivos |

Si se intenta el salto sin resolver eso antes, se rompen **la navegación y el audio a la
vez**, sin forma de aislar la causa.

> **Requisito de entrada:** la Etapa 2 debe haber migrado `expo-av` → `expo-audio` y
> `material-bottom-tabs` → `react-native-paper`. Sin eso, no empezar esta etapa.

## No se salta directo de 52 a 54

Expo **solo admite subir de SDK en SDK**. La ruta obligatoria es:

```
52 → 53 → 54
```

Cada salto se valida por separado. Intentar `expo install expo@54` desde 52 deja el árbol
de dependencias inconsistente.

## Qué cambia realmente

### SDK 53 (paso intermedio)

- **React 19** — cambios de comportamiento en refs, `useEffect` y renderizado.
- React Native 0.79.
- **New Architecture activada por defecto** (con opt-out disponible).
- Metro habilita `package.json:exports` por defecto — puede romper librerías con *dual
  package hazard*.
- Se elimina el polyfill de `setImmediate`.
- Android usa tema `DayNight` y edge-to-edge por defecto.

### SDK 54 (destino)

- React Native **0.81**, React **19.1**.
- **`expo-file-system` reorganizado**: la API vieja pasa a `expo-file-system/legacy`; la
  nueva es la predeterminada. **Afecta directamente la exportación de reportes.**
- Metro: los imports de `metro/src/..` pasan a `metro/private/..`.
- Se elimina el soporte de JSC (Reanimated v4 exige New Architecture).
- **Node mínimo 20.19.4**; Xcode mínimo 16.1.
- La New Architecture **todavía no es obligatoria**, pero sí lo será en SDK 55.

## Riesgo específico de este proyecto

Los puntos frágiles documentados en `CLAUDE.md` son justamente los que React 19 y la New
Architecture pueden alterar:

1. **`PartidaEnCurso.js`** — espeja estado en refs (`nrosRetiradosRef`, `automaticoRef`,
   `ganadores*Ref`) porque los callbacks del timer viven fuera del ciclo de render. React 19
   cambia el manejo de refs y el batching; es el archivo de mayor riesgo del repositorio.
2. **Audio por `index === 0`** en `ItemNro` — depende del orden de renderizado.
3. **`Object.values(boleto).slice(4)`** en `ItemMiBoleto` — no lo afecta React, pero se
   rompe en silencio, así que hay que mirarlo en cada prueba.
4. **Exportación a Excel** — `expo-file-system` cambia de API en SDK 54.
5. **Polling de 11 s** en `ListaMisBoletos` (`setInterval` + cleanup).

## Tareas

Ejecutar **en orden**. Cada una termina en su propio commit.

| # | Tarea | Riesgo | Commit |
|---|---|---|---|
| [01](01-preparacion-y-baseline.md) | Preparar entorno y registrar línea base | Bajo | `chore: preparar migracion a sdk 54` |
| [02](02-migrar-sdk53.md) | Subir a SDK 53 (React 19 + New Architecture) | **Alto** | `feat(sdk): migrar a expo sdk 53` |
| [03](03-estabilizar-sdk53.md) | Estabilizar SDK 53 y validar en dispositivo | Alto | `fix(sdk): estabilizar sdk 53` |
| [04](04-migrar-sdk54.md) | Subir a SDK 54 | Medio-alto | `feat(sdk): migrar a expo sdk 54` |
| [05](05-migrar-file-system.md) | Adaptar `expo-file-system` a la nueva API | Medio | `refactor(reportes): adaptar a la nueva api de expo-file-system` |
| [06](06-verificacion-final.md) | Verificación integral y cierre | — | `docs: cerrar etapa 3 de migracion` |

## Cómo ejecutar

```
/migrar-sdk54 01
```

Argumento: número de tarea (`01`…`06`). Sin argumento, muestra el estado y sugiere la
siguiente pendiente.

## Verificación

Igual que en la Etapa 1, la verificación automática es la compilación del bundle:

```bash
npx expo-doctor
npx expo export --platform android --output-dir <temporal> --clear
```

**Diferencia clave con la Etapa 1:** allí bastaba compilar porque solo cambiaban versiones
de paquetes. Aquí cambian React, el runtime y la arquitectura nativa, así que **compilar no
alcanza**: las tareas 03 y 06 exigen prueba en dispositivo real.

> Los cambios de la New Architecture no se manifiestan en el bundle, sino en tiempo de
> ejecución. Un `expo export` en verde no dice nada sobre si el modo automático del bingo
> sigue funcionando.

### Development build obligatorio

Expo Go solo soporta el SDK más reciente. A partir de la tarea 02 hay que generar un
development build:

```bash
eas build --profile development --platform android
```

## Rollback

Cada tarea es un commit aislado. Además, **antes de empezar** conviene marcar el punto de
retorno:

```bash
git tag pre-sdk54
```

Volver atrás:

```bash
git reset --hard pre-sdk54
rm -rf node_modules && npm install
```

## Fuera de alcance

- **SDK 55** — exigirá New Architecture obligatoria y eliminará `expo-av`. Etapa posterior.
- **Habilitar New Architecture de forma explícita** si en SDK 53 se optó por desactivarla:
  se decide al cierre de esta etapa.
- Cualquier refactor que no exija la migración.
