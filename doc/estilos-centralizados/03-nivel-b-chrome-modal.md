# 03 — Nivel B: el chrome de modal, agrupado por variante

**Riesgo:** Medio · **Depende de:** [01](01-red-de-seguridad.md) **en verde** y
[02](02-nivel-a-identicos.md)

## Si la tarea 01 cerró en rojo, esta tarea no se hace

No hay versión "con cuidado". Esta tarea mueve estilos que **sí difieren entre ficheros** y
el fallo es invisible: un modal descolocado que nadie ve hasta que lo abre. Sin snapshots
estables no hay forma de detectarlo en este entorno.

Si la 01 falló: marcar esta como ⏭ cancelada en `ESTADO.md`, anotar el motivo, y pasar a la
04. **Eso es un cierre correcto de la etapa, no un fracaso.**

## Objetivo

Extraer el "chrome" repetido de los modales — el contenedor centrado, la X de cerrar, su
botón — **agrupando por variante, nunca fusionando variantes distintas**.

## La regla, otra vez, porque aquí es donde se rompe

> Dos variantes que difieren en un `marginRight: 7` son **dos constantes distintas**, no una.

El objetivo de esta etapa es quitar copia-pega, **no** unificar el diseño. Si al terminar
hay dos constantes que se parecen mucho, está bien. El día que alguien con un dispositivo
decida que el `marginRight: 7` era un accidente, las fusiona en un commit propio y lo
verifica mirando la pantalla.

## El inventario, por variante

### `buttonClose` — 14 usos, 2 variantes

```js
// Variante mayoritaria (12 modales)      // Variante de boleto (2 modales)
{                                         {
  backgroundColor: BingoColors.primary,     backgroundColor: BingoColors.primary,
  position: "absolute",                     borderRadius: 100,
  top: 10,                                  paddingHorizontal: 10,
  right: 10,                              }
  borderRadius: 100,
  paddingHorizontal: 10,
}
```

→ Extraer **solo la de 12**. `ModalBoleto.js` y `ModalBoletoGanador.js` se quedan con la
suya local. No son "casi iguales": una está posicionada en absoluto y la otra no.

### `button` — 16 usos, 5 variantes

→ Extraer **solo el grupo de 12** que comparten `Modales/`. Las otras 4 variantes se
quedan donde están, `ModalMensaje.js` incluido.

### `centeredView` — 15 usos, 4 variantes

Los dos grupos grandes son de 6 usos cada uno y difieren **solo** en `marginRight: 7`.

→ **Dos constantes separadas**, con nombres que digan en qué se diferencian. Por ejemplo
`vistaCentrada` y `vistaCentradaConMargen`. Las variantes de 2 y 1 usos
(`ModalBoleto`/`ModalBoletoGanador` con `flex: 1`, y `ModalPrecio` con su overlay) **no se
tocan**.

### `modalView` — 15 usos, 9 variantes

→ **No se toca nada.** Nueve variantes para quince usos: el grupo más grande son 3. No hay
duplicación que valga el riesgo.

## Pasos

### 1. Snapshots ANTES de tocar nada

Capturar snapshot de **cada modal que se vaya a modificar**, con la infraestructura de la
tarea 01. Commitear esos snapshots **en un commit propio, antes del refactor**.

Ese commit es la línea base. Si no existe, no hay nada contra qué comparar y la tarea
pierde su única red.

### 2. Extraer, variante por variante

Añadir a `src/Theme/estilosComunes.js` (el que creó la tarea 02). Copiar el valor literal,
igual que en la 02.

Orden de menor a mayor riesgo: `buttonClose` (2 variantes, la más limpia) → `button` →
`centeredView` (la más delicada, por ser dos constantes hermanas).

### 3. Verificar tras CADA variante

```bash
npx jest
```

Los snapshots deben pasar **sin reescribirse**. Si uno cambia:

- **No** correr `--updateSnapshot`. El snapshot tiene razón y el refactor está mal.
- Leer el diff: dirá exactamente qué propiedad se movió.
- Revertir esa variante y seguir con la siguiente.

### 4. Qué hacer si un snapshot cambia "por algo inofensivo"

No existe "inofensivo" aquí. Si el árbol renderizado cambió, algo cambió. La única
excepción legítima sería una diferencia de orden de propiedades que React Native aplana
igual — y ni siquiera esa merece la pena defender: revertir y seguir cuesta menos que
razonarla.

## Verificación

- [ ] `npx jest` en verde con **snapshots sin reescribir**. Este es el check que define la
      tarea.
- [ ] `git diff` de los snapshots respecto al commit de línea base del paso 1: **vacío**.
- [ ] Ninguna variante se fusionó con otra: cada constante nueva en `estilosComunes.js`
      tiene su valor hash-idéntico a la variante que reemplaza.
- [ ] `modalView` no se tocó.
- [ ] Las zonas prohibidas no se tocaron.

## Criterio de finalización

Los cinco checks en verde. Cada variante es independiente: si `centeredView` falla, se
revierte sola y `buttonClose`/`button` se quedan.

```
refactor(estilos-03): extraer el chrome de modal agrupado por variante
```
