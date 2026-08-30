# 04 — Informe de cierre

**Riesgo:** — · **Depende de:** todas las anteriores

## Objetivo

Dejar por escrito qué se arregló y **qué falta comprobar con la app abierta**.

## Por qué

Esta etapa cambia comportamiento sin haber podido ejecutar la app. Los tests demuestran que
la petición sale bien formada; **no demuestran que el crédito se abone**. El informe tiene
que decirlo sin ambigüedad.

## Estructura de `INFORME.md`

### 1. Resumen

Tres frases: qué bug se arregló, cuál era su impacto (los dos modales de crédito no
funcionaban), y **la advertencia de que nada se probó en ejecución**.

### 2. Antes y después

| Métrica | Antes | Después |
|---|---|---|
| Tests | 32 | |
| Snapshots | 21 | **debe seguir siendo 21, sin reescribir** |
| Bundle | 5.45 MB | |
| Llamada de créditos | `GET .../{id}/{n}` | `POST .../{id}` + body |

### 3. El segundo defecto que se encontró de paso

Explicar que `TextInput` deja `cantidad` como **string** y que el backend valida `integer`
estricto: sin la conversión, los botones ±10 funcionarían y teclear la cantidad daría 422.
No estaba en el reporte original; es la clase de fallo intermitente que cuesta caro
diagnosticar después.

### 4. Checklist de verificación manual — **la sección más importante**

Requiere emulador y backend levantado. En orden:

- [ ] Login como **ADMIN**.
- [ ] **Agregar créditos** con los botones ±10 → el saldo sube y la lista se actualiza.
- [ ] **Agregar créditos escribiendo la cantidad a mano** → funciona igual.
      *(Este es el caso del defecto de la sección 3.)*
- [ ] **Retirar créditos** → el saldo baja.
- [ ] **Retirar más créditos de los que hay** → aparece un mensaje **con sentido**
      (saldo insuficiente), no "Ocurrió un error desconocido". *(Tarea 03.)*
- [ ] Dejar el campo **vacío** y confirmar → mensaje razonable, el modal no se cuelga con
      el spinner girando.
- [ ] El **bono de referido del 20 %** se abona a quien corresponda, si el usuario tiene
      `idReferido`.

Y con el backend ya corregido (`BACKEND/doc/correccion-hallazgos/`):

- [ ] Un **USER** ve la lista de boletos disponibles y **puede comprar uno**.

Si algo falla, `git log --oneline` señala la tarea y `git revert` de ese commit la deshace.
El tag `pre-correccion-app` es el punto de retorno de la etapa entera.

### 5. Hallazgos

Volcado de `HALLAZGOS.md`.

### 6. Lo que sigue pendiente

Los 7 puntos de deuda de `doc/PENDIENTE.md` § 2 siguen sin tocar, **incluido
`src/config/api.js` con `https://<dominio-real>/api`**, que rompe cualquier build de
producción. Y las tres etapas planificadas: dependencias, seguridad 05/06, SDK 54.

## Verificación automática

- [ ] `INFORME.md` existe con las seis secciones.
- [ ] La sección 4 **no está vacía**. Es el entregable de esta tarea.
- [ ] `npx jest` y `npx expo export` en verde.
- [ ] `git status --short` sin cambios propios sin commitear.

## Criterio de finalización

Los cuatro checks.

```
docs(04): informe de cierre de la correccion de hallazgos
```
