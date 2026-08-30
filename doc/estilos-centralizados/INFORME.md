# Informe de cierre — centralización de estilos

**Rama:** `claude/app-refactoring-jhfen0` · **Punto de retorno:** tag `pre-estilos`
**Commits:** `6b21afc` (01) · `1bfa3a6` (02) · `03d6f95` + `7fec9e3` (03) · este (04)

---

## 1. Resumen

**Se completaron los niveles A y B.** La compuerta de la tarea 01 abrió: los snapshots
funcionaron, así que la tarea 03 —la única con riesgo real— se pudo hacer con red.

Cinco constantes en `src/Theme/estilosComunes.js` sustituyen a **50 declaraciones**
repartidas por 14 modales. Otras **37 declaraciones se borraron** sin sustituirlas por
nada, porque no las usaba nadie.

**Nada de lo que se ve en pantalla cambió**, y no es una promesa: cada valor extraído se
comprobó por hash contra su original en `pre-estilos`, fichero por fichero. **50 de 50
idénticos.**

La etapa encontró dos cosas que no buscaba, y ambas valen más que el ahorro de líneas:

1. **El plan contaba declaraciones idénticas y daba por hecho que eso significaba
   duplicación.** De las 51 declaraciones del "Nivel A", 37 no las referenciaba nadie. Eran
   idénticas justamente porque estaban muertas: nadie las ajustó nunca porque nadie las
   veía.
2. **La red de seguridad de la tarea 01 tenía un agujero que no se veía.** Cubría 12
   modales, pero solo 5 de los 12 que la tarea 03 iba a tocar, porque los otros 7 se montan
   con el modal **cerrado**. Se detectó midiendo la cobertura sobre el propio fichero
   `.snap`, no confiando en el número de tests.

Lo que **no** se hizo, y es deliberado: no se probó nada en un dispositivo. `npx expo
export` sigue bloqueado en este entorno. La sección 5 es el checklist que falta.

---

## 2. Antes y después

| Métrica | Antes (`pre-estilos`) | Después | Comando |
|---|---|---|---|
| Declaraciones de estilo en `src/` | 330 | **248** | AST (`medir-estilos.js`) |
| Retiradas de componentes | 0 | **87** | 50 extraídas + 37 muertas |
| Claves en `estilosComunes.js` | — (no existía) | **5** | |
| Ficheros con `StyleSheet.create` | 59 | 60 | `grep -rl "StyleSheet.create" src --include=*.js \| wc -l` |
| Claves declaradas y nunca usadas | **47** (14%) | **10** (4%) | AST (`estilos-muertos.js`) |
| Tests | 11 | **32** | `npx jest` |
| Snapshots | 0 | **21** | |

### Qué contiene `src/Theme/estilosComunes.js`

| Constante | Sustituye a | Ficheros | Hash |
|---|---|---|---|
| `textStyle` | `textStyle` | 14 | `135978ef5aad` |
| `botonCerrar` | `buttonClose`, variante posicionada | 12 | `cdb8466b2fe5` |
| `botonModal` | `button`, variante de modal | 12 | `24707036da3f` |
| `vistaCentrada` | `centeredView` sin margen | 6 | `31063633aa61` |
| `vistaCentradaConMargen` | `centeredView` con `marginRight: 7` | 6 | `165d31cc3727` |

---

## 3. El mapa de duplicación aparente vs real

> **Esta es la sección que hay que conservar.** Si dentro de seis meses alguien abre el
> proyecto, ve `bx` repetido 23 veces y decide "arreglarlo", va a descolocar 21 pantallas.

El nombre de un estilo no dice nada sobre su contenido. Medido por AST, agrupando por hash
del valor normalizado:

| Clave | Usos | Variantes | Grupo mayor | Veredicto |
|---|---|---|---|---|
| `bx` | 23 | **21** | 3 | **No centralizable.** No son 23 copias de un estilo: son 21 estilos distintos que se llaman igual |
| `title` | 23 | **14** | 6 | **No centralizable.** El grupo mayor son 6 de 23 |
| `container` | 10 | **10** | 1 | **No centralizable.** Cada uno es único. Duplicación real: cero |
| `modalView` | 15 | **9** | 3 | **No compensa.** Extraer un grupo de 3 y dejar 12 sueltos empeora la lectura |
| `modalContainer` | 5 | 5 | 1 | Ídem `container` |
| `input` | 4 | 4 | 1 | Cada uno único |
| `centeredView` | 15 | 4 | 6 + 6 | ✅ **Hecho**, como **dos** constantes |
| `buttonClose` | 14 | 2 | 12 | ✅ **Hecho** el grupo de 12; los 2 de boleto se quedan |
| `button` | 16 | 5 | 12 | ✅ **Hecho** el grupo de 12; las otras 4 variantes se quedan |
| `textStyle` | 14 | **1** | 14 | ✅ **Hecho** |

