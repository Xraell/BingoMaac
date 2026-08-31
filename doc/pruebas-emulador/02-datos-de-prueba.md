# 02 — Preparar cuentas y partida de prueba

**Depende de:** [01](01-preparacion-entorno.md)

## Objetivo

Tener con qué probar sin destrozar los datos reales.

## Por qué

La base local no está vacía: **20 usuarios, 52 partidas, 500 boletos y 226 compras**. Son
datos de uso real. Probar encima de ellos tiene dos problemas:

1. **Se contaminan.** Compras y movimientos de crédito de prueba mezclados con los reales,
   sin forma de distinguirlos después.
2. **No son reproducibles.** La partida actual (`id=86`, Nº 2563) ya tiene **45 números
   cantados**. Probar "el juego desde el principio" sobre ella es imposible.

Así que: cuentas nuevas, partida nueva, y todo etiquetado para poder encontrarlo luego.

## Antes de nada: copia de seguridad

```bash
cd D:/BINGO_MAAC/BACKEND && mysqldump -u root bingomaacv2 > <scratchpad>/bingomaacv2-antes-pruebas.sql
```

**Guardar el fichero fuera del repositorio** (el scratchpad de la sesión sirve). Un `.sql`
dentro del proyecto acabaría commiteado por accidente, y contiene datos de usuarios reales.

Sin este respaldo, no sigas. La tarea 05 mueve créditos y la 04 compra boletos.

## Pasos

### 1. Cuenta de USER nueva, desde la propia app

**Registrarla desde la pantalla de registro, no por SQL.** Dos motivos: prueba el alta de
paso, y garantiza que la clave queda con **bcrypt** (una insertada a mano quedaría en texto
plano y toparía con el bug 3).

Datos sugeridos, reconocibles a simple vista:

- Nombres: `Prueba Emulador`
- Teléfono: uno que no exista, p.ej. `+591 69990002`
- Clave: la que quieras, **anótala**

Anotar el `id` que le asigne la base.

### 2. La cuenta de ADMIN

Ya existe una (`Rol = ADMIN`, tel. `+591 73258781`). **Su clave no se conoce**: es de uso
real.

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$a = \App\Models\Usuario::where('Rol','ADMIN')->first();
echo \$a->id.' '.\$a->Telefono.PHP_EOL;"
```

Si no puedes entrar con ella, la salida limpia es **promover la cuenta de prueba** en vez de
tocar la del dueño:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$u = \App\Models\Usuario::where('Telefono','+591 69990002')->first();
\$u->Rol = 'ADMIN'; \$u->save();
echo 'Ahora ADMIN: '.\$u->id.PHP_EOL;"
```

**No cambies la clave del ADMIN real.** Es la cuenta del dueño de la plataforma.

Si haces esto, necesitarás **otra** cuenta USER para la tarea 04 (registra
`+591 69990003` igual que antes). Probar el flujo del jugador con un ADMIN no vale: el rol
cambia lo que se ve.

### 3. Créditos para poder comprar

El boleto de la partida actual cuesta **30**. Para comprar varios, con 300 sobra:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$u = \App\Models\Usuario::where('Telefono','+591 69990002')->first();
\$u->Creditos = 300; \$u->save();
echo 'Creditos: '.\$u->Creditos.PHP_EOL;"
```

Se hace por consola **a propósito**: si lo hicieras desde la app, dependería del bug 1, que
probablemente sigue vivo. Aquí solo queremos saldo con el que probar.

### 4. Una partida limpia

La actual (`id=86`) tiene 45 números cantados. Para la tarea 06 hace falta una recién
creada. **Crearla desde el panel de ADMIN de la app**, no por SQL: así se prueba también el
alta de partidas (tarea 05).

Al crearla, anotar su `NroPartida` — tiene que ser **mayor que 2563**, porque
`obtenerPartidaActual` devuelve la del `NroPartida` más alto. Si es menor, la app seguirá
mostrando la vieja.

Después, generar boletos para ella desde el panel de ADMIN y anotar cuántos.

### 5. Anotar el punto de partida

Antes de tocar nada más:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
echo 'Compras: '.\App\Models\Compra::count().PHP_EOL;
echo 'Usuarios: '.\App\Models\Usuario::count().PHP_EOL;
echo 'Partidas: '.\App\Models\Partida::count().PHP_EOL;"
```

Sirve para dos cosas: comprobar al final que las compras subieron lo que esperabas, y
localizar lo creado si hay que limpiar.

## Verificación

- [ ] El `.sql` de respaldo existe, **fuera del repositorio**, y no está vacío.
- [ ] Existe una cuenta USER de prueba con clave bcrypt y saldo ≥ 300.
- [ ] Hay acceso a una cuenta ADMIN, sin haber cambiado la clave del ADMIN real.
- [ ] Existe una partida nueva con `NroPartida` **mayor que 2563** y boletos generados.
- [ ] Las cifras de partida anotadas.

## Criterio de finalización

Los cinco checks. Sin el respaldo, no continúes.

Esta tarea no genera commit de código. Anota en `RESULTADOS.md` los ids y teléfonos usados:
las tareas siguientes los necesitan.
