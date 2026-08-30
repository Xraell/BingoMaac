# Hallazgos

Bugs y rarezas detectados durante el refactor. **No se arreglan en esta etapa** — un
refactor que además corrige un bug es imposible de revisar, y aquí no hay tests que
respalden el arreglo.

El agente añade entradas y sigue trabajando. Alimenta la sección 5 del informe final.

## Bugs

_(vacío — el plan no ha empezado)_

## Rarezas

Conocidas al redactar el plan, pendientes de confirmar durante la ejecución:

- **Manejo de errores inconsistente en `src/Utils/`.** Unas funciones devuelven `null` al
  fallar y otras relanzan el error. La tarea 05 del plan de seguridad pedía unificarlo,
  pero hacerlo cambia cómo reaccionan las pantallas: una que hoy recibe `null` y muestra
  una lista vacía pasaría a recibir una excepción no capturada.
- **Mezcla de `==` y `===`** en las comparaciones de rol. Con `Rol` siempre string el
  resultado es el mismo, pero si llegara `null` o `undefined` los operadores difieren.
- **`ItemMiBoleto.js:46` depende del orden de las claves** del objeto de la API
  (`Object.values(boleto).slice(4)`). Si el backend reordena sus campos, muestra números
  equivocados sin dar error.
- **`ItemNro.js` dispara el audio con `index === 0`.** Si esa condición deja de cumplirse,
  simplemente no suena.

## Deuda técnica

- **`src/components/Data/usuarioInvitado.js` sigue con el literal `Rol: "GUEST"`** en vez
  de la constante `ROL_GUEST` de `src/constants/roles.js` (tarea 05). El documento de la
  tarea lo permitía si no generaba import circular, pero el fichero está dentro de
  `src/components/Data/`, zona prohibida en general para esta etapa — se dejó como
  literal por prudencia en vez de evaluar caso por caso si de verdad habría ciclo. Cambio
  trivial y de riesgo bajo para quien retome esto con capacidad de probar en dispositivo.
- **`src/Utils/storagePermissions.js` quedó huérfano tras la tarea 03.** Su única función
  exportada (`requestStoragePermission`) no se llamaba desde ningún sitio (ni siquiera
  antes del refactor: el import en `BotonExportarReporte.js` ya estaba sin usar en la
  línea base). Al quitar ese import muerto y luego la función muerta, el fichero quedó
  reducido a un solo `import` sin ningún uso — no lo importa nadie más. No se borró el
  fichero en esta sesión: el plan de la tarea 03 cubre imports, variables y funciones
  muertas dentro de un fichero, no decidir si borrar un fichero entero, y esa es una
  llamada algo mayor que prefiero dejar para revisión humana. Candidato claro a borrado.
- **No hay tests ni linter.** Es la carencia más importante del proyecto y la razón de que
  este plan sea tan conservador. Instalar Jest y `@testing-library/react-native` exige
  cambiar dependencias y configurar Babel: necesita supervisión.
- **`package-lock.json` sigue versionado** pese a la migración a pnpm. `expo-doctor` avisa
  con "Multiple lock files detected". Borrarlo es decisión de quien hizo la migración.
- **`src/config/api.js` mantiene `https://<dominio-real>/api`** como placeholder. Un build
  de producción hoy apuntaría a una URL inexistente.
- **`PartidaEnCurso.js` espeja estado en refs** (39 usos). Funciona, pero es frágil: al
  tocarlo hay que actualizar tanto el estado como su ref.