### La lección: `container`, `bx`

`container` aparece 10 veces y tiene 10 variantes. **La duplicación es exactamente cero.**
El nombre se repite porque es el nombre obvio para el `View` de fuera, no porque el estilo
se haya copiado. Lo mismo con `bx`, que es la convención local para lo mismo.

Buscar `container` y contar 10 resultados mide **la popularidad de un nombre**, no la
duplicación. La única medida que sirve es agrupar por el valor.

### El caso `centeredView`, como ejemplo de lo que NO hay que hacer

Quince usos, cuatro variantes. Los dos grupos grandes son de 6 y difieren **solo** en esto:

```js
// vistaCentrada (6 modales)          // vistaCentradaConMargen (6 modales)
{                                     {
  justifyContent: "center",             justifyContent: "center",
  alignItems: "center",                 alignItems: "center",
                                        marginRight: 7,      // <-- toda la diferencia
  position: "relative",                 position: "relative",
}                                     }
```

Es tentador decir "el `marginRight: 7` es claramente una errata" y dejar una sola constante.
**Sería un cambio de diseño disfrazado de limpieza**: movería 6 pantallas 7 píxeles a la
derecha, y aparecería en el diff como una constante menos, no como un cambio visual.

Por eso hay dos constantes, con nombres que dicen en qué se diferencian. El día que alguien
con un dispositivo delante decida que el margen sobra, las fusiona en un commit propio cuyo
asunto sea ese, y lo comprueba mirando la pantalla.

### La otra mitad: duplicación aparente por estilo muerto

De las 7 claves que la medición daba como "provablemente idénticas", **6 no las usaba
nadie**:

| Clave | Declaraciones | Referencias `styles.X` |
|---|---|---|
| `textStyle` | 14 | **14** |
| `Descripcion` | 9 | 0 |
| `modalText` | 9 | 0 |
| `rowItem` | 7 | 0 |
| `fecha` | 4 | 0 |
| `Encabezado` | 4 | 0 |
| `lista` | 4 | 0 |

Se copiaron junto con el componente y nunca se referenciaron. **Eran byte a byte idénticas
precisamente porque estaban muertas.** Un estilo vivo se retoca; uno muerto se queda
congelado en la forma en que se pegó.

Antes de borrarlas se descartó el acceso indirecto, que es lo único que invalidaría el
conteo por `grep`:

```bash
grep -rn "styles\["      src --include=*.js   # (ninguno)
grep -rn "\.\.\.styles"  src --include=*.js   # (ningun spread)
grep -rn "export.*styles" src --include=*.js  # (ninguno)
```

Sin acceso dinámico, sin spread y sin exportar el objeto, `styles.X` es la única forma de
llegar a una clave.

**Moraleja para la próxima medición:** antes de preguntar *"¿este estilo está duplicado?"*,
preguntar *"¿lo usa alguien?"*.

---

## 4. Estado de la red de seguridad

### Qué se mockeó — poco, y se dice cuál

**Un solo mock de terceros**, en `jest.setup.js`:

```js
jest.mock("expo-font/build/ExpoFontLoader", () => ({ ... getLoadedFonts: () => [] ... }));
```

`jest-expo@52` no trae ese mock nativo y `@expo/vector-icons` acaba llamando a
`getLoadedFonts()`, que llega `undefined` y revienta en un `.forEach`. Se mockea el módulo
nativo, no `expo-font` entero.

Dos mocks de código propio, cada uno con `requireActual` para el resto del módulo:

- `ObtenerPremiosPartida` — `ModalEditarPartida` la llama al montar; hace falta para que el
  render sea determinista.
- `useNavigation` de `@react-navigation/native` — `ModalBoleto` lo usa y el hook exige un
  `NavigationContainer` por encima.

