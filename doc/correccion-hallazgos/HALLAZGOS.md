# Hallazgos — corrección de bugs (app)

Cosas encontradas durante esta etapa que **no** se arreglan en ella.

A diferencia de las etapas de refactor, aquí sí se arreglan bugs — pero solo los del plan.
Cualquier otro que aparezca se anota y sigue.

## Conocidos al redactar el plan

- **`cantidad` es un string cuando se teclea** en los modales de crédito
  (`onChangeText={(t) => setCantidad(t)}`), y el backend valida `integer` estricto.
  **No se queda como hallazgo: lo arregla la tarea 02**, porque sin eso el arreglo del
  método HTTP quedaría a medias. Se anota aquí porque no estaba en el reporte original.
- **Los 7 puntos de deuda** de `doc/PENDIENTE.md` § 2 siguen vigentes y fuera de alcance.

## Encontrados durante la ejecución

_(vacío — el plan no ha empezado)_
