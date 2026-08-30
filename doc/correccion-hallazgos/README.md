# Corrección de hallazgos — App

Etapa de **corrección de bugs**, no de refactor. Nace de la verificación en dispositivo del
2026-08-30 (`doc/PENDIENTE.md`), la primera vez que alguien abrió la app contra el backend
real desde que se cerró con `auth:sanctum`.

De los tres hallazgos de esa sesión, **uno es de la app** y se arregla aquí. Los otros dos
son del backend y tienen su propio plan en `BACKEND/doc/correccion-hallazgos/`.

## Por qué esta etapa es distinta a las anteriores

El refactor y la centralización de estilos tenían prohibido cambiar nada observable.
**Esta etapa existe para cambiar comportamiento.** La regla es la contraria:

> **Cada cambio debe alterar exactamente un comportamiento, el descrito en su tarea, y
> ninguno más.**

Lo que **no** cambia respecto a sus hermanas: sigue sin haber emulador en un entorno
autónomo. Hay 32 tests y 21 snapshots, y `npx expo export` compila — pero **compilar no es
funcionar**. Todo lo que este plan no pueda demostrar con un test va al checklist manual.

## Tareas

| # | Tarea | Riesgo | Necesita el backend |
|---|---|---|---|
| [01](01-linea-base.md) | Línea base y reproducción | — | Para reproducir |
| [02](02-creditos-contrato.md) | Corregir la llamada de créditos | Medio | No, para el código |
| [03](03-error-visible.md) | Que el fallo de créditos no se trague el error | Bajo | No |
| [04](04-informe.md) | Informe de cierre | — | No |

## El orden respecto al backend

**Este plan y el del backend son independientes.** No hay que esperar a uno para hacer el
otro:

- La tarea 02 de aquí arregla al cliente para que hable como el backend **ya** espera. El
  backend no necesita cambio.
- Las tareas 02 y 03 del backend no requieren tocar la app.

Lo único que se cruza es la **verificación manual**: probar la compra de un boleto como
`USER` necesita el arreglo del backend desplegado. Está anotado en el informe.

## Lo que NO se toca aquí

- **Los otros 7 puntos de deuda** de `doc/PENDIENTE.md` § 2 (`api.js` con placeholder,
  `styles.button`, `storagePermissions.js` huérfano...). Son deuda conocida, no bugs
  reproducidos en dispositivo. Mezclarlos haría este plan irrevisable.
- Las zonas prohibidas de las etapas anteriores: `PartidaEnCurso.js`, `ItemMiBoleto.js`,
  `ItemNro.js`, `src/components/Data/`.
- Refactor, estilos, dependencias, migración de SDK. Cada una tiene su etapa.
