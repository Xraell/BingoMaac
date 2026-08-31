# 01 — Levantar backend, emulador y app

**Depende de:** nada

## Objetivo

Tener las tres piezas hablando entre sí: MariaDB, el backend en `:8080` y la app corriendo
en el emulador. Y dejar anotado **qué versión del código se está probando**.

## Por qué esta tarea existe por separado

Casi todo lo que sale mal en una sesión de pruebas sale mal aquí, y se confunde con un bug
de la app. Un "no carga nada" puede ser el emulador sin red, el backend caído, XAMPP sin
arrancar o el token caducado. Separarlo evita anotar como bug lo que es un problema de
montaje.

## Pasos

### 1. Qué código se está probando

Antes de nada, dejar constancia:

```bash
git -C D:/BINGO_MAAC/APP log --oneline -1
git -C D:/BINGO_MAAC/BACKEND log --oneline -1
git -C D:/BINGO_MAAC/APP status --short
git -C D:/BINGO_MAAC/BACKEND status --short
```

**Si algún árbol está sucio, anotarlo.** Estás probando algo que no está en ningún commit,
y el informe tiene que decirlo o los resultados no serán reproducibles.

### 2. ¿Están arreglados los tres bugs conocidos?

Determina qué se espera en las tareas 04 y 05. Comprobación por código, sin levantar nada:

```bash
grep -n "agregar-creditos" D:/BINGO_MAAC/APP/src/Utils/Usuario.js
grep -n "obtener-boletos-partida" D:/BINGO_MAAC/BACKEND/routes/api.php
grep -n "Hash::check" D:/BINGO_MAAC/BACKEND/app/Http/Controllers/UsuarioController.php
```

| Si ves… | Entonces |
|---|---|
| La cantidad concatenada en la ruta (`+ "/" + nroCreditos`) | **Bug 1 vivo**: los créditos van a fallar |
| `obtener-boletos-partida` dentro del grupo `admin` | **Bug 2 vivo**: el USER no podrá comprar |
| `Hash::check` sin comprobación previa de formato | **Bug 3 vivo**: login de clave plana dará 500 |

Anotar los tres en `RESULTADOS.md`. **Un fallo esperado no es un hallazgo nuevo**, y
mezclarlos hace el informe inútil.

### 3. MariaDB

Arrancar MySQL desde el panel de XAMPP. Comprobar que el backend la ve:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="echo \App\Models\Usuario::count();"
```

Debe imprimir un número (al redactar el plan: **20**). Si da error de conexión, es XAMPP,
no el código.

### 4. El backend, accesible desde el emulador

**Este es el punto donde más se falla.** El emulador de Android es una máquina virtual: su
`localhost` es él mismo, no tu PC. Alcanza al host por la IP especial **`10.0.2.2`**.

Para que eso funcione, el backend tiene que escuchar en **todas** las interfaces, no solo
en el loopback:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan serve --host=0.0.0.0 --port=8080
```

**`--host=0.0.0.0` no es opcional.** Sin él, `php artisan serve` escucha únicamente en
`127.0.0.1` y el emulador recibirá "connection refused" en todas las peticiones — el
síntoma es una app que arranca pero donde nada carga.

Dejarlo corriendo en su propia terminal. Verificar desde el host:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/api/premio
```

Un **401** es la respuesta correcta y deseable: significa que el servidor responde y que
`auth:sanctum` está haciendo su trabajo. Un 000 o "connection refused" es que no arrancó.

### 5. La app ya apunta bien: no tocar `api.js`

```js
const DESARROLLO = "http://10.0.2.2:8080/api";
export const API_BASE = __DEV__ ? (Constants.expoConfig?.extra?.apiUrl ?? DESARROLLO) : PRODUCCION;
```

En desarrollo (`__DEV__`) ya usa `10.0.2.2:8080`, que es exactamente lo que el emulador
necesita. **No hay que modificar nada.**

El placeholder `https://<dominio-real>/api` solo afecta a builds de producción, y esta
etapa no los prueba. **No lo rellenes**: no cambia nada aquí y ensucia el árbol.

### 6. Emulador y app

Arrancar `Xpancity_API_31` desde Android Studio y esperar a que llegue al escritorio.
Luego:

```bash
cd D:/BINGO_MAAC/APP && pnpm install
```

```bash
cd D:/BINGO_MAAC/APP && npx expo start --android
```

Notas de entorno ya conocidas:

- **pnpm**, nunca `npm install`. Si `--frozen-lockfile` falla por `xlsx`, usar `pnpm install`
  a secas.
- Si Metro no encuentra el emulador, comprobar `adb devices`: debe listar uno en estado
  `device`. Si dice `offline`, reiniciar el emulador.
- La primera carga del bundle tarda. No confundir "lento" con "colgado".

## Verificación

- [ ] Los dos `git log` anotados, y el estado limpio o sucio de cada árbol.
- [ ] El estado de los tres bugs conocidos, anotado.
- [ ] `php artisan tinker` cuenta usuarios: la base responde.
- [ ] `php artisan serve --host=0.0.0.0 --port=8080` corriendo, y el `curl` da **401**.
- [ ] `adb devices` lista el emulador como `device`.
- [ ] La app abre en el emulador y **llega a la pantalla de login**.

## Criterio de finalización

Los seis checks. **Si la app no llega al login, detener la sesión entera aquí** y
diagnosticar: sin esto, todas las tareas siguientes fallarán por la misma causa y el informe
no valdrá nada.

Esta tarea no genera commit.
