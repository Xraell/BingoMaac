# 06 — La partida en curso

**Depende de:** [05](05-flujo-admin.md) · **Técnicas:** [TECNICAS-ADB.md](TECNICAS-ADB.md)

## Objetivo

Probar el juego: cantar números, el modo automático y los ganadores.

## Por qué esta tarea es la más importante

`PartidaEnCurso.js` es **el fichero más complejo del proyecto y no tiene un solo test**. Usa
39 referencias que espejan el estado para que los `setTimeout` del modo automático lean
valores frescos. Todas las etapas anteriores lo declararon zona prohibida justamente porque
no había forma de verificarlo.

Ésta es la única verificación que va a recibir.

## El audio: lo único que no se puede automatizar

`adb` no puede escuchar. `ItemNro.js` dispara el audio con `index === 0`; si esa condición
deja de cumplirse, **no suena, sin error ni aviso**.

Cómo se trata, sin bloquear la sesión:

- El volumen ya se subió en la tarea 01.
- **Anotar la hora exacta de cada número cantado** en 6.1 y 6.2. Si estabas cerca, podrás
  confirmar después si sonó.
- Marcar el audio como **⏭ pendiente de confirmación humana**, nunca ✅.

**No des el audio por bueno.** Que la app no dé error no significa que suene.

## Preparación

Usar la partida creada en la tarea 02, no la `id=86` (ya tiene 45 números cantados).
Confirmar cuál abre la app:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$p = \App\Models\Partida::orderBy('NroPartida','desc')->first();
echo 'id='.\$p->id.' Nro='.\$p->NroPartida.' Numeros='.\App\Models\Numero::where('idPartida',\$p->id)->count().PHP_EOL;"
```

Debe ser la nueva, con **0 números**.

## Pruebas

Pantalla **Juego** del panel de ADMIN.

### 6.1 — Cantar un número a mano

- [ ] En el log: `POST /api/numero/crear` con **200**.
- [ ] El número quedó en la base, entre **1 y 90**:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$p = \App\Models\Partida::orderBy('NroPartida','desc')->first();
foreach (\App\Models\Numero::where('idPartida',\$p->id)->get() as \$n) { echo \$n->Nro.' '; }
echo PHP_EOL;"
```

- [ ] El volcado muestra el número en pantalla.
- [ ] ⏭ **Audio**: anotar la hora; pendiente de confirmación humana.

### 6.2 — Modo automático sin repetir

**La prueba más valiosa de toda la sesión.** Activarlo y dejarlo correr **al menos 10
números** (unos 50 s, a 5 s cada uno).

No duermas a ciegas: comprueba en bucle hasta que haya 10 o más números, con un tope de
tiempo por si se ha colgado.

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$p = \App\Models\Partida::orderBy('NroPartida','desc')->first();
\$ns = \App\Models\Numero::where('idPartida',\$p->id)->pluck('Nro')->toArray();
echo 'Total: '.count(\$ns).PHP_EOL;
echo 'Unicos: '.count(array_unique(\$ns)).PHP_EOL;
echo 'Fuera de rango: '.count(array_filter(\$ns, fn(\$n) => \$n < 1 || \$n > 90)).PHP_EOL;
echo implode(',', \$ns).PHP_EOL;"
```

- [ ] Salen números nuevos cada ~5 segundos.
- [ ] **`Total` es igual a `Unicos`**: ninguno repetido. Ésta es la prueba del espejado en
      refs — si el `setTimeout` leyera estado obsoleto, saldrían repetidos.
- [ ] **`Fuera de rango` es 0.**
- [ ] ⏭ **Audio**: pendiente de confirmación humana.

**Anotar la lista completa de números** en `RESULTADOS.md`. Es la evidencia.

### 6.3 — Detener y reanudar

Detener, y **esperar 15 s comprobando** que el total no sube:

- [ ] Tras detener, el número de registros **no cambia** en 15 s. Si sube, quedó un
      `setTimeout` huérfano: hallazgo importante.
- [ ] Al reanudar, siguen saliendo y **sigue sin haber repetidos** (mismo comando de 6.2).

### 6.4 — Los números persisten

Salir de la pantalla y volver.

- [ ] El volcado muestra todos los cantados; el total en base **coincide** con lo que
      muestra la app.

### 6.5 — El jugador ve la partida

Cerrar sesión, entrar con la cuenta USER.

- [ ] El volcado muestra los números cantados.
- [ ] Al cantar uno nuevo (haría falta volver a ADMIN), se refleja. Si es complicado de
      orquestar, ⏭ con el motivo.

### 6.6 — Ganadores

Requiere que un cartón complete **Terno**, **Cuarta**, **Línea** o **Cartón lleno**. Con un
solo boleto puede tardar mucho: dejar correr el automático mientras se comprueba.

- [ ] En el log: `GET /api/boleto/obtener-ganadores-fila/{id}` con **200**.
- [ ] Si hay ganador, aparece en el volcado.

**Si no se alcanza ningún premio en un tiempo razonable, ⏭.** **No inyectes ganadores en la
base**: un ganador fabricado no prueba la lógica de detección, que es justo lo que se
querría probar.

### 6.7 — Cerrar la partida

Si la interfaz lo permite:

- [ ] El backend inserta un número **-1** como marca de terminada:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$p = \App\Models\Partida::orderBy('NroPartida','desc')->first();
echo 'Terminada: '.(\App\Models\Numero::where('idPartida',\$p->id)->where('Nro',-1)->exists()?'SI':'NO').PHP_EOL;"
```

- [ ] La app refleja que terminó.

## Verificación

- [ ] Las siete pruebas anotadas con ✅/❌/⏭.
- [ ] **La lista completa de números de 6.2**, con su recuento de únicos.
- [ ] El audio anotado como ⏭ con las horas, **nunca como ✅**.

## Criterio de finalización

Las siete anotadas. Si solo apuntas un resultado de toda la sesión, que sea el de 6.2: es
la única verificación que `PartidaEnCurso.js` ha recibido nunca.
