# 06 — Informe de cierre

**Riesgo:** — · **Depende de:** todas las anteriores

## Objetivo

Dejar por escrito qué se hizo durante la noche y, sobre todo, **qué falta comprobar a
mano**, porque esta etapa no ha podido probar la app.

## Por qué

En el backend, el informe cierra el trabajo: los tests demuestran que sigue funcionando.

**Aquí no.** El plan solo ha podido comprobar que el proyecto compila. Nadie ha abierto la
app. El informe no cierra nada: **entrega trabajo pendiente de validar**, y tiene que
decirlo con claridad.

Un informe que dé a entender que la app está verificada sería falso y peligroso.

## Estructura de `INFORME.md`

### 1. Resumen

Tres o cuatro frases. Cuántas tareas se completaron, cuántas se revirtieron, y **la
advertencia de que nada se probó en ejecución**.

### 2. Antes y después

| Métrica | Antes | Después |
|---|---|---|
| `console.log` | 47 (en 15 ficheros) | |
| `console.error` | (línea base) | **debe ser igual** |
| Líneas en `src/Utils/` | 942 | |
| Bloques `try` en `Utils/` | 59 | |
| Ficheros `.js` en `src/` | 81 | |
| Tamaño del bundle | 5.47 MB | |

Cifras medidas, cada una con su comando.

### 3. Qué se revirtió y por qué

Por cada tarea revertida: qué se intentó, qué check falló, con su salida. Sin adornos.

### 4. Checklist de verificación manual — **la sección más importante**

Lo que hay que probar en el emulador antes de fiarse de este trabajo. Ordenado por
probabilidad de haberse roto:

- [ ] **La app arranca** y llega al login.
- [ ] **Login** con usuario real → entra y ve sus datos. *(Tarea 04 tocó `Utils/`.)*
- [ ] **Modo invitado** funciona.
- [ ] **La partida en curso**: números que salen, audio, modo automático sin repetir.
      *(Tarea 02 quitó 16 logs de `PartidaEnCurso.js`.)*
- [ ] **Mis boletos**: los números que muestra son los correctos.
      *(`ItemMiBoleto` depende del orden de las claves.)*
- [ ] **Comprar un boleto**: descuenta el saldo correcto.
- [ ] **Panel de administración** visible solo para ADMIN. *(Tarea 05 tocó las
      comparaciones de rol.)*
- [ ] **Cerrar sesión** y volver a entrar.

Si algo falla, `git log --oneline` señala la tarea sospechosa y `git revert` de ese commit
la deshace.

### 5. Hallazgos

Volcado de `HALLAZGOS.md`. Se esperan al menos estos, conocidos al redactar el plan:

- Manejo de errores inconsistente en `src/Utils/`: unas funciones devuelven `null`, otras
  relanzan. Unificarlo cambia cómo reaccionan las pantallas.
- Mezcla de `==` y `===` en las comparaciones de rol.
- `package-lock.json` sigue versionado pese a la migración a pnpm (`expo-doctor` avisa de
  "Multiple lock files detected").
- `src/config/api.js` mantiene `https://<dominio-real>/api` como placeholder.

### 6. Lo que sigue pendiente

- **Añadir tests.** Es lo más valioso que le falta a este proyecto y la razón de que este
  plan sea tan conservador. Con Jest y `@testing-library/react-native`, un refactor futuro
  podría ser mucho más ambicioso. Requiere cambiar dependencias y configurar Babel, así
  que necesita supervisión.
- Las zonas prohibidas: `PartidaEnCurso.js`, `ItemMiBoleto.js`, `ItemNro.js`.
- Las tareas 05 y 06 de `doc/seguridad-produccion/`, que necesitan dominio real y
  dispositivo.

## Verificación automática

- [ ] `INFORME.md` existe con las seis secciones.
- [ ] La sección 4 (checklist manual) **no está vacía**. Es el entregable de esta tarea.
- [ ] Cada cifra de la sección 2 tiene su comando.
- [ ] Las tareas revertidas coinciden con las marcadas ❌ o ⏭ en `ESTADO.md`.
- [ ] `npx expo export` en verde.
- [ ] `git status --short` sin cambios propios sin commitear.
- [ ] `CLAUDE.md` sigue siendo cierto. Si se creó `src/constants/`, la descripción de la
      estructura tiene que reflejarlo.

## Criterio de finalización

Los siete checks en verde.

```
refactor(06): informe de cierre del refactor de la app
```
