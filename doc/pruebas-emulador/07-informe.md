# 07 — Informe de resultados

**Depende de:** todas las anteriores

## Objetivo

Convertir las anotaciones en un documento que sirva para decidir qué se arregla.

## Por qué

Es el entregable de la etapa entera. Las seis tareas anteriores producen observaciones
sueltas; sin esto, se pierden.

Y hay una diferencia con los informes de las otras etapas: **aquí sí se probó de verdad**.
Éste es el primer documento del proyecto que puede afirmar que algo funciona sin la
coletilla de "no verificado en dispositivo". Vale la pena que lo diga con claridad.

## Estructura de `INFORME.md`

### 1. Qué se probó

Los dos commits (app y backend), si los árboles estaban limpios, y el estado de los tres
bugs conocidos al empezar. Sin esto el informe no es reproducible.

### 2. Resultado, de un vistazo

| Tarea | ✅ | ❌ | ⏭ |
|---|---|---|---|
| 03 Sesión | | | |
| 04 Jugador | | | |
| 05 Admin | | | |
| 06 Partida | | | |

### 3. Lo que funciona

Lista escueta de lo confirmado. Es la mitad útil que suele quedar sin escribir: sirve para
que la próxima sesión no repita lo ya comprobado.

### 4. Fallos encontrados

Separados en dos grupos, y la separación importa:

**4.1 — Bugs ya conocidos, confirmados.** Los tres del `PENDIENTE.md`. No son noticia; se
anota que siguen y con qué síntoma exacto.

**4.2 — Hallazgos nuevos.** Los que nadie había visto. Cada uno con:

- Qué se hizo, qué se esperaba, qué pasó.
- El código de estado del backend.
- Si es reproducible.
- Gravedad: **bloqueante** (impide usar la app) · **grave** (afecta a dinero o datos) ·
  **menor** (cosmético o molesto).

Cualquier fallo que toque **saldos, compras o créditos va como grave**, aunque parezca
pequeño: es dinero real.

### 5. Lo que no se pudo probar

Cada ⏭ con su motivo. Un "no se pudo" bien explicado vale más que un ✅ dudoso.

### 6. Qué hacer ahora

Recomendación ordenada. Con lo que se sabe al redactar el plan, el orden probable es:

1. `BACKEND/doc/correccion-hallazgos/` — el bug 2 impide comprar: es lo más grave.
2. `APP/doc/correccion-hallazgos/` — los créditos.
3. Volver a pasar las tareas 04 y 05 de esta etapa para confirmar los arreglos.

Ajustarlo a lo que de verdad haya salido.

## Dónde va el informe

`doc/pruebas-emulador/INFORME.md`, y **`RESULTADOS.md` se conserva** como registro en bruto.

Actualizar `doc/PENDIENTE.md` con lo esencial: es el documento que alguien lee al retomar
el proyecto.

## Verificación

- [ ] `INFORME.md` con las seis secciones.
- [ ] La sección 4 distingue **conocidos** de **nuevos**.
- [ ] Cada hallazgo nuevo tiene pasos de reproducción.
- [ ] `doc/PENDIENTE.md` actualizado.

## Criterio de finalización

Los cuatro checks.

```
docs(pruebas): resultados de la sesion de pruebas en emulador
```

Commitear `INFORME.md`, `RESULTADOS.md`, `ESTADO.md` y `PENDIENTE.md`. **Nada de código**:
esta etapa no lo modifica. Si el árbol tiene cambios en `src/`, algo se arregló sobre la
marcha y hay que revisarlo antes de commitear.
