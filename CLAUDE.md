# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm install          # instalar dependencias
npm start            # expo start (Metro bundler)
npm run android      # expo start --android
npm run ios          # expo start --ios
npm run web          # expo start --web
```

Build de APK / producción con EAS (perfiles definidos en `eas.json`: `development`, `preview` → APK, `production`):

```bash
eas build --profile preview --platform android
```

No hay tests, linter ni TypeScript configurados en el proyecto. El código es JavaScript plano con JSX; no existe script de `lint` ni `test` en `package.json`.

## Arquitectura

App Expo / React Native (SDK 52, RN 0.76) de bingo en vivo de 90 bolas. El cliente **no tiene backend local**: todo el estado persistente vive en una API REST externa.

### Backend

Todos los módulos de `src/Utils/*.js` son wrappers `fetch` sobre `https://bingoservice.digitalrobert.digital/api/<recurso>`. Cada archivo declara su propia constante `UrlApi` en la línea 1 — **la URL base está duplicada en 8 archivos**; cambiarla implica editarlos todos (`Boleto`, `Compra`, `Ganador`, `Mensaje`, `Numero`, `Partida`, `Usuario`, `UsuarioPromocion`).

Convención de cada módulo: funciones `Obtener*` / `agregar*` / `actualizar*` / `eliminar*` más un `crearObjeto*` que arma el payload. Los `Obtener*` capturan el error y devuelven `null` (o lanzan, según el caso) en vez de propagarlo; los `agregar*` sí lanzan. Los nombres de funciones están en español y no siempre coinciden con el recurso — p. ej. `UsuarioPromocion.js` exporta `ObtenerNumeros`, `agregarNumero`, etc., copiados de `Numero.js`.

### Navegación y roles

No hay stack navigator raíz. El enrutado principal es un switch numérico sobre `opc` del contexto, en `src/screens/Controller.js`:

- `opc === 0` → `Login`
- `opc === 1` → `TabsUser` (Inicio · Boletos · MisBoletos · Perfil)
- `opc === 2` → `TabsAdmin` (Partida · Usuarios · Participantes · Créditos · Juego)

`BotonesLogin` decide el valor de `opc` según `user.Rol`, que puede ser `ADMIN`, `USER` o `GUEST`. La sesión se persiste guardando solo `idUsuario` en AsyncStorage; al arrancar se rehidrata con `ObtenerUsuario(id)`. El invitado (`src/components/Data/usuarioInvitado.js`, `Rol: "GUEST"`, `id: 0`) entra sin autenticar y ve `MensajeRegistrate` en lugar de boletos.

Cada tab navigator hace su propia carga inicial en un `useEffect` (partida actual, boletos del usuario, premios, promociones, listas de admin) y la vuelca al contexto global.

### Estado global

`src/context/AppProvider.js` es un único `useState`-store sin reducer, consumido con `useAppContext()`. Claves relevantes: `opc`, `user`, `partidaActual`, `partidas`, `misBoletos`, `listUsers`, `premios`, `promociones`, `promocion`, `tick` (flag que se conmuta para forzar recargas).

### El juego en vivo

No hay websockets: **admin y jugador se comunican solo a través de la API, y el jugador hace polling**.

Lado admin (`src/components/Conjunto/PartidaEnCurso.js`, el archivo más complejo del repo):

- Cada número cantado se hace POST con `agregarNumero` y se agrega al principio de `nrosRetirados`.
- El modo automático encadena `setTimeout` de 5 s vía `programarSiguienteNumero`, sorteando números 1–90 sin repetir y evitando repetir el último.
- Como los callbacks del timer viven fuera del ciclo de render, el estado se espeja en refs (`nrosRetiradosRef`, `automaticoRef`, `ganadores*Ref`, `isAddingNumber`, `ultimoNroAgregado`). **Al tocar este componente hay que actualizar tanto el estado como su ref**, o el modo automático leerá valores obsoletos.
- Tras cada número se llama a `obtenerGanadores`, que compara contra los refs y hace POST de los ganadores nuevos por premio. Si aparece un ganador, el modo automático se detiene solo.

**El número `-1` es un centinela de partida finalizada.** `BotonFinalizarPartida` hace `agregarNro(-1, true)` (el segundo argumento salta la validación de rango 1–90) y opcionalmente publica un `Mensaje` para los jugadores. Cualquier pantalla que lea los números de una partida debe filtrar/detectar `-1`: `PartidaEnCurso` aborta con alerta si lo encuentra al cargar, y `ListaMisBoletos` lo interpreta como "mostrar el modal de mensaje final". No confundirlo con `BotonTerminarPartida`, que solo sale de la vista sin cerrar la partida.

Lado jugador (`src/components/Conjunto/ListaMisBoletos.js`):

- Botón SINCRONIZAR: exige ≥ 2 boletos y que `partidaActual.Activo == 1`; arranca un `setInterval` de 11 s que consulta números y ganadores.
- Los premios ya anunciados se acumulan en `premiosYaAlertados` para no repetir el modal. Las claves de premio vienen del servidor en español con acentos: `"Cartón lleno"`, `"Línea"`, `"Cuarta"`, `"Terno"`.

### Boletos

Un boleto es un objeto plano con campos `Nro1`…`Nro15` (15 números) más `NroSerial`, `Precio`, `idPartida`, `idUsuario`. `ItemMiBoleto` lo renderiza como cartón 3×9 clásico: toma `Object.values(boleto).slice(4)` y ubica cada número en su columna según los rangos de `limites` (0–9, 10–19, …, 80–90), rellenando con `"-1"` las celdas vacías. **El `slice(4)` depende del orden de claves que devuelve la API**; si cambia la forma del objeto, este cálculo se rompe silenciosamente.

`TablaBingo` es la grilla de referencia 9×10 con los 90 números, coloreando los ya cantados; soporta pinch-zoom vía `react-native-gesture-handler`.

### Audio

`src/sounds/women/` contiene un `.wav` por número (1–90) más locuciones de evento (`bienvenido`, `bingo`, `linea`, `terno`, `cuarta`, sus variantes `Si`/`No`, `aplauso`, `terminado`, `nueva`). El mapa número → archivo está en `src/components/Data/soundFilesItemNro.js` con `require()` estáticos (Metro los necesita literales; no se puede construir la ruta dinámicamente).

`ItemNro` reproduce el sonido **solo cuando `index === 0`**, es decir el número más reciente de la lista, y descarga el `Audio.Sound` en el cleanup. Ese mismo `index === 0` también controla el tamaño destacado (120 px) del último número.

### Reportes Excel

`BotonExportarReporte` / `BotonExportarReporteNuevo` generan un `.xlsx` con `xlsx`, lo escriben en base64 con `expo-file-system` en `documentDirectory` y lo abren con `expo-sharing`. En Android se piden permisos de almacenamiento con `src/Utils/storagePermissions.js` (los permisos ya están declarados en `app.json`). El layout de la hoja se construye por columnas (10 por fila) manipulando un array de objetos `{A, B, C, …}` antes de `json_to_sheet`.

## Convenciones

- **Todo el dominio está en español**: nombres de componentes, funciones, variables, rutas de API y textos de UI. Mantener esa nomenclatura al agregar código.
- Estructura por tipo, no por feature: `components/{Botones,Modales,Items,Listas,Tablas,Conjunto,Formularios,Filtros,Accesorios,Mensajes,Animations,Data}`. `Conjunto/` agrupa los componentes compuestos grandes.
- UI con `react-native-paper` (tema en `App.js`), iconos `MaterialCommunityIcons`, paleta centralizada en `src/Theme/Colors.js` (`BingoColors`). Usar esas constantes en vez de literales hex.
- Patrón de pantalla recurrente: `View` con `backgroundColor: BingoColors.primary` que envuelve un `View` interior `styles.bx` con `backgroundColor: BingoColors.background` y `borderTopRightRadius: 40`.
- Las vistas alternan sub-secciones con estados numéricos locales (`opcJuego`, `opcBoleto`, `opcMisBoletos`) en el mismo estilo que `opc` global.
- Hay `console.log` de depuración por todo el código (varios con prefijo `🚀 ~`); es el estilo existente, no residuo accidental a limpiar salvo que se pida.
