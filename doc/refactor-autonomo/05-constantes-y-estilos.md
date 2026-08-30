# 05 — Extraer literales repetidos

**Riesgo:** Bajo · **Depende de:** [04](04-utils-duplicados.md)

## Objetivo

Sacar a constantes los literales que se repiten por todo el código, sin cambiar ni un
valor.

## Por qué

Hay cadenas mágicas repartidas por decenas de ficheros. Las más frecuentes son los roles:

```js
user.Rol == "ADMIN"
user.Rol == "USER"
user.Rol == "GUEST"
```

Aparecen en `BotonesLogin.js`, `TabsUser.js`, `Boletos.js`, `Perfil.js`, `MisBoletos.js` y
más. Un error de tecleo (`"Admin"`, `"ADMlN"`) no lo detecta nadie: la comparación
simplemente da falso y la pantalla no aparece. Es un fallo silencioso más.

También hay 59 ficheros con `StyleSheet.create` y colores repetidos, aunque ya existe
`src/Theme/Colors.js`.

## La regla

**Los valores no cambian. Solo se les pone nombre.**

`"ADMIN"` sigue siendo exactamente `"ADMIN"`. Si una constante tuviera un valor distinto
al literal que sustituye, la comparación cambiaría de resultado — y eso es cambio de
comportamiento, que aquí está prohibido.

## Pasos

### 1. Constantes de rol

Crear `src/constants/roles.js`:

```js
export const ROL_ADMIN = "ADMIN";
export const ROL_USER = "USER";
export const ROL_GUEST = "GUEST";
```

Sustituir las comparaciones:

```js
// Antes
if (user.Rol == "ADMIN")

// Despues
if (user.Rol == ROL_ADMIN)
```

**Conservar el operador tal cual.** El código usa `==` en unos sitios y `===` en otros.
Cambiar `==` por `===` es tentador y es un cambio de comportamiento: si `Rol` llegara como
`null` o `undefined`, los dos operadores difieren. Anotarlo en `HALLAZGOS.md` y no tocarlo.

### 2. Verificar que se sustituyeron todos

```bash
grep -rn '"ADMIN"\|"USER"\|"GUEST"' src --include=*.js
```

Tras la tarea, solo debe aparecer en `src/constants/roles.js`. **Con una excepción
importante:** `usuarioInvitado.js` define `Rol: "GUEST"` como parte de un objeto de datos.
Ahí también se puede usar la constante, pero si genera un import circular, **dejarlo como
literal** y anotarlo.

### 3. Colores repetidos

`src/Theme/Colors.js` ya existe. Buscar colores hexadecimales escritos a mano:

```bash
grep -rn "#[0-9a-fA-F]\{6\}" src --include=*.js | grep -v "src/Theme/"
```

Sustituir **solo** los que coincidan exactamente con un color ya definido en `Colors.js`.

**No inventar entradas nuevas en la paleta.** Si un color no está en `Colors.js`, se queda
como literal: decidir que dos tonos parecidos son "el mismo" es una decisión de diseño, no
de refactor, y un cambio de color es visible — exactamente lo que este plan prohíbe.

### 4. Qué NO extraer

- **Textos de interfaz.** Extraerlos a un fichero de cadenas es el primer paso hacia i18n,
  y eso es un proyecto propio con decisiones de producto detrás.
- **Los estilos de `StyleSheet.create`.** Unificarlos exige decidir qué es "el mismo
  estilo", y cualquier error es visible en pantalla. Fuera de alcance.
- **Rutas de la API.** Están inlineadas en `apiFetch(...)` desde la tarea 01 del plan de
  seguridad, que lo dejó así a propósito. Volver a extraerlas contradiría esa decisión.
- **Números mágicos** de layout y tiempos. Nombrarlos exigiría entender qué representan, y
  equivocarse en uno de `PartidaEnCurso.js` rompe la partida.

## Verificación automática

- [ ] `npx expo export` en verde.
- [ ] **Los valores son idénticos.** Comprobación mecánica: extraer los valores de las
      constantes nuevas y confirmar que coinciden byte a byte con los literales que
      sustituyen.

      ```bash
      grep -oE '"[A-Z]+"' src/constants/roles.js | sort -u
      ```

      Debe dar exactamente `"ADMIN"`, `"GUEST"`, `"USER"`.

- [ ] **Los operadores no cambiaron:**

      ```bash
      git diff HEAD -- src/ | grep "^[+-].*Rol" | grep "==="
      ```

      Si aparece un `===` añadido donde antes había `==`, revertir ese cambio.

- [ ] El número de comparaciones de rol es el mismo que antes:

      ```bash
      grep -rc "Rol ==\|Rol===" src --include=*.js | awk -F: '{s+=$2} END {print s}'
      ```

      Igual que en la línea base. Si bajó, se perdió una comparación por el camino.

- [ ] Las zonas prohibidas siguen sin tocarse (mismo check de la tarea 03).
- [ ] El bundle no creció respecto a la línea base.

## Criterio de finalización

Los seis checks en verde.

```
refactor(05): extraer los literales de rol a constantes
```
