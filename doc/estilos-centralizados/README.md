# Etapa — Centralizar estilos duplicados

Extraer a un módulo compartido los estilos que hoy están copiados literalmente en decenas
de ficheros, **sin cambiar ni un píxel de lo que se ve en pantalla**.

## La medición, antes de opinar

El plan se escribió después de medir la duplicación real con un script sobre el AST, no a
ojo. El resultado **contradice la intuición** y es lo que da forma a toda la etapa:

| Clave | Usos | Variantes distintas |
|---|---|---|
| `textStyle` | 14 | **1** |
| `Descripcion` | 9 | **1** |
| `modalText` | 9 | **1** |
| `rowItem` | 7 | **1** |
| `fecha` / `Encabezado` / `lista` | 4 c/u | **1** c/u |
| `buttonClose` | 14 | 2 |
| `centeredView` | 15 | 4 |
| `button` | 16 | 5 |
| `modalView` | 15 | 9 |
| `container` | 10 | **10** |
| `title` | 23 | **14** |
| `bx` | 23 | **21** |

Dos lecturas opuestas conviven en esa tabla:

1. **Hay duplicación real y trivial de eliminar.** Siete claves suman **51 declaraciones
   byte a byte idénticas**. Extraerlas no puede cambiar nada: el valor es el mismo objeto.

2. **Hay mucha más duplicación *aparente* que real.** `bx` — el patrón de pantalla que
   `CLAUDE.md` describe como recurrente — aparece 23 veces siendo **21 cosas distintas**.
   `container` son 10 nombres iguales para 10 estilos diferentes. `title`, 14 variantes.

El riesgo de esta etapa no es técnico, es de lectura: **el nombre sugiere que se puede
unificar mucho más de lo que realmente se puede.** Un agente (o una persona) con prisa
"centraliza `bx`" y descoloca 21 pantallas sin que ningún test lo note.

### El caso que lo ilustra todo: `centeredView`

Cuatro variantes, dos de ellas con 6 usos cada una:

```js
// Variante A (6 modales)          // Variante B (6 modales)
{                                  {
  justifyContent: "center",          justifyContent: "center",
  alignItems: "center",              alignItems: "center",
  position: "relative",              marginRight: 7,      // <-- la unica diferencia
}                                    position: "relative",
                                   }
```

Se ven iguales de un vistazo. Unificarlas movería 6 modales 7 píxeles. Nadie lo vería en
code review y ningún test actual lo detectaría.

**Por eso este plan agrupa por variante, no por nombre.**

## La regla que gobierna la etapa

> **Un estilo solo se extrae si su valor es byte a byte idéntico en todos los ficheros que
> lo van a compartir.**

Decidir que dos estilos parecidos "son el mismo" es una decisión de diseño, no de refactor.
Si dos variantes difieren aunque sea en un `marginRight: 7`, o se extraen **como dos
constantes separadas**, o no se tocan. Nunca se fusionan.

## Lo que cambia respecto a la etapa de refactor anterior

`doc/refactor-autonomo/` dejó los estilos explícitamente fuera de alcance, con este motivo:

> «Unificarlos exige decidir qué es "el mismo estilo", y cualquier error es visible en
> pantalla. Fuera de alcance.»

Sigue siendo verdad. Lo que cambió es que **ahora hay Jest instalado**
(`doc/pruebas-automatizadas/`), así que por primera vez existe la posibilidad de una red de
seguridad real: capturar un snapshot del árbol renderizado *antes* de tocar los estilos y
exigir que sea idéntico *después*. Un `marginRight: 7` que desaparece aparecería en el diff
del snapshot.

**Esa posibilidad todavía no está confirmada** — ver la tarea 01.

## El obstáculo conocido: los snapshots no son turnkey

Se intentó un spike de snapshot sobre dos modales durante la redacción de este plan. **Los
dos fallaron**, con una cadena de incompatibilidades de mocks entre `jest-expo@52`,
`react-native-paper@5.15` y React Native 0.76:

