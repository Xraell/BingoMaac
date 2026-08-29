# Etapa 1 — Actualización de dependencias

Estado del proyecto al iniciar esta etapa (29/08/2026):

- Expo SDK **52** (actual: 57), React Native **0.76.3** (esperado en SDK 52: 0.76.9).
- **39 vulnerabilidades**: 3 críticas, 19 altas, 13 moderadas, 4 bajas.
- Paquetes muertos, fantasma o mal declarados en `package.json`.

## Alcance

Esta etapa **solo actualiza dependencias**. No se refactoriza código de la app salvo lo
estrictamente necesario para que compile. Todo cambio de arquitectura, migración de
librerías con API distinta y limpieza de código queda para la **Etapa 2 —
Refactorización**.

Regla práctica: si una tarea obliga a reescribir lógica de negocio, no pertenece a esta
etapa.

### Fuera de alcance (Etapa 2)

| Tema | Por qué se pospone |
|---|---|
| Salto a Expo SDK 53→57 | Arrastra React 19 + New Architecture; rompe navegación y audio a la vez |
| `expo-av` → `expo-audio` | API distinta, toca 5 archivos incluido el motor de audio del juego |
| `@react-navigation/material-bottom-tabs` → Paper | Cambia la construcción de ambos navigators |
| Unificar `react-native-vector-icons` en `@expo/vector-icons` | Es refactor de imports, no actualización |
| URL base de la API duplicada en 8 archivos | Refactor puro |

## Tareas

Ejecutar **en orden**. Cada una es independiente y termina en un commit propio.

| # | Tarea | Riesgo | Commit |
|---|---|---|---|
| [01](01-limpiar-dependencias-basura.md) | Eliminar `@types/react-native` y `eas` | Bajo | `chore(deps): eliminar dependencias no utilizadas` |
| [02](02-alinear-versiones-sdk52.md) | Alinear versiones al SDK 52 con `expo install --check` | Bajo | `chore(deps): alinear versiones con Expo SDK 52` |
| [03](03-corregir-vulnerabilidades-transitivas.md) | `npm audit fix` sobre transitivas | Bajo-medio | `fix(deps): corregir vulnerabilidades transitivas` |
| [04](04-resolver-xlsx.md) | Resolver `xlsx` (sin parche en npm) | Medio | `fix(deps): actualizar xlsx a version parcheada` |
| [05](05-verificacion-final.md) | Verificación integral y cierre de etapa | — | `docs: cerrar etapa 1 de actualizacion` |

## Cómo ejecutar

Existe una skill que automatiza cada tarea con sus verificaciones:

```
/actualizar-dependencias 01
```

El argumento es el número de tarea (`01`…`05`). Sin argumento, la skill muestra el estado
de la etapa y sugiere la siguiente tarea pendiente.

## Verificación transversal

Ninguna tarea se da por terminada sin esto:

```bash
npx expo-doctor
npx expo export --platform android --output-dir <temporal> --clear
```

`expo export` compila el bundle real de Android y falla si Metro no resuelve algún módulo,
que es justo el riesgo de tocar dependencias. No requiere intervención de nadie, así que
las tareas 01–04 se verifican y commitean solas.

El proyecto **no tiene tests ni linter**, de modo que la validación funcional (audio,
exportación, login) es manual y está **concentrada en la tarea 05**, al cierre de la etapa.

> **El target web no es una alternativa.** Faltan `react-dom` y `react-native-web`, e
> instalarlos saldría del alcance de esta etapa. Aunque estuvieran, `expo-av`,
> `AsyncStorage`, los permisos de Android y `expo-sharing` se comportan distinto en
> navegador y no sustituyen la prueba en dispositivo.

### Flujos críticos a probar

El bingo en vivo es lo más frágil del proyecto y lo que ninguna herramienta automática
cubre:

1. **Login** en los tres roles: `ADMIN`, `USER` y `GUEST` (invitado).
2. **Partida en vivo (admin)**: iniciar partida, cantar un número manual, activar el modo
   automático (timer de 5 s) y confirmar que **suena el audio** del número.
3. **Sincronización (jugador)**: SINCRONIZAR con ≥2 boletos, ver el cartón tachándose y el
   polling de 11 s.
4. **Exportar reporte** a Excel — imprescindible tras la tarea 04.
5. **Finalizar partida**: el centinela `-1` y el modal de mensaje final.

## Rollback

Cada tarea es un commit aislado, así que revertir es directo:

```bash
git revert <hash>
```

Si `node_modules` queda inconsistente tras un fallo:

```bash
git checkout package.json package-lock.json
rm -rf node_modules
npm install
```
