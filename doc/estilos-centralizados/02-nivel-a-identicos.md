# 02 — Nivel A: extraer las claves provablemente idénticas

**Riesgo:** Nulo por construcción · **Depende de:** nada — **tampoco de la
[01](01-red-de-seguridad.md)**

## Objetivo

Extraer a `src/Theme/estilosComunes.js` las 7 claves de estilo cuyo valor es **byte a byte
idéntico** en todos los ficheros donde aparece.

## Por qué no necesita snapshots

Si el objeto de estilo extraído es idéntico al que reemplaza, y la única diferencia es de
dónde se importa, **no hay ningún cambio observable posible**. React Native recibe el mismo
objeto. No hay nada que un snapshot pudiera detectar porque no hay nada que detectar.

Eso lo garantiza el paso 3 (comprobación por AST), no la buena voluntad de quien lo hace.

## El inventario

Medido con AST, normalizando espacios en blanco. Cada una tiene **una sola variante**:

| Clave | Usos | Dónde |
|---|---|---|
| `textStyle` | 14 | `Modales/` |
| `Descripcion` | 9 | `Modales/`, otros |
| `modalText` | 9 | `Modales/` |
| `rowItem` | 7 | varios |
| `fecha` | 4 | varios |
| `Encabezado` | 4 | varios |
| `lista` | 4 | varios |

**51 declaraciones** en total. Reconfirmar el inventario con el script antes de empezar: el
plan se escribió sobre el estado de la rama `claude/app-refactoring-jhfen0` y otros agentes
trabajan sobre este repositorio.

## Pasos

### 1. Reconfirmar el inventario

Volver a correr la medición por AST. Si alguna clave pasó a tener más de una variante desde
que se escribió esto, **queda fuera de la tarea**, sin excepción.

### 2. Crear `src/Theme/estilosComunes.js`

```js
import { StyleSheet } from "react-native";
import { BingoColors } from "./Colors";

export const estilosComunes = StyleSheet.create({
  textStyle: { /* copiado literal del original */ },
  modalText: { /* ... */ },
  // ...
});
```

**Copiar el valor literal, no reescribirlo.** Nada de "aprovechar y ordenar las
propiedades" ni de sustituir un hex por su constante de `Colors.js` — eso sería un cambio
distinto mezclado con este, y arruinaría la comprobación del paso 3.

### 3. La comprobación que define la tarea

Por cada clave extraída, comparar por AST el valor en `estilosComunes.js` contra el valor
que tenía en cada fichero **en el commit anterior**, normalizando espacios:

```bash
# Conceptualmente: hash(valor extraido) === hash(valor original en cada fichero)
```

Si un solo hash no coincide, esa clave se revierte. No se negocia: el valor de esta tarea
es precisamente que sea demostrable.

### 4. Sustituir en cada fichero

En cada consumidor:

- Añadir `import { estilosComunes } from "../../Theme/estilosComunes";` (ojo con la
  profundidad relativa, varía por carpeta).
- Borrar la clave de su `StyleSheet.create` local.
- Cambiar los usos: `styles.textStyle` → `estilosComunes.textStyle`.

**Cuidado con dos cosas:**

- Un `StyleSheet.create` que se queda **vacío** tras quitar su única clave: borrar también
  la constante `styles` y su import de `StyleSheet` si deja de usarse. Un `StyleSheet.create({})`
  huérfano es peor que no haber tocado nada.
- Los usos en arrays: `style={[styles.button, styles.buttonClose]}` — hay que sustituir
  cada elemento por separado, y pueden mezclarse locales con comunes:
  `style={[estilosComunes.button, styles.buttonClose]}`. Es correcto y esperado.

### 5. Orden sugerido

De menos a más usos, para que un fallo temprano cueste poco: `lista` (4) → `Encabezado` (4)
→ `fecha` (4) → `rowItem` (7) → `modalText` (9) → `Descripcion` (9) → `textStyle` (14).

**Una clave, una verificación.** No extraer las siete de golpe.

## Verificación

- [ ] `npx jest` en verde (los 11 tests previos, más los de la 01 si existen).
- [ ] **Cada valor extraído es hash-idéntico al original** en cada fichero que lo usaba.
      Este es el check que define la tarea.
- [ ] Ningún `StyleSheet.create({})` vacío quedó en el árbol:
      ```bash
      grep -rn "StyleSheet.create({})" src --include=*.js
      ```
      Sin salida.
- [ ] Ningún `import { StyleSheet }` quedó sin uso en los ficheros tocados.
- [ ] Las zonas prohibidas no se tocaron.
- [ ] El total de declaraciones de estilo bajó en ~51 y **ninguna propiedad CSS cambió de
      valor** en todo el diff:
      ```bash
      git diff pre-estilos -- src/ | grep "^[+-]" | grep -E "^\+.*: " | sort > /tmp/added
      # las lineas añadidas de propiedades deben aparecer todas entre las borradas
      ```

## Criterio de finalización

Los seis checks en verde. Si una clave falla la comprobación de hash, se revierte **solo
esa clave** y se sigue con las demás: son independientes entre sí.

```
refactor(estilos-02): extraer los estilos identicos a Theme/estilosComunes
```
