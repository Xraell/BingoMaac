# 06 — La partida en curso

**Depende de:** [05](05-flujo-admin.md)

## Objetivo

Probar el juego: cantar números, el modo automático, el audio y los ganadores.

## Por qué esta tarea es la más importante

`PartidaEnCurso.js` es **el fichero más complejo del proyecto y no tiene un solo test**.
Usa 39 referencias que espejan el estado para que los `setTimeout` del modo automático lean
valores frescos. Todas las etapas anteriores lo declararon **zona prohibida** justamente
porque no había forma de verificarlo.

Esta tarea es la única verificación que ese fichero va a recibir.

Además, `ItemNro.js` dispara el audio con `index === 0`. Si esa condición deja de
cumplirse, **simplemente no suena**: sin error, sin aviso. Solo se detecta escuchando.

## Preparación

Usar la partida creada en la tarea 02, no la `id=86` (tiene ya 45 números cantados).
Confirmar que es la que abre la app:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$p = \App\Models\Partida::orderBy('NroPartida','desc')->first();
echo 'id='.\$p->id.' Nro='.\$p->NroPartida.' Numeros='.\App\Models\Numero::where('idPartida',\$p->id)->count().PHP_EOL;"
```

Debe ser la nueva, con **0 números**. Y **subir el volumen del emulador** antes de empezar.

## Pruebas

Pantalla **Juego** del panel de ADMIN.

### 6.1 — Cantar un número a mano

- [ ] Sale un número entre **1 y 90** y aparece en pantalla.
- [ ] **Suena el audio.**
- [ ] En el backend: `POST /api/numero/crear` con **200**.

### 6.2 — Modo automático

Activarlo y dejarlo correr **al menos 10 números** (unos 50 s, a 5 s por número).

- [ ] Sale un número nuevo cada ~5 segundos.
- [ ] **Ninguno se repite.** Es la prueba clave del espejado en refs: si el `setTimeout`
      leyera estado obsoleto, saldrían repetidos.
- [ ] El audio suena en cada uno.

### 6.3 — Detener y reanudar

- [ ] Al detener, **deja de salir números** (esperar 15 s para confirmarlo: si sigue
      saliendo alguno, quedó un `setTimeout` huérfano).
- [ ] Al reanudar, continúa **sin repetir** ninguno anterior.

### 6.4 — Los números persisten

Con varios números cantados, salir de la pantalla y volver.

- [ ] Siguen apareciendo todos los cantados, sin perderse.

### 6.5 — El jugador ve la partida

Con la sesión de USER (otro dispositivo, o cerrando y abriendo sesión):

- [ ] El jugador ve los números cantados de la partida en curso.
- [ ] Se actualizan al salir números nuevos.

### 6.6 — Ganadores

Requiere que algún cartón complete un premio: **Terno**, **Cuarta**, **Línea** o
**Cartón lleno**. Con un solo boleto comprado puede tardar mucho.

- [ ] Al completarse un premio, el ganador aparece en la pantalla correspondiente.
- [ ] En el backend: `GET /api/boleto/obtener-ganadores-fila/{id}` con **200**.

**Si no se alcanza ningún premio en un tiempo razonable, marcar ⏭.** No fuerces la base de
datos para provocarlo: un ganador inyectado a mano no prueba la lógica de detección, que es
justo lo que se querría probar.

### 6.7 — Cerrar la partida

Si la interfaz lo permite:

- [ ] La partida se marca terminada (el backend inserta un número `-1` como marca).
- [ ] La app refleja que terminó.

## Verificación

- [ ] Las siete pruebas anotadas con ✅/❌/⏭.
- [ ] En 6.2, anotada **la lista de números que salieron**, para poder comprobar que no hay
      repetidos.
- [ ] Anotado explícitamente si **el audio sonó o no**.

## Criterio de finalización

Las siete anotadas. Los repetidos de 6.2 y el audio son los dos resultados que ninguna otra
etapa puede obtener: si solo apuntas dos cosas de esta sesión, que sean ésas.
