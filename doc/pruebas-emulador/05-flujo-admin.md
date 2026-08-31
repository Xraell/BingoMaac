# 05 — El panel de administración

**Depende de:** [03](03-humo-y-sesion.md) · **Técnicas:** [TECNICAS-ADB.md](TECNICAS-ADB.md)

## Objetivo

Probar las cinco pantallas de ADMIN: Partida, Usuarios, Participantes, Créditos y Juego.

## Pruebas

Con la cuenta ADMIN de la tarea 02.

### 5.1 — El panel solo lo ve un ADMIN

- [ ] Con ADMIN: se ven las cinco pestañas de administración.
- [ ] Con la cuenta USER: **no aparecen**.

Es la comprobación de la autorización en cliente (tarea 04 de seguridad), marcada como
completada pero **nunca verificada en dispositivo**.

### 5.2 — Listados

- [ ] **Usuarios** carga la lista.
- [ ] **Participantes** carga.
- [ ] En el backend: **200** en ambas.

### 5.3 — Agregar créditos ⚠️

**Si el bug 1 sigue vivo (tarea 01), esto va a fallar con "Ocurrió un error desconocido".**
Es lo esperado, no un hallazgo nuevo.

Medir antes y después, con el mismo comando:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$u = \App\Models\Usuario::find(<id>);
echo 'Creditos: '.\$u->Creditos.PHP_EOL;"
```

- [ ] Con los botones **±10**: el saldo **sube exactamente lo indicado** (verificado por
      consola, no por pantalla).
- [ ] **Escribiendo la cantidad a mano** (`input text`): mismo resultado.
- [ ] En el log: `POST /api/usuario/agregar-creditos/{id}` con **200**.
      Un **404** es el bug 1 (la app manda GET con la cantidad en la URL).
      Un **422** con los botones funcionando es el **segundo defecto encadenado**: el campo
      de texto deja la cantidad como *string* y el backend valida `integer` estricto.

**Probar las dos formas por separado no es redundante**: es exactamente lo que distingue un
bug del otro, y la razón de que el plan de corrección tenga ese matiz.

### 5.4 — Retirar créditos

- [ ] El saldo **baja exactamente lo indicado**, verificado por consola.
- [ ] Retirando **más de lo que hay**: en el log **422**, y **el saldo no cambia**
      (el delta debe ser 0) ni queda negativo.

### 5.5 — Bono de referido del 20 %

Solo si hay un usuario con `idReferido`. Al agregarle créditos:

- [ ] Su referidor recibe el **20 %**, redondeado hacia abajo (`floor`).

Comprobable por consola antes y después:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan tinker --execute="
\$u = \App\Models\Usuario::find(<id>);
echo 'Usuario: '.\$u->Creditos.PHP_EOL;
if (\$u->idReferido) { echo 'Referidor: '.\App\Models\Usuario::find(\$u->idReferido)->Creditos.PHP_EOL; }"
```

Si no hay ninguno con referido, marcar ⏭.

### 5.6 — Crear partida y generar boletos

Ya se hizo en la tarea 02; aquí solo se anota el resultado.

- [ ] La partida se creó con su `NroPartida` y descripción.
- [ ] Se generaron boletos y aparecen en el listado.

### 5.7 — Exportar a Excel

Participantes → **Exportar en Excel**.

- [ ] Genera el `.xlsx` y abre el diálogo de compartir del sistema.
- [ ] El fichero no está vacío.

Prueba `xlsx`, la dependencia que se instala desde `cdn.sheetjs.com` y que dejó el lockfile
en un estado peculiar. Si falla aquí, es probable que sea de instalación, no de código.

### 5.8 — Eliminar

Sobre la **cuenta de prueba**, nunca sobre datos reales.

- [ ] Eliminar un usuario de prueba funciona y desaparece de la lista.

⚠️ **No borres usuarios reales.** Son 19 cuentas de personas con historial de compras.

## Verificación

- [ ] Las ocho pruebas anotadas con ✅/❌/⏭.
- [ ] Los saldos antes/después de 5.3, 5.4 y 5.5 registrados.
- [ ] Si 5.3 falló, anotado **qué código devolvió** (404 vs 422): distingue bug 1 del
      defecto encadenado.

## Criterio de finalización

Las ocho anotadas.
