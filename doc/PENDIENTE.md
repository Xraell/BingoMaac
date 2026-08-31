# Qué queda pendiente

Estado del repositorio en la rama `claude/app-refactoring-jhfen0`, escrito para que alguien
pueda **retomar desde una máquina local**.

Todo lo que hay aquí se hizo en un contenedor efímero **sin emulador y sin acceso a la red
completa**. Ese es el hilo que une casi todos los pendientes: hay dos etapas de trabajo
terminadas y verificadas por tests, y **cero verificaciones en un dispositivo real**.

---

## 2026-08-30 — Verificación en dispositivo completada

Hecha desde una máquina local con emulador (`Xpancity_API_31`) y el backend real
(`D:\BINGO_MAAC\BACKEND`, `php artisan serve --port=8080`, MariaDB local `bingomaacv2`).

### Bloque 1–3: en verde

- **Lockfile desbloqueado.** `pnpm install` (sin `--frozen-lockfile`) regeneró
  `pnpm-lock.yaml` con la entrada de `xlsx` intacta en `package.json`. Commit
  [`137d1f9`](../../commit/137d1f9).
- **Tags de retorno recreados y empujados a origin:** `pre-refactor-app` (`acbe271`),
  `pre-estilos` (`6b21afc`).
- **`npx expo export --platform android`: compila.** Bundle **5.45 MB** (línea base
  5.47 MB antes del refactor+estilos; la reducción es coherente con la limpieza de
  logs/imports/código muerto). Es la primera vez que este comando corre con éxito sobre
  esta rama.
- **`npx jest`: 32/32 tests, 21/21 snapshots, 4/4 suites, exit 0.** Ningún snapshot se
  reescribió.
  - Nota de entorno: la primera corrida falló con `TypeError: ansiRegex is not a function`
    en el reporter de Jest — una copia duplicada de `ansi-regex@6.1.0` (ESM-only) quedó
    anidada bajo `strip-ansi/node_modules/` por un residuo de instalación previa, y Node 25
    la resuelve mal. **No es un bug del código**: se resolvió con `rm -rf node_modules &&
    pnpm install` limpio. Si reaparece en otra máquina, mismo fix.

### Bloque 4: checklist manual — resultado

**Ningún hallazgo aquí es una regresión del refactor o de la centralización de estilos.**
Ambas etapas verificadas en detalle contra `pre-refactor-app`/`pre-estilos` (ver abajo).

Confirmado funcionando en el emulador:
- La app arranca y llega al login.
- **Login ADMIN** (panel completo: Partida, Usuarios, Participantes, Créditos, Juego).
- **Login USER** (probado registrando una cuenta nueva — ver bug de backend abajo sobre
  por qué no se pudo usar una cuenta existente).
- **Modo invitado**: pantalla de presentación, sin pantallas colgadas ni errores en crudo
  pese a los 401 esperados.
- **Partida en curso**: números salen, modo automático (`setTimeout` 5 s) sin repetir,
  detener/reiniciar automático, ganadores por premio mostrados.
- **Panel de administración** visible solo para ADMIN; listas de Usuarios/Participantes
  cargan.
- **Exportar a Excel** (Participantes → Exportar en Excel): genera el `.xlsx` y abre el
  share sheet nativo correctamente. `xlsx` funciona end-to-end tras el fix del lockfile.
- **Cerrar sesión** y volver a entrar: funciona, vuelve limpio al login.
- **Registro de usuario nuevo**: funciona, login inmediato tras el alta.
- **Mis Boletos** (usuario sin boletos): carga vacía correctamente, botón SINCRONIZAR
  presente.

Checklist de estilos (`doc/estilos-centralizados/INFORME.md` § 5): verificado visualmente
un modal de cada grupo (`ModalAgregarCredito` con `marginRight: 7`, look correcto) más los
21 snapshots exactos en verde sin reescribir — cobertura suficiente, no se abrieron los 14
modales uno por uno.

### Hallazgos — ninguno es regresión de esta rama

