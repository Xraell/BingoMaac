---
name: probar-app
description: Conduce una sesion de pruebas manuales de la app en el emulador Xpancity con el backend levantado en local. Usar cuando se pida probar la app en el emulador, verificar funcionalidades en dispositivo o ejecutar el plan de doc/pruebas-emulador. Recibe 01-07, estado, resultados o vacio.
---

# Probar la app en el emulador

Conduce el plan de `doc/pruebas-emulador/`: **pruebas manuales guiadas** de la app contra el
backend real, en el emulador `Xpancity_API_31`.

## Esta skill NO es autónoma

Es la diferencia con todas las demás del proyecto. `refactorizar-app`, `corregir-app` y sus
hermanas corren solas de noche. **Ésta no puede.**

Necesita a la persona delante: para arrancar el emulador, mirar la pantalla, escuchar el
audio y responder si algo se ve bien. Tu papel es **conducir**: ejecutas comandos, guías
paso a paso, preguntas qué se ve y **anotas**.

Aquí sí preguntas. Es lo contrario a las otras skills, y es deliberado.

## Argumento

| Valor | Acción |
|---|---|
| _(vacío)_ | Sesión completa: tareas 01 a 07, en orden |
| `01`–`07` | Solo esa tarea |
| `estado` | Muestra el progreso; no modifica nada |
| `resultados` | Muestra `RESULTADOS.md`; no modifica nada |

Si el argumento no coincide, muestra esta tabla y detente.

## La regla que gobierna todo

> **Se observa, se anota, no se arregla.**

Si una prueba falla, documéntalo y sigue con la siguiente. **No toques código durante la
sesión**, ni para un typo evidente.

Dos razones: arreglar a mitad de sesión invalida el resto (ya no sabrías si lo que falla
después es un bug o tu parche), y esta etapa tiene prohibido cambiar `src/`. Los arreglos
tienen sus propios planes, con tests y verificación.

Al terminar, `git status --short` **no debe mostrar ni un cambio en `src/`**.

## Cómo conducir cada prueba

Una a una. Para cada una:

1. **Di qué hay que hacer**, en una frase. No vuelques la tarea entera de golpe.
2. **Di qué debería pasar**, para que la persona sepa qué mirar.
3. **Espera la respuesta.**
4. **Mira la terminal del backend** si aporta: enseña la petición y su código de estado, y
   convierte un "no funciona" en un dato.
5. **Anota en `RESULTADOS.md` inmediatamente.** No acumules para el final.

Cuando algo falle, antes de seguir pregunta lo que convierta el fallo en algo accionable:
qué se vio exactamente, qué dijo la terminal, si se repite al intentarlo otra vez.

## Distinguir lo conocido de lo nuevo

**La tarea 01 comprueba si los tres bugs conocidos siguen vivos. Hazla siempre**, aunque
te salten a la 04.

Un fallo esperado no es un hallazgo. Si el bug 2 sigue vivo, la pestaña Boletos dará 403 y
eso ya se sabe: se anota como *conocido, confirmado* y se sigue. Mezclarlo con los
hallazgos nuevos hace el informe inútil, que es justo lo que esta etapa viene a producir.

## Cuidado: hay datos reales

La base local tiene **20 usuarios, 52 partidas y 226 compras de uso real**.

- **La tarea 02 hace copia de seguridad. No la saltes.** Sin respaldo, no empieces la 04
  ni la 05.
- El `.sql` va **fuera del repositorio** (scratchpad). Contiene datos de usuarios reales.
- **Nunca borres usuarios reales** ni cambies la clave del ADMIN del dueño.
- Crea cuentas y partida nuevas para probar. Están para eso.

## El montaje que más falla

El emulador es una máquina virtual: su `localhost` es él mismo. Alcanza al host por
`10.0.2.2`. Para que eso funcione:

```bash
cd D:/BINGO_MAAC/BACKEND && php artisan serve --host=0.0.0.0 --port=8080
```

**`--host=0.0.0.0` no es opcional.** Sin él el backend solo escucha en `127.0.0.1`, y desde
el emulador todo da "connection refused": la app arranca pero nada carga. Es el fallo más
común y el que más se confunde con un bug de la app.

`src/config/api.js` ya apunta a `http://10.0.2.2:8080/api` en desarrollo. **No lo
modifiques**, ni para rellenar el placeholder de producción: no cambia nada aquí y ensucia
el árbol.

## Cuándo detener la sesión

| Situación | Qué haces |
|---|---|
| La app no llega al login (tarea 01) | **Detente.** Todo lo demás fallaría por la misma causa |
| El login falla (3.2) | **Detente.** Las tareas 04–06 son inejecutables |
| Falla una prueba suelta | Anota, sigue con la siguiente |
| Una tarea entera queda bloqueada | Marca sus pruebas ⏭ con el motivo, pasa a la siguiente |
| Un fallo del montaje (backend caído, emulador colgado) | Arregla el montaje, anótalo como nota de entorno, **no como bug** |
| Encuentras un bug nuevo | `RESULTADOS.md`, **no lo arregles**, sigue |

Las tareas 04, 05 y 06 son **independientes**: que la 04 quede bloqueada por el bug 2 no
impide hacer la 05.

## Al terminar

Escribe `INFORME.md` (tarea 07). Sé literal: qué pasó, qué falló, qué no se pudo probar.

Dos cosas que suelen quedar mal:

- **Lo que funciona también se escribe.** Es la mitad útil que se olvida, y evita que la
  próxima sesión repita lo ya comprobado.
- **Un ⏭ bien explicado vale más que un ✅ dudoso.** Si no se probó, dilo. Este informe es
  el primero del proyecto que puede afirmar que algo funciona de verdad; no lo malgastes
  con suposiciones.

Commit final: `INFORME.md`, `RESULTADOS.md`, `ESTADO.md` y `PENDIENTE.md`. **Nada de
código.** Añade los ficheros uno por uno, nunca `git add -A`. No hagas `push`: el usuario
decide cuándo sube.

## Límites

**No hagas nunca:**

- Modificar `src/` ni el código del backend. Ni un typo.
- Rellenar `src/config/api.js`: nadie sabe el dominio real, y no hace falta para esto.
- Borrar usuarios, partidas o compras reales.
- Cambiar la clave del ADMIN del dueño.
- Empezar la 04 o la 05 sin el respaldo de la 02.
- Inyectar ganadores en la base para que 6.6 pase. Un ganador fabricado no prueba la
  lógica de detección, que es justo lo que se quiere probar.
- Dar por bueno lo que no viste. Si no se probó, es ⏭.
- `git push`, `git reset --hard`, borrar tags.

## Notas del proyecto

- App de bingo 90 bolas de **dinero real**: cualquier fallo en saldos, compras o créditos
  es **grave**, aunque parezca pequeño.
- Emulador: `Xpancity_API_31`. Gestor: **pnpm**, nunca `npm install`.
- Backend: Laravel 12 + MariaDB (XAMPP). Hay que arrancar MySQL desde el panel.
- El precio del boleto de la partida al redactar el plan era **30**.
- `PartidaEnCurso.js` y `ItemMiBoleto.js` no tienen tests y son zona prohibida en las otras
  etapas. **Las tareas 04.5 y 06.2 son la única verificación que van a recibir.**
- Contexto arquitectónico completo en `CLAUDE.md`.
