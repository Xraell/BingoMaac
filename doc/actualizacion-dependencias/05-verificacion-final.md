# Tarea 05 — Verificación final y cierre de etapa

**Riesgo:** — · **Depende de:** [04](04-resolver-xlsx.md) · **Commit:** `docs: cerrar etapa 1 de actualizacion`

## Objetivo

Comprobar que las cuatro tareas anteriores dejaron el proyecto **funcional y mejor que al
inicio**, y registrar el estado final como línea base de la Etapa 2.

Aquí **no se actualiza nada**. Si aparece un problema, se corrige en la tarea que lo
originó, no en esta.

## Verificación automática

```bash
npx expo-doctor
npm audit --registry=https://registry.npmjs.org/
npx expo install --check
```

### Comparación contra la línea base (29/08/2026)

| Métrica | Antes | Meta |
|---|---|---|
| `expo-doctor` | 15/18 | 17/18 |
| Vulnerabilidades totales | 39 | menor |
| Críticas | 3 | menor o igual |
| Altas | 19 | menor |
| `xlsx` vulnerable | sí | no |
| Dependencias basura | 2 | 0 |
| Versiones desalineadas del SDK | 9 | 0 |

El check que **seguirá fallando** es *"Validate packages against React Native Directory"*
(`expo-av` sin mantenimiento, paquetes sin metadata). Es correcto: se resuelve en la Etapa 2.

## Verificación manual

**Esta es la única prueba manual de toda la etapa.** Las tareas 01–04 se verifican solas
compilando el bundle (`expo export`), pero eso no detecta regresiones funcionales: que el
audio no suene o que el Excel salga corrupto solo se ve ejecutando la app.

Arrancar con caché limpia:

```bash
npx expo start --clear
```

### Checklist

**Autenticación**
- [ ] Login como **ADMIN** → entra a TabsAdmin.
- [ ] Login como **USER** → entra a TabsUser.
- [ ] **INGRESAR COMO INVITADO** → entra como GUEST y ve el mensaje de registro.
- [ ] Cerrar y reabrir la app: la sesión persiste (AsyncStorage).

**Partida en vivo — admin** *(lo más frágil del proyecto)*
- [ ] Iniciar partida desde la pestaña Juego.
- [ ] Suena la locución de bienvenida.
- [ ] Cantar un número manual: aparece en la lista y **suena su audio**.
- [ ] Activar modo automático: sale un número nuevo cada ~5 s, sin repetirse.
- [ ] Detener el modo automático.

**Sincronización — jugador**
- [ ] Comprar/tener ≥2 boletos y pulsar **SINCRONIZAR**.
- [ ] Los números cantados aparecen y el cartón se va tachando.
- [ ] La tabla de 90 números marca los extraídos.
- [ ] El pinch-zoom de la tabla responde.

**Reportes** *(crítico tras la tarea 04)*
- [ ] **EXPORTAR EN EXCEL NUEVO** genera el archivo y abre el diálogo de compartir.
- [ ] El `.xlsx` abre bien y trae la grilla de boletos y el resumen.
- [ ] El botón de exportación anterior también funciona.

**Cierre de partida**
- [ ] Finalizar partida (centinela `-1`).
- [ ] El jugador sincronizado ve el modal de mensaje final.

## Diagnóstico si algo falla

Como la validación funcional se concentra aquí, un fallo llega con varios commits encima.
Esta tabla dice a qué tarea apuntar primero:

| Síntoma | Tarea sospechosa | Por qué |
|---|---|---|
| No suena el audio del bingo | [02](02-alinear-versiones-sdk52.md) | Cambió `expo-av` |
| El Excel sale corrupto, vacío o mal formado | [04](04-resolver-xlsx.md) | Cambió `xlsx` de 0.18 a 0.20 |
| No se abre el diálogo de compartir | [02](02-alinear-versiones-sdk52.md) | Cambiaron `expo-file-system` y `expo-sharing` |
| La app no arranca / pantalla en blanco | [03](03-corregir-vulnerabilidades-transitivas.md) | `audit fix` reescribe el lockfile |
| La sesión no persiste al reabrir | [03](03-corregir-vulnerabilidades-transitivas.md) | Posible cambio transitivo de AsyncStorage |
| Falla el build de EAS | [04](04-resolver-xlsx.md) | El tarball del CDN de SheetJS puede no resolverse en CI |

Revertir es directo, porque cada tarea es un commit aislado:

```bash
git revert <hash>
```

Tras revertir, reinstalar y volver a probar:

```bash
rm -rf node_modules && npm install && npx expo start --clear
```

## Cierre

Con el checklist en verde, registrar el resultado al final de este archivo:

```markdown
## Resultado — <fecha>

- expo-doctor: <n>/18
- Vulnerabilidades: <total> (<críticas> críticas, <altas> altas)
- Commits de la etapa: <hashes>
- Pendiente para Etapa 2: <lista>
```

## Criterio de aceptación

- Todo el checklist manual en verde.
- Métricas iguales o mejores que la meta.
- Cinco commits en el historial, uno por tarea.

## Pendientes conocidos para la Etapa 2

1. `expo-av` → `expo-audio` (5 archivos, motor de audio del juego).
2. `@react-navigation/material-bottom-tabs` → `react-native-paper` (ya sin soporte).
3. Unificar `react-native-vector-icons` en `@expo/vector-icons` (solo 2 archivos lo usan).
4. Salto de SDK 52 → 57 (React 19 + New Architecture).
5. URL base de la API duplicada en los 8 módulos de `src/Utils/`.
6. Revisar el `return true` temprano de `arraysAreEqual` en `PartidaEnCurso.js:110`.