| Intento | Error |
|---|---|
| `ModalComoFunciona` directo | `expo-font` → `isLoaded` sobre un objeto vacío, dentro de `@expo/vector-icons` |
| ídem, mockeando `@expo/vector-icons` | igual — Paper importa el subpath, no la raíz |
| ídem, mockeando `expo-font` | `Cannot read properties of undefined (reading 'timing')` en `Button.tsx` de Paper |
| envolviendo en `<PaperProvider>` | `Cannot read properties of undefined (reading 'addEventListener')` en el propio `PaperProvider` (`Appearance` sin mock) |
| `ModalDetallesParticipante` sin Paper Provider | sigue fallando |

No es un callejón sin salida —son mocks, y los mocks se escriben— pero **es un trabajo en
sí mismo, no un preámbulo de cinco minutos**. De ahí que sea la tarea 01 y que sea una
compuerta.

## Tareas

| # | Tarea | Riesgo | Depende de |
|---|---|---|---|
| [01](01-red-de-seguridad.md) | Hacer que el snapshot testing funcione | — | Jest ya instalado |
| [02](02-nivel-a-identicos.md) | Extraer las 7 claves provablemente idénticas | **Nulo por construcción** | nada (ni de la 01) |
| [03](03-nivel-b-chrome-modal.md) | Chrome de modal, agrupado por variante | Medio | **01 en verde** |
| [04](04-informe.md) | Informe y decisión sobre lo que no se tocó | — | anteriores |

**La 02 no depende de la 01.** Es segura por construcción: si el valor extraído es el mismo
objeto, no hay nada que un snapshot pudiera detectar. Se puede hacer aunque la 01 fracase.

**La 03 sí depende de la 01.** Sin snapshots no hay forma de detectar un cambio visual, y
esa tarea sí mueve estilos entre ficheros. Si la 01 fracasa, **la 03 no se hace**: se
documenta como pendiente y la etapa cierra con la 02 y la 04.

## Dónde vive el resultado

`src/Theme/estilosComunes.js`, junto al `Colors.js` que ya existe. Nombres en español, como
todo el dominio del proyecto.

## Zonas prohibidas

Las mismas de `doc/refactor-autonomo/`, sin excepciones esta vez:

| Fichero | Por qué |
|---|---|
| `PartidaEnCurso.js` | 39 usos de refs; el estado se espeja para los `setTimeout` |
| `ItemMiBoleto.js` | `Object.values(boleto).slice(4)` depende del orden de las claves |
| `ItemNro.js` | El audio se dispara con `index === 0` |
| `Utils/sesion.js`, `Utils/http.js` | De la etapa de seguridad, verificados en dispositivo |
| `src/components/Data/` | Tablas de datos indexables dinámicamente |

## Qué queda explícitamente fuera

- **Fusionar variantes parecidas.** `centeredView` A y B se quedan separadas para siempre,
  salvo que alguien con dispositivo decida que el `marginRight: 7` era un accidente.
- **`bx`, `container`, `title`.** Demasiadas variantes: 21, 10 y 14. No hay nada que
  centralizar ahí que no sea rediseñar.
- **Estilos inline** (`style={{ ... }}` dentro del JSX). Son otro problema y otra etapa.
- **Colores hardcodeados.** Ya se comprobó en la tarea 05 del refactor: ninguno de los 16
  coincide con la paleta de `Colors.js`. Meterlos exige inventar entradas nuevas, que es
  decisión de diseño.
- **Cambiar cualquier valor.** Ni un píxel, ni un color, ni un `flex`.

## Verificación

- `npx jest` en verde (11 tests existentes + los que agregue la 01).
- Para la 02: comprobación por AST de que el valor extraído es idéntico al original.
- Para la 03: snapshots idénticos antes y después.
- `npx expo export` sigue sin poder ejecutarse en el sandbox actual (ver
  `doc/pruebas-automatizadas/`); si el entorno lo permite, correrlo también.
