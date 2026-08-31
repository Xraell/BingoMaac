# Técnicas: manejar la app sin mirar

Referencia común de las tareas 03 a 06. Aquí está el "cómo"; en cada tarea, el "qué".

## El principio

> **La interfaz sirve para operar la app. La base de datos y el log, para juzgar el resultado.**

Una compra no se da por buena porque la pantalla diga "éxito", sino porque hay una fila
nueva en `compras` y el saldo bajó exactamente 30. Ésa es la razón de que esta etapa pueda
correr sola.

Cuando la interfaz y la base de datos discrepen, **manda la base de datos** — y esa
discrepancia es en sí misma un hallazgo grave que hay que anotar.

## Leer la pantalla

```bash
adb shell uiautomator dump /sdcard/ui.xml && adb shell cat /sdcard/ui.xml
```

Devuelve XML con el texto visible y las coordenadas (`bounds`) de cada elemento. Sirve para
dos cosas: confirmar en qué pantalla estás y averiguar dónde pulsar.

**Limitación importante:** React Native no siempre expone texto accesible. Puede haber
elementos sin `text` ni `content-desc`, sobre todo iconos y botones personalizados. Si un
volcado sale pobre, **no concluyas que la pantalla está vacía**: usa una captura, o
apóyate en el log del backend para saber qué está pasando.

Si el volcado falla porque la vista está animándose, reintenta: es un fallo transitorio, no
un bug de la app.

## Pulsar y escribir

```bash
adb shell input tap <x> <y>
adb shell input text "texto"
adb shell input keyevent KEYCODE_ENTER
adb shell input swipe <x1> <y1> <x2> <y2> 300
```

Las coordenadas salen del `bounds` del volcado: `[x1,y1][x2,y2]` → pulsa el centro,
`((x1+x2)/2, (y1+y2)/2)`.

Cuidados:

- **`input text` no escribe espacios ni acentos con fiabilidad.** Para un teléfono como
  `+591 69990002`, escribe por partes o evita el espacio en los datos de prueba.
- Tras pulsar, **espera y vuelve a volcar** antes de la siguiente acción. La app tiene
  transiciones y peticiones de red por medio.
- Si un `tap` no hace nada, vuelve a volcar: la pantalla pudo cambiar y las coordenadas
  viejas ya no valen.

## Captura de pantalla

```bash
adb exec-out screencap -p > <scratchpad>/NN-descripcion.png
```

Para adjuntar como prueba, sobre todo en los fallos. **No decidas si algo pasa mirando una
captura**: decídelo con la base de datos y el log.

## Ver qué peticiones llegaron

Dos fuentes:

- **La salida de `php artisan serve`** (en segundo plano desde la tarea 01): una línea por
  petición con su código de estado. Es lo más directo.
- **El log de Laravel**, con detalle de errores:

```bash
tail -40 D:/BINGO_MAAC/BACKEND/storage/logs/laravel.log
```

Truco útil: antes de una prueba, anota cuántas líneas tiene el log; después, lee solo las
nuevas. Así no te pierdes entre las 1.9 MB que ya tiene.

```bash
wc -l < D:/BINGO_MAAC/BACKEND/storage/logs/laravel.log
```

## Comprobar contra la base de datos

La fuente de verdad. Patrón general:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="<consulta>"
```

**Mide antes y después de cada acción con consecuencia.** No basta con mirar el estado
final: lo que se está probando es el *delta*.

Ejemplos que usarás:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$u = \App\Models\Usuario::where('Telefono','<tel>')->first();
echo 'Creditos: '.\$u->Creditos.' Compras: '.\App\Models\Compra::count().PHP_EOL;"
```

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$p = \App\Models\Partida::orderBy('NroPartida','desc')->first();
echo 'Partida '.\$p->id.' numeros: '.\App\Models\Numero::where('idPartida',\$p->id)->count().PHP_EOL;"
```

## Reiniciar la app

Para las pruebas de sesión (3.1, 3.4, 3.6):

```bash
adb shell am force-stop host.exp.exponent
```

Confirma el paquete real antes de fiarte del nombre:

```bash
adb shell pm list packages | grep -i "exp\|bingo"
```

En un proyecto Expo con `expo start` es normalmente **Expo Go** (`host.exp.exponent`), no un
paquete propio de la app. Relanzar: desde Expo Go, o pulsando `a` en la terminal de Metro.

## Cuando algo no se puede automatizar

Si tras dos intentos razonables no consigues operar una pantalla por `adb`:

1. Toma una captura.
2. Márcala **⏭ no se pudo automatizar**, con lo que intentaste.
3. **Sigue con la siguiente prueba.**

Un ⏭ honesto vale más que un ✅ inventado. No des por buena ninguna prueba que no hayas
verificado contra la base de datos o el log.
