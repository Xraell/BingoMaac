# 04 — Unificar el patrón repetido de `src/Utils/`

**Riesgo:** Medio · **Depende de:** [03](03-imports-y-muerto.md)

## Objetivo

Reducir la repetición de los 59 bloques `try/catch` casi idénticos de `src/Utils/`, sin
cambiar la firma ni el comportamiento de ninguna función exportada.

## Por qué

Los 8 ficheros de dominio de `src/Utils/` suman **942 líneas**, y casi todas son el mismo
bloque copiado:

```js
export const ObtenerAlgo = async (id) => {
  try {
    const data = await apiFetch("/algo/" + id);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en algo:", error);
    return null;
  }
};
```

Hay **59 bloques `try`** y **35 `return null`** repartidos así: `Boleto.js` 12,
`UsuarioPromocion.js` 10, `Usuario.js` 9, `Numero.js` 8, `Partida.js` 8, `Compra.js` 7.

## Por qué esta tarea es de riesgo medio

Es la única del plan que reescribe código en lugar de borrarlo, y toca la capa por la que
pasa **toda** la comunicación con el backend. Un error aquí no rompe la compilación: rompe
las llamadas en ejecución, que es justo lo que no se puede verificar sin dispositivo.

De ahí que la regla siguiente sea absoluta.

## La regla que no se puede romper

**Ninguna función exportada cambia de nombre, de argumentos ni de valor de retorno.**

Eso incluye la inconsistencia actual: unas funciones devuelven `null` al fallar y otras
relanzan el error. **Se conserva tal cual, función por función.**

Unificarlo sería una mejora real —lo pedía la tarea 05 del plan de seguridad— pero cambia
cómo reaccionan las pantallas: una que hoy recibe `null` y muestra una lista vacía pasaría
a recibir una excepción no capturada. **Eso es cambio de comportamiento y está prohibido
aquí.** Anotarlo en `HALLAZGOS.md`.

## Pasos

### 1. Catalogar antes de tocar

Por cada función exportada de `src/Utils/*.js`, anotar en una tabla de trabajo:

| Función | Fichero | Al fallar devuelve | Lanza |
|---|---|---|---|
| `ObtenerUsuarios` | `Usuario.js` | `null` | no |
| `VerificarUsuario` | `Usuario.js` | — | **sí** |
| `agregarUsuario` | `Usuario.js` | — | **sí** |
| ... | | | |

Esa tabla **es** la especificación. Sin ella no se puede verificar nada.

### 2. Extraer solo los dos patrones puros

Crear dos ayudantes en `src/Utils/http.js`, junto a `apiFetch`:

```js
// Para las funciones que hoy devuelven null al fallar
export async function pedirODevolverNull(ruta, etiqueta, opciones) {
  try {
    const data = await apiFetch(ruta, opciones);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error(`Error en ${etiqueta}:`, error);
    return null;
  }
}

// Para las que hoy relanzan
export async function pedirOLanzar(ruta, etiqueta, opciones) {
  try {
    return await apiFetch(ruta, opciones);
  } catch (error) {
    console.error(`Error en ${etiqueta}:`, error);
    throw error;
  }
}
```

Y reescribir **solo** las funciones que encajan exactamente en uno de los dos moldes:

```js
export const ObtenerUsuarios = async () => {
  const data = await pedirODevolverNull("/usuario", "Obtener Usuarios");
  if (data && !Array.isArray(data)) {
    return null;   // la comprobacion propia se conserva
  }
  return data;
};
```

### 3. Qué NO unificar

**Cualquier función con lógica propia dentro del `try` se queda como está.** Concretamente:

- `VerificarUsuario` (`Usuario.js`) — guarda el token y normaliza la respuesta. **Es de la
  etapa de seguridad, recién verificada en dispositivo.** No se toca.
- `ObtenerBoletosAleatorios` (`Boleto.js`) — ya tiene una desviación documentada en el
  plan de seguridad sobre su manejo de errores.
- Las que validan la forma de la respuesta de un modo distinto al del molde.
- Todo lo que esté en `sesion.js` y `http.js` más allá de añadir los dos ayudantes.

**El objetivo no es que no quede ni un `try`.** Es quitar la repetición mecánica y dejar
lo que tiene sustancia.

### 4. Fichero por fichero, con export entre medias

Orden de menor a mayor riesgo: `Mensaje.js` (2 bloques), `Ganador.js` (2), `Compra.js` (7),
`Numero.js` (8), `Partida.js` (8), `UsuarioPromocion.js` (10), `Boleto.js` (12).

**`Usuario.js` el último**, y con especial cuidado: contiene el login.

Ejecutar `expo export` después de **cada fichero**. Si falla, revertir ese fichero y seguir
con el siguiente — los ficheros son independientes entre sí.

## Verificación automática

- [ ] `npx expo export` en verde.
- [ ] **Las firmas exportadas son idénticas.** Es el check que define la tarea:

      ```bash
      git show pre-refactor-app:src/Utils/Usuario.js | grep -oE "^export (const|async function) [A-Za-z]+" | sort > /tmp/f_antes.txt
      grep -oE "^export (const|async function) [A-Za-z]+" src/Utils/Usuario.js | sort > /tmp/f_despues.txt
      diff /tmp/f_antes.txt /tmp/f_despues.txt
      ```

      Repetir por cada fichero. **Sin diferencias en ninguno.**

- [ ] El número de argumentos de cada función no cambió. Comprobar la tabla del paso 1
      contra el código resultante.
- [ ] Las funciones que devolvían `null` siguen devolviendo `null`, y las que lanzaban
      siguen lanzando. Contraste manual contra la tabla.
- [ ] `VerificarUsuario` **no cambió**:

      ```bash
      git diff pre-refactor-app -- src/Utils/Usuario.js | grep -A5 "VerificarUsuario"
      ```

      No debe mostrar cambios dentro de su cuerpo.

- [ ] `wc -l src/Utils/*.js | tail -1` bajó respecto a las 942 líneas de la línea base.
- [ ] `sesion.js` intacto: `git diff --stat HEAD -- src/Utils/sesion.js` vacío.

## Criterio de finalización

Los siete checks en verde. Si el diff de firmas muestra **cualquier** diferencia, revertir
ese fichero: no merece la pena arriesgar la capa de red por ahorrar líneas.

```
refactor(04): unificar el patron repetido de las utilidades de red
```
