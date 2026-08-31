# 01 — Levantar backend, emulador y app

**Depende de:** nada

## Objetivo

Dejar las tres piezas en marcha **sin intervención**: MariaDB, el backend en `:8080` y la
app corriendo en `Xpancity_API_31`. Y anotar qué versión del código se está probando.

## Por qué esta tarea va aparte

Casi todo lo que sale mal en una sesión de pruebas sale mal aquí, y se confunde con un bug
de la app. Un "no carga nada" puede ser el emulador sin red, el backend caído o XAMPP sin
arrancar. Separarlo evita anotar como bug lo que es un problema de montaje.

## Pasos

### 1. Qué código se está probando

```bash
git -C D:/BINGO_MAAC/APP log --oneline -1 && git -C D:/BINGO_MAAC/APP status --short
```

```bash
git -C D:/BINGO_MAAC/BACKEND log --oneline -1 && git -C D:/BINGO_MAAC/BACKEND status --short
```

**Si algún árbol está sucio, anotarlo**: estarías probando algo que no está en ningún
commit, y los resultados no serían reproducibles.

### 2. ¿Siguen vivos los tres bugs conocidos?

Determina qué se espera en las tareas 04 y 05. Por código, sin levantar nada:

```bash
grep -n "agregar-creditos" D:/BINGO_MAAC/APP/src/Utils/Usuario.js; grep -n "obtener-boletos-partida" D:/BINGO_MAAC/BACKEND/routes/api.php; grep -n "Hash::check" D:/BINGO_MAAC/BACKEND/app/Http/Controllers/UsuarioController.php
```

Al 2026-08-30 los tres planes de corrección **ya se ejecutaron** y los tres bugs están
arreglados (verificado en código y con `curl`). Esta comprobación sirve para confirmar que
siguen así, no para descubrirlos:

| Si ves… | Entonces |
|---|---|
| La cantidad concatenada en la ruta (`+ "/" + nroCreditos`) | El arreglo del bug 1 se revirtió |
| `obtener-boletos-partida` dentro del grupo `admin` | El arreglo del bug 2 se revirtió |
| `Hash::check` sin comprobar antes el formato | El arreglo del bug 3 se revirtió |

Anotar los tres en `RESULTADOS.md`.

**Comprobar además la regresión conocida**, que sí sigue abierta:

```bash
grep -n "idUsuario != null" D:/BINGO_MAAC/APP/src/components/Items/ItemBoleto.js
```

**No debe encontrar nada.** Si apareciera, el arreglo se revirtió y la tarea 04 fallará en
4.3. Lo correcto hoy es `disabled={!!boleto.idUsuario}`.

### 3. MariaDB

Arrancar MySQL de XAMPP si no está. Comprobar que el backend la ve:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="echo \App\Models\Usuario::count();"
```

Debe imprimir un número (al redactar el plan: **20**). Error de conexión = XAMPP, no código.

Si XAMPP no está arrancado y no puedes arrancarlo por consola, es de las pocas cosas que
puede requerir a la persona. Anótalo y detente: sin base de datos no hay sesión.

### 4. El backend, alcanzable desde el emulador

El emulador es una máquina virtual: su `localhost` es él mismo. Llega al host por
**`10.0.2.2`**. Para eso el backend debe escuchar en todas las interfaces:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan serve --host=0.0.0.0 --port=8080
```

**`--host=0.0.0.0` no es opcional.** Sin él escucha solo en `127.0.0.1` y el emulador recibe
"connection refused" en todo — la app arranca pero nada carga. Es el fallo más común de este
montaje.

**Lánzalo en segundo plano** (`run_in_background`) y no lo mates hasta la tarea 07: su
salida es el registro de peticiones que usarás para juzgar casi todas las pruebas.

Verificar:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/api/premio
```

Un **401** es la respuesta correcta y deseada: el servidor responde y `auth:sanctum`
funciona. Un `000` o "connection refused" es que no arrancó.

### 5. La app ya apunta bien: no tocar `api.js`

```js
const DESARROLLO = "http://10.0.2.2:8080/api";
export const API_BASE = __DEV__ ? (Constants.expoConfig?.extra?.apiUrl ?? DESARROLLO) : PRODUCCION;
```

En desarrollo ya usa `10.0.2.2:8080`. **No modifiques nada.** El placeholder
`https://<dominio-real>/api` solo afecta a builds de producción, que esta etapa no prueba;
rellenarlo no cambia nada aquí y ensucia el árbol.

### 6. Arrancar el emulador

```bash
"$LOCALAPPDATA/Android/Sdk/emulator/emulator.exe" -avd Xpancity_API_31 -no-snapshot-load
```

En segundo plano. Esperar a que arranque **comprobando, no durmiendo a ciegas**:

```bash
adb wait-for-device && adb shell getprop sys.boot_completed
```

Repetir hasta que devuelva `1`. Tarda entre 30 s y 2 min. Después:

```bash
adb devices
```

Debe listar uno como `device`. Si sale `offline`, esperar más; si persiste, reiniciarlo.

Subir el volumen, para que el audio de la tarea 06 se pueda oír de pasada:

```bash
adb shell input keyevent KEYCODE_VOLUME_UP && adb shell input keyevent KEYCODE_VOLUME_UP && adb shell input keyevent KEYCODE_VOLUME_UP
```

### 7. Instalar dependencias y arrancar la app

```bash
cd D:/BINGO_MAAC/APP && pnpm install
```

```bash
cd D:/BINGO_MAAC/APP && npx expo start --android
```

En segundo plano; Metro tiene que seguir vivo toda la sesión.

Notas de entorno conocidas:

- **pnpm**, nunca `npm install`. Si `--frozen-lockfile` falla por `xlsx`, usar `pnpm install`
  a secas.
- La primera carga del bundle tarda. No confundir lento con colgado: comprueba con
  `uiautomator dump` en vez de asumir.

### 8. Confirmar que la app llegó al login

Ésta es la comprobación que decide si la sesión puede seguir:

```bash
adb shell uiautomator dump /sdcard/ui.xml && adb shell cat /sdcard/ui.xml
```

Buscar en el volcado el texto de la pantalla de login. Si aparece, la app arrancó y el
bundle cargó.

Si el volcado sale vacío o sin texto reconocible, tomar una captura antes de concluir:

```bash
adb exec-out screencap -p > <scratchpad>/01-arranque.png
```

## Verificación

- [ ] Los dos `git log` anotados, con el estado limpio/sucio de cada árbol.
- [ ] El estado de los tres bugs conocidos, anotado.
- [ ] `php artisan tinker` cuenta usuarios: la base responde.
- [ ] `php artisan serve --host=0.0.0.0 --port=8080` corriendo en segundo plano, `curl` = **401**.
- [ ] `adb devices` lista el emulador como `device`.
- [ ] El volcado de UI muestra la **pantalla de login**.

## Criterio de finalización

Los seis checks. **Si la app no llega al login, detén la sesión aquí** y diagnostica: todas
las tareas siguientes fallarían por la misma causa y el informe no valdría nada.

Esta tarea no genera commit.