**Lo que NO hizo falta mockear** es lo interesante. La cadena de errores del spike inicial
(`AccessibilityInfo`, `Appearance`, `Animated`) tenía **una sola** causa: `PaperProvider`
solo se suscribe a esos módulos nativos cuando **no** recibe un tema.

```js
// react-native-paper/src/core/PaperProvider.tsx
if (!props.theme) { subscription = addEventListener(AccessibilityInfo, ...); }
```

`App.js` sí le pasa un tema; el spike no. Replicar lo que hace la app real saltea los tres
efectos sin un solo mock — y es **más fiel** que mockearlos.

El segundo fallo, aparte: faltaba `unmount()` entre tests. Los efectos pendientes de un
modal se ejecutaban durante el test siguiente, y los componentes pasaban sueltos pero
fallaban en grupo.

### ¿El snapshot representa el componente real?

**Sí, con dos límites que conviene tener presentes.**

Se fotografía el componente real, con el tema real de la app; solo se sustituyen un módulo
nativo de fuentes, una llamada de red y un hook de navegación. No es un snapshot de mocks.

Los dos límites:

1. **`src/test-utils/render.js` duplica el tema de `App.js`.** Si alguien cambia el tema
   allí y no aquí, los snapshots seguirían pasando con un tema viejo. Para comparar el mismo
   componente antes y después de mover un estilo da igual —ambos lados usan el mismo tema—,
   pero para cualquier uso futuro como prueba de fidelidad visual **es una trampa**. Extraer
   el tema de `App.js` a un módulo compartido sería pequeño y seguro; no se hizo porque
   tocar `App.js` excede el alcance de esta etapa.
2. **Un snapshot compara árboles de React, no píxeles.** Detecta que una propiedad cambió;
   no dice si la pantalla se ve bien.

### Se comprobó dos veces que la red atrapa de verdad

No basta con que los snapshots pasen:

| Rotura provocada | Detectado |
|---|---|
| `marginRight: 7` → `8` en `ModalAgregarCredito` (tarea 01) | ✅ `- "marginRight": 7 / + "marginRight": 8` |
| `elevation: 2` → `3` en `ModalCodigoReferido` (tarea 03) | ✅ `- "elevation": 2 / + "elevation": 3` |

La segunda es la que importa: `ModalCodigoReferido` **solo** lo cubre la red ampliada en la
tarea 03. Ambas se restauraron con `git checkout` y volvieron a verde.

### El agujero que tenía la red, y cómo se encontró

La tarea 01 cerró con "12 modales cubiertos". Cierto, pero engañoso. Contando qué bloques
del `.snap` contienen cada estilo:

| Clave | Ficheros del grupo | Cubiertos tras la 01 | Tras ampliar |
|---|---|---|---|
| `centeredView` | 12 | 12 | 12 |
| `buttonClose` | 12 | **5** | **12** |
| `button` | 12 | **5** | **12** |

Siete de esos modales guardan `visible` en su **propio estado**: se montan cerrados y el
contenido del `Modal` —donde viven `button` y `buttonClose`— nunca llega al árbol. Los
cinco cubiertos eran justo aquellos a los que el test pasa `visible={true}` desde fuera.

`centeredView` se salvaba por ser el `View` envoltorio, que siempre se renderiza. Por eso la
prueba de la tarea 01 funcionó y aun así la red no valía para la 03.

Se cerró con `renderizarAbierto()` —monta el modal y pulsa su botón de apertura— más dos
snapshots nuevos para `ModalBoleto` y `ModalBoletoGanador`.

**La lección:** "12 tests en verde" no es una medida de cobertura. La medida es *qué
propiedades concretas aparecen en el fichero de snapshots*.

### Ruido conocido en la salida de `npx jest`

Tras el resumen en verde, Jest imprime un `TypeError: _bezier is not a function` de un timer
de `Animated` que se dispara después de terminar los tests. **Es anterior a esta etapa**
(comprobado guardando los cambios en un `stash` y volviendo a correr). No afecta al código
de salida (`exit=0`) ni a ningún test. Vale la pena limpiarlo algún día, pero no es un
fallo.

---

## 5. Checklist de verificación manual

**Sigue siendo necesaria.** Un snapshot compara árboles de React, no píxeles, y `expo
export` nunca llegó a ejecutarse en este entorno: no hay ni siquiera confirmación de que el
bundle compile.