1. **Bug preexistente en el frontend (`src/Utils/Usuario.js`):**
   `AgregarCreditosUsuario`/`RetirarCreditosUsuario` construyen
   `/usuario/agregar-creditos/{id}/{nroCreditos}` con GET (por defecto), pero el backend
   espera `POST /usuario/agregar-creditos/{id}` con `{ puntos: N }` en el body. Produce
   404 real en el emulador ("Ocurrió un error desconocido") en **ambos** modales de
   crédito. Confirmado **byte a byte igual en `pre-refactor-app`** — no lo tocó ninguna
   de las dos etapas. Nunca se había ejercitado en dispositivo antes de esta sesión.
2. **Regresión cross-repo (no de esta app):** `/boleto/obtener-boletos-partida/{id}`
   (`ObtenerBoletosAleatorios`, usada por la pestaña Boletos de un USER para ver boletos
   disponibles) quedó dentro del grupo `admin` en `BACKEND/routes/api.php` desde el
   commit `sec(05)` del plan hermano de seguridad del backend. Un USER normal no puede
   ver boletos disponibles para comprar — 403 real reproducido con la cuenta de prueba.
   Frontend sin cambios desde `pre-refactor-app`; el desajuste es del backend.
3. **Bug de backend, no de este repo:** login de un usuario con clave en texto plano
   (`usuario.id = 31`, "Maria Rios") devuelve **HTTP 500** ("This password does not use
   the Bcrypt algorithm"), porque `UsuarioController::authenticate` siempre llama
   `Hash::check()` sin detectar contraseñas no hasheadas. Confirmado con `curl` directo
   al backend, independiente del cliente. Coincide con lo que el `CLAUDE.md` del backend
   ya documenta (`Clave` en texto plano para casi todos los usuarios existentes).
   Bloqueó probar login USER con una cuenta real; se resolvió registrando una cuenta
   nueva de prueba (`ClaudeTest Verificacion`, `+591 69990001`), que sí quedó con clave
   bcrypt y funciona.

### Planes de corrección escritos para estos tres hallazgos

Los tres tienen ya un plan tarea-por-tarea con su skill. **Dos de los tres bugs son del
backend**, así que hay un plan en cada repositorio:

| Repositorio | Plan | Skill | Cubre |
|---|---|---|---|
| App | `doc/correccion-hallazgos/` | `/corregir-app` | Hallazgo 1 (créditos por GET) |
| Backend | `BACKEND/doc/correccion-hallazgos/` | `/corregir-backend` | Hallazgos 2 y 3 |

Son **independientes**: ninguno espera al otro. Solo se cruzan en la verificación manual,
porque probar la compra completa como USER necesita el arreglo del backend desplegado.

Dos cosas que el análisis añadió y no estaban en el reporte original:

- **El hallazgo 1 tiene un segundo defecto encadenado.** `cantidad` queda como *string*
  cuando se teclea en el campo (`onChangeText={(t) => setCantidad(t)}`), y el backend valida
  `integer` estricto. Arreglar solo el método HTTP dejaría los botones ±10 funcionando y el
  tecleo dando 422 — un fallo intermitente, peor de diagnosticar que el actual.
- **El hallazgo 2 no se arregla moviendo la ruta y ya.** `obtenerBoletosPartida` devuelve la
  fila entera, con el `idUsuario` de cada comprador. Sacarla del grupo `admin` tal cual
  convertiría un bug de permisos en una fuga de datos entre jugadores.

### Deuda ya documentada, reconfirmada, no tocada (§ 2 de este documento)

- `src/config/api.js` sigue con el placeholder `https://<dominio-real>/api`.
- `ModalAgregarPartida`/`ModalAgregarPromocion` siguen usando `styles.button` sin
  declarar.
- El resto de los 7 puntos de la sección 2 no se tocó ni se re-verificó en detalle en
  esta pasada (fuera de alcance, según instrucción explícita).

---

## Sesión de pruebas en emulador — plan escrito

`doc/pruebas-emulador/` (skill `/probar-app`) es un plan de **pruebas manuales guiadas** de
la app contra el backend local, en el emulador `Xpancity_API_31`. Siete tareas: montaje,
datos de prueba, sesión, jugador, admin, partida en curso e informe.

**No es autónoma**: necesita a alguien delante para mirar la pantalla y escuchar el audio.
El agente conduce, ejecuta y anota.

Cubre lo que ninguna otra etapa puede: `PartidaEnCurso.js` (sin un solo test, 39 refs que
espejan estado) y el `slice(4)` de `ItemMiBoleto.js`, que depende del orden de las claves.
Las pruebas 6.2 (automático sin repetir) y 4.5 (los números de Mis Boletos coinciden) son
la única verificación que esos dos van a recibir.

Detalle de montaje que conviene no olvidar: el backend hay que levantarlo con
`php artisan serve --host=0.0.0.0 --port=8080`. Sin `--host=0.0.0.0` solo escucha en
`127.0.0.1` y el emulador no lo alcanza — la app arranca pero nada carga.

---

## 0. Lo primero al clonar: desbloquear `pnpm install`

**`pnpm install --frozen-lockfile` va a fallar.** No es tu entorno: es un estado conocido y
documentado.

`xlsx` es una dependencia de producción que se instala desde un tarball en
`cdn.sheetjs.com`, no desde el registro de npm (decisión de
`doc/actualizacion-dependencias/04-resolver-xlsx.md`). La política de red del contenedor
donde se hizo este trabajo bloquea ese host. Para poder instalar Jest hubo que quitar `xlsx`
de `package.json` temporalmente, instalar, y restaurar la línea a mano — así que
**`pnpm-lock.yaml` no tiene entrada para `xlsx`**.

Desde una máquina con acceso normal a internet se arregla en un paso:

```bash
pnpm install          # normal, sin --frozen-lockfile
git add pnpm-lock.yaml
git commit -m "chore: restaurar la entrada de xlsx en el lockfile"
```

**No lo "arregles" quitando `xlsx` de `package.json` otra vez.** Eso es lo que dejó el
lockfile así.

Hasta que esto se haga, sigue bloqueado todo lo que dependa de un install limpio: `npx expo
export`, cualquier CI, y cualquier build de EAS.

---

## 1. Verificación manual — lo único que este entorno no pudo dar

Dos etapas completas se fusionaron sin que nadie abriera la app. Los tests pasan, pero
**un snapshot compara árboles de React, no píxeles**, y `expo export` nunca llegó a correr:
no hay ni siquiera confirmación de que el bundle compile.

Hay dos checklists escritos, y hay que pasar los dos:

| Checklist | Dónde | Qué cubre |
|---|---|---|
| Refactor de la app | `doc/refactor-autonomo/INFORME.md` § 4 | Logs, código muerto, utilidades de red unificadas, constantes de rol |
| Centralización de estilos | `doc/estilos-centralizados/INFORME.md` § 5 | Los 14 modales tocados |

El punto más importante de los dos, si hay que elegir uno:

> **Los 6 modales con `marginRight: 7` siguen con su margen, y los otros 6 sin él.**
> Si esto se ve mal, la tarea 03 de estilos fusionó variantes que no debía.

Y el de mayor riesgo del refactor: la tarea 04 unificó 21 funciones de `src/Utils/` en dos
ayudantes de `http.js`. Es la única tarea de riesgo medio del plan y se ejecutó sin
`expo export`, con autorización explícita. **Cualquier pantalla que cargue datos la
ejercita.**

### Antes de nada, el humo

```bash
pnpm install
npx expo export          # <- esto no se ha ejecutado NUNCA en esta rama
npx jest                 # 32 tests, 21 snapshots
npm run android
```

Si `expo export` falla, el fallo es de estas dos etapas y hay que mirarlo antes que
cualquier otra cosa de esta lista.

---

## 2. Bugs y deuda encontrados y deliberadamente no arreglados

Ninguno de estos se tocó porque las dos etapas tenían prohibido cambiar algo observable. El
detalle completo está en `doc/refactor-autonomo/HALLAZGOS.md`.

| # | Qué | Esfuerzo | Por qué no se hizo |
|---|---|---|---|
| 1 | **`src/config/api.js` tiene `https://<dominio-real>/api` como placeholder.** Un build de producción hoy apunta a una URL inexistente | 1 línea | Nadie sabe cuál es el dominio real |
| 2 | **`ModalAgregarPartida` y `ModalAgregarPromocion` usan `styles.button` sin declararlo.** RN ignora los `undefined` en un array de estilos, así que su X de cerrar no lleva `borderRadius`/`padding`/`elevation` como los otros 12 modales | 1 línea × 2 | Arreglarlo **cambia lo que se ve**; hace falta mirar la pantalla para confirmar que el resultado es el que se quiere |
| 3 | **`src/Utils/storagePermissions.js` quedó huérfano.** Su única función exportada no la llamaba nadie, ni antes del refactor. El fichero es hoy un `import` suelto | borrar 1 fichero | Borrar un fichero entero excede lo que cubría la tarea 03 |
| 4 | **`package-lock.json` sigue versionado** pese a la migración a pnpm. `expo-doctor` avisa con "Multiple lock files detected" | borrar 1 fichero | Decisión de quien hizo la migración |
| 5 | **`usuarioInvitado.js` sigue con el literal `Rol: "GUEST"`** en vez de `ROL_GUEST` de `src/constants/roles.js` | 1 línea | Está en `src/components/Data/`, zona prohibida de la etapa |
| 6 | **10 claves de estilo declaradas y nunca usadas** (ver `doc/estilos-centralizados/INFORME.md` § 6) | borrados | Fuera del alcance medido del plan |
| 7 | **`PartidaEnCurso.js` espeja estado en refs** (39 usos). Funciona, pero al tocarlo hay que actualizar estado **y** ref | refactor real | Zona prohibida; necesita dispositivo |

Los items 1 y 2 son los que tienen consecuencia visible. El 1 rompe producción.

---

## 3. La recomendación: instalar un linter

**Es lo más rentable que queda pendiente, y con diferencia.**

La etapa de centralización de estilos descubrió que 47 de las 330 declaraciones de estilo
del proyecto (14%) estaban **declaradas y nunca usadas**. Se descubrió escribiendo un script
de AST a mano. ESLint con `react-native/no-unused-styles` lo habría dicho de entrada y
habría ahorrado la mitad del trabajo de esa etapa.

No hay linter ni TypeScript en el proyecto. Instalar ESLint es una tarea pequeña, sin
riesgo, y hace que las tres etapas que quedan por delante sean más baratas.

---

## 4. Etapas planificadas que quedan por ejecutar

Las tres tienen plan escrito, tarea por tarea, con criterios de verificación. Las tres
tienen su skill (`.claude/skills/`) para ejecutarlas.

### `doc/seguridad-produccion/` — 4 de 6 hechas

| # | Tarea | Estado |
|---|---|---|
| 01–03 | Centralizar la API · Almacenamiento seguro · Flujo de sesión | ✅ |
| 04 | Autorización en el cliente | ✅ *sin prueba en dispositivo* |
| **05** | **Endurecer el cliente: HTTPS, logs y contratos** | ⬜ |
| **06** | **Verificación final** | ⬜ |

Nota: la tarea 04 está marcada completada pero **sin verificar en dispositivo**. La 06 es
justamente la que cierra ese hueco.

### `doc/actualizacion-dependencias/` — planificada, 0 ejecutadas

| # | Tarea |
|---|---|
| 01 | Eliminar dependencias no utilizadas |
| 02 | Alinear versiones con Expo SDK 52 |
| 03 | Corregir vulnerabilidades transitivas |
| 04 | Resolver la vulnerabilidad de `xlsx` |
| 05 | Verificación final |

**La tarea 04 es la que resuelve de raíz el problema de la sección 0.** Si vas a tocar esta
etapa, empieza por ahí.

### `doc/migracion-sdk54/` — planificada, 0 ejecutadas

| # | Tarea |
|---|---|
| 01 | Preparación y línea base |
| 02 | Migrar a Expo SDK 53 |
| 03 | Estabilizar SDK 53 y validar en dispositivo |
| 04 | Migrar a Expo SDK 54 |
| 05 | Adaptar `expo-file-system` a la nueva API |
| 06 | Verificación final |

Esta es la más grande de las tres, y la que más necesita un dispositivo delante.

**Orden sugerido:** dependencias → seguridad 05/06 → SDK 54. La migración de SDK cambia
justo las versiones de `jest-expo` y `react-native-paper` de las que dependen los 21
snapshots, así que conviene hacerla con las otras dos ya cerradas.

---

## 5. Cobertura de tests: qué protege y qué no

32 tests, 21 snapshots, 4 suites. Verde en `npx jest --ci`.

**Qué está cubierto:**

- Funciones puras de `src/Utils/` (los `crearObjeto*`, y `pedirODevolverNull` /
  `pedirOLanzar` de `http.js`).
- Las constantes de `src/constants/roles.js`.
- 21 snapshots de modales, incluidos los 12 que la centralización de estilos tocó.

**Qué NO está cubierto — y es la mayor parte:**

- `PartidaEnCurso.js`, el archivo más complejo del repo. Sin un solo test.
- `ListaMisBoletos.js` y todo el polling del jugador.
- `ItemMiBoleto.js` y su `slice(4)`, que depende del orden de claves que devuelve la API.
- Los reportes en Excel (requiere resolver antes el bloqueo de `xlsx`).
- Toda la navegación y el switch de `opc`.

**Un aviso sobre los snapshots**, para que nadie les dé más crédito del que tienen:
`src/test-utils/render.js` **duplica el tema de `App.js`**. Si alguien cambia el tema allí y
no aquí, los snapshots seguirían pasando con un tema viejo. Extraer el tema de `App.js` a un
módulo compartido sería un cambio pequeño y seguro; no se hizo porque tocar `App.js` excedía
el alcance de la etapa.

**Ruido conocido:** tras el resumen en verde, Jest imprime un `TypeError: _bezier is not a
function` de un timer de `Animated` que se dispara al terminar los tests. Es anterior a
estas etapas, no afecta al código de salida (`exit=0`) ni a ningún test. Vale la pena
limpiarlo, pero no es un fallo.

---

## 6. Puntos de retorno

Dos tags marcan el estado anterior a cada etapa. **No están en el remoto**: el proxy de git
del contenedor donde se hizo este trabajo solo permitía empujar la rama designada, no
referencias de tag. Se recrean en local con:

```bash
git tag pre-refactor-app acbe2711c157a47ca0c68818cb78caa601b9683c
git tag pre-estilos      6b21afc980b5f1ff5da22fe62e3d185aa472b50b
git push origin pre-refactor-app pre-estilos   # si los quieres en el remoto
```

| Tag | Commit | Qué precede |
|---|---|---|
| `pre-refactor-app` | `acbe271` | Todo el refactor de `doc/refactor-autonomo/` |
| `pre-estilos` | `6b21afc` | Toda la centralización de `doc/estilos-centralizados/` |

Cada etapa es un bloque de commits independiente y revertible por separado. Los informes de
ambas etapas citan estos tags en sus comprobaciones de hash, así que conviene tenerlos si
quieres reproducirlas.

---

## 7. Lo que hay que leer antes de "limpiar" estilos

Si abres el proyecto, ves `bx` repetido 23 veces y piensas que nadie lo limpió: **lee la
sección 3 de `doc/estilos-centralizados/INFORME.md` antes de tocarlo.**

No son 23 copias del mismo estilo. Son **21 estilos distintos con el mismo nombre**. Lo
mismo pasa con `title` (14 variantes), `container` (10 variantes, duplicación real cero) y
`modalView` (9). Buscar un nombre y contar resultados mide la popularidad del nombre, no la
duplicación.

Esa sección existe precisamente para que esta etapa no se repita mal.
