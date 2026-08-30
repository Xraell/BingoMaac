# 03 — Imports sin usar y código muerto

**Riesgo:** Bajo · **Depende de:** [02](02-limpiar-logs.md)

## Objetivo

Eliminar imports que ya no se usan, variables asignadas y nunca leídas, y funciones
exportadas que nadie llama.

## Por qué

El proyecto lleva tres etapas de cambios (dependencias, migración de SDK, seguridad) y cada
una dejó restos. La etapa de seguridad, en particular, eliminó funciones enteras
—`verificarUsuarioPorID` en `BotonesLogin.js`— y reescribió `src/Utils/`, así que es
probable que queden `import` de cosas que ya no existen o ya no se usan.

Sin linter, esto no lo detecta nadie. `expo export` compila igual con imports sobrantes.

## El riesgo real: los efectos de importar

Un import sin usar **no siempre es inofensivo**. En JavaScript, importar un módulo ejecuta
su código de nivel superior. Quitar un import puede eliminar un efecto secundario del que
algo dependía.

En React Native esto pasa con:

- **Polyfills** y módulos que se importan solo por su efecto (`import 'react-native-gesture-handler'`).
- **Registros de componentes** o de manejadores.
- **Hojas de estilo** o assets importados por su lado.

**Regla:** si un import no tiene nombre (`import 'algo';` sin `from`), **no se toca nunca**.
Y si un import con nombre no aparece en el resto del fichero pero el módulo suena a
infraestructura, se deja y se anota.

## Pasos

### 1. Imports sin usar

Para cada fichero, comprobar que cada símbolo importado aparece en el cuerpo:

```bash
# Por fichero, para cada simbolo importado, contar apariciones fuera de la linea de import
```

Casos típicos que se encontrarán:

- `import { Text } from "react-native"` donde ya no se usa `Text`.
- `import React from "react"` — **este se deja**. Con el JSX transform moderno puede no
  hacer falta, pero quitarlo depende de la configuración de Babel y no compensa el riesgo.
- `useState` o `useEffect` importados y no usados tras un cambio.

**Solo quitar símbolos que no aparecen ni una vez** en el resto del fichero. Buscar como
palabra completa: `Text` no debe confundirse con `TextInput`.

### 2. Variables asignadas y nunca leídas

```js
const [cargando, setCargando] = useState(false);   // si 'cargando' nunca se lee
```

**Cuidado:** en un destructuring de `useState`, quitar el primero cambia la posición del
segundo. Si `cargando` no se usa pero `setCargando` sí, **no se puede borrar sin más** —
hay que dejar el hueco. En ese caso, dejarlo como está y anotarlo.

### 3. Funciones exportadas que nadie llama

En `src/Utils/`, comprobar cada `export` contra el resto del proyecto:

```bash
grep -rn "nombreDeLaFuncion" src --include=*.js | grep -v "src/Utils/"
```

Si no aparece fuera de su propio fichero, es candidata a borrar. **Dos excepciones:**

- `crearObjetoUsuario` y similares, que pueden usarse dentro del propio `Utils/`.
- Cualquier función cuyo nombre aparezca en un string (llamadas dinámicas). Improbable
  aquí, pero se comprueba.

**Ante la mínima duda, no borrar.** El coste de dejar una función muerta es cero; el de
borrar una que se usa es una pantalla rota que nadie verá hasta la prueba manual.

### 4. Qué no tocar

- **Las zonas prohibidas del README**, en su totalidad.
- **`src/components/Data/`** — `soundFilesItemNro.js` y `paises.js` son tablas de datos.
  Que una entrada no se referencie explícitamente no significa que no se use: pueden
  indexarse dinámicamente.
- **Los assets** (`src/images/`, `src/sounds/`). Se referencian por `require()` y a menudo
  de forma dinámica.

## Verificación automática

- [ ] `npx expo export` en verde.
- [ ] **El bundle no creció.** Comparar con los 5.47 MB de la línea base. Si creció, algo
      raro pasó: revertir.
- [ ] Ningún import sin nombre desapareció:

      ```bash
      git diff HEAD -- src/ | grep "^-import" | grep -v "from"
      ```

      Sin salida. Son los imports por efecto secundario.

- [ ] Las zonas prohibidas no se tocaron:

      ```bash
      git diff --stat HEAD -- src/components/Conjunto/PartidaEnCurso.js \
        src/components/Items/ItemMiBoleto.js src/components/Items/ItemNro.js \
        src/Utils/sesion.js src/Utils/http.js
      ```

      Vacío.

- [ ] `grep -rn "^import React" src/ | wc -l` no bajó: no se quitó ningún `import React`.

## Criterio de finalización

Los cinco checks en verde. Lo dudoso, anotado en `HALLAZGOS.md` y sin tocar.

```
refactor(03): eliminar imports sin usar y codigo muerto
```
