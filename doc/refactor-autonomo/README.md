# Refactor autónomo — BingoMaac (app)

Etapa de **pura calidad interna**: duplicación, legibilidad y ruido. No cambia nada
observable — ni una pantalla, ni un texto, ni una llamada a la API.

Está diseñada para ejecutarse **sin supervisión y sin tu máquina delante**. Todo lo que
exigiría un dispositivo, un emulador o una decisión humana se ha dejado fuera a propósito.

Solo app. El backend tiene su propio plan en `BACKEND/doc/refactor-autonomo/`.

## Cómo se ejecuta

```bash
/refactorizar-app
```

Sin argumento, la skill recorre las tareas pendientes **una tras otra sin detenerse**.
También acepta `01`–`06` para una tarea concreta, o `estado`.

## La diferencia con el plan del backend: aquí no hay tests

El backend tiene 25 tests. **Esta app no tiene ninguno, ni linter.** La única verificación
automática disponible es:

```bash
npx expo export --platform android
```

Eso demuestra que **el código compila y el bundle se genera**. No demuestra que la app
funcione: los fallos de React Native aparecen en ejecución, no al compilar.

Esa limitación **gobierna todo el plan**. Por eso:

- Las tareas son deliberadamente conservadoras: mover código, borrar ruido, extraer
  duplicación mecánica. Nada que cambie el flujo de render ni el estado.
- Hay **zonas prohibidas** que ninguna tarea toca, por muy mejorables que parezcan.
- Ante la duda, **no se hace**. Se anota en `HALLAZGOS.md`.

Un refactor agresivo sin tests y sin nadie mirando es la peor combinación posible. Este
plan asume eso y renuncia a la mitad de lo que se podría mejorar, a cambio de que lo que
haga sea seguro.

## La regla que gobierna la etapa

> **Si un cambio altera lo que el usuario ve o lo que la app envía, no pertenece a este plan.**

Ni un texto, ni un estilo, ni un orden de elementos, ni el cuerpo de una petición, ni el
momento en que se dispara. Ante la duda entre dos formas de hacer algo, gana la que menos
código mueve.

## Orden de las tareas

| # | Tarea | Riesgo | Qué la verifica |
|---|---|---|---|
| [01](01-linea-base.md) | Línea base y red de seguridad posible | — | Bundle de referencia |
| [02](02-limpiar-logs.md) | Quitar `console.log` de depuración | Nulo | Bundle + grep |
| [03](03-imports-y-muerto.md) | Imports sin usar y código muerto | Bajo | Bundle |
| [04](04-utils-duplicados.md) | Unificar el patrón repetido de `Utils/` | Medio | Bundle + firmas |
| [05](05-constantes-y-estilos.md) | Extraer literales repetidos | Bajo | Bundle |
| [06](06-informe.md) | Informe de cierre | — | — |

## Zonas prohibidas

Ninguna tarea toca esto, aunque el código parezca mejorable:

**`src/components/Conjunto/PartidaEnCurso.js`** — 341 líneas y **39 usos de refs**. Espeja
estado en refs porque los callbacks de `setTimeout` viven fuera del ciclo de render.
Tocarlo sin poder probar en dispositivo es la forma más rápida de romper la partida sin
enterarse. Lo único permitido: quitar sus `console.log` (tarea 02).

**`src/components/Items/ItemMiBoleto.js:46`** — `Object.values(boleto).slice(4)` depende
del **orden de las claves** del objeto que devuelve la API. Cualquier cambio alrededor
puede alterar ese orden y el fallo es silencioso: muestra números equivocados.

**`src/components/Items/ItemNro.js:18,84`** — el audio se dispara con `index === 0`.
Frágil y silencioso: si deja de cumplirse, simplemente no suena.

**`src/Utils/sesion.js` y `src/Utils/http.js`** — son de la etapa de seguridad, recién
verificados en dispositivo. No se tocan salvo lo que diga explícitamente la tarea 04.

## Qué queda explícitamente fuera

- **Cualquier cambio visible**: textos, estilos, layout, navegación, tiempos.
- **Bugs.** Se anotan en `HALLAZGOS.md`, no se arreglan.
- **Dependencias**: no se añade, actualiza ni elimina ningún paquete. (`npx expo install`
  además ensucia `package-lock.json` en este repo, ya migrado a pnpm.)
- **Migrar de SDK.** Eso es `doc/migracion-sdk54/`.
- **Las tareas 05 y 06 de `doc/seguridad-produccion/`** — necesitan dominio real y
  dispositivo.
- **Añadir un framework de tests.** Sería lo más valioso, pero instalar Jest y
  `@testing-library/react-native` es un cambio de dependencias con configuración de Babel
  de por medio: demasiado para una ejecución sin supervisión. Queda recomendado en el
  informe.
- **El backend.**

## Convenciones

- **Un commit por tarea**, con el prefijo `refactor(NN):`.
- **`expo export` en verde antes de avanzar.** Si falla, se revierte esa tarea y se sigue
  con la siguiente.
- **Nunca `git add -A` ni `git add .`**: hay otros agentes operando sobre el repositorio.
- Punto de retorno: tag `pre-refactor-app`, creado en la tarea 01.
- El progreso se anota en [ESTADO.md](ESTADO.md); los hallazgos, en [HALLAZGOS.md](HALLAZGOS.md).

## Lo que hay que hacer al despertar

Este plan **no puede probar la app**. Antes de dar por bueno el trabajo, hace falta una
pasada manual en el emulador: entrar, ver la partida en curso, comprar un boleto y mirar
«mis boletos». El informe de la tarea 06 lo recuerda con un checklist corto.