Ordenado por lo que tocó la etapa:

- [ ] Abrir cada uno de los 14 modales modificados y confirmar que se ve centrado igual.
- [ ] La **X de cerrar** sigue en la esquina superior derecha en los 12 del grupo
      mayoritario: `ModalActivaTuCuenta`, `ModalAgregarCredito`, `ModalAgregarPartida`,
      `ModalAgregarPromocion`, `ModalCodigoReferido`, `ModalComoConseguirCredito`,
      `ModalComoFunciona`, `ModalComoRetirarCredito`, `ModalDetallesParticipante`,
      `ModalDetallesUsuario`, `ModalEditarPartida`, `ModalRetirarCredito`.
- [ ] `ModalBoleto` y `ModalBoletoGanador`: su X **no** está posicionada en absoluto.
      Confirmar que sigue donde estaba (no debería haberse movido: su `buttonClose` es
      local y no se tocó).
- [ ] Los 6 modales con `marginRight: 7` siguen con su margen, y los otros 6 sin él.
      *Si esto se ve mal, la tarea 03 fusionó variantes que no debía.*
- [ ] `ModalPrecio` sigue apareciendo desde abajo con su overlay oscuro (no se tocó, pero
      comparte el nombre `centeredView`).
- [ ] Los 4 modales informativos (`ActivaTuCuenta`, `ComoConseguirCredito`, `ComoFunciona`,
      `ComoRetirarCredito`) siguen mostrando su contenido completo. Son los que perdieron
      más declaraciones muertas: si alguna no lo estaba, se nota aquí.

---

## 6. Lo que sigue pendiente

### Descartado a propósito, no a medias

`bx` (21 variantes), `title` (14), `container` (10) y `modalView` (9) **no se tocaron, y
esa es la decisión correcta.** No hay duplicación que quitar; hay un nombre popular. Ver
sección 3 antes de volver a intentarlo.

### Candidatos reales que quedan

| Qué | Tamaño | Nota |
|---|---|---|
| Claves de 2 usos y 1 variante: `card`, `switchContainer`, `closeButtonContainer`, `filaContainer`, `serialContainer`, el `buttonClose` de boleto | 12 declaraciones | Fuera del alcance del plan, que se ceñía a las 7 claves medidas. Seguras por el mismo argumento que el Nivel A, pero con 2 usos el beneficio es pequeño |
| `animation` en los 4 modales informativos | 4 declaraciones | **Estilo muerto**, igual que las 37 que se borraron. Quedó fuera porque tiene 2 variantes y el plan solo cubría las de una |
| 10 claves declaradas y nunca usadas que quedan | 10 declaraciones | Ver abajo |

### Estilos muertos: de 47 a 10

Quedan 10 claves declaradas que nadie referencia:

```
components/Formularios/FormularioRegistro.js: button, buttonText
components/Modales/ModalEditarPartida.js:     Text, switchContainer
components/Modales/Modal{ActivaTuCuenta,ComoConseguirCredito,
                          ComoFunciona,ComoRetirarCredito}.js: animation
components/Botones/BotonCerrarSesion.js:      bx
screens/Login.js:                             helpButtom
```

**Un linter lo habría dicho desde el principio.** ESLint con `react-native/no-unused-styles`
detecta exactamente esto, y habría ahorrado la mitad del trabajo de esta etapa. Sigue sin
instalarse; es la recomendación más rentable que deja este informe.

### Un bug encontrado y no arreglado

`ModalAgregarPartida.js` y `ModalAgregarPromocion.js` usan `styles.button` **sin declararlo**
(tampoco en `pre-refactor-app`). React Native ignora los `undefined` en un array de estilos,
así que el botón de cerrar de esos dos modales no lleva el `borderRadius`/`padding`/
`elevation` que llevan los otros doce.

Arreglarlo cambiaría lo que se ve en pantalla, que es lo que esta etapa tenía prohibido.
Anotado en `doc/refactor-autonomo/HALLAZGOS.md`.

### Otras etapas

- **Estilos inline en JSX** (`style={{ margin: 10, width: "90%" }}`). No se midieron: el
  inventario solo miraba `StyleSheet.create`. Es una etapa propia.
- **Verificación en dispositivo.** Lo único que esta etapa no pudo hacer y sigue haciendo
  falta.
