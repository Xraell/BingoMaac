import { StyleSheet } from "react-native";

/**
 * Estilos compartidos por varios componentes.
 *
 * Aqui solo entra una clave cuyo valor es **byte a byte identico** en todos los
 * ficheros que la comparten. Dos variantes que difieren aunque sea en un pixel
 * son dos estilos distintos, no uno: fusionarlas seria una decision de diseño y
 * cambiaria lo que se ve en pantalla.
 *
 * Los valores se copian literales del original, sin reordenar propiedades ni
 * sustituir un hex por su constante de Colors.js. Eso es lo que permite
 * demostrar por hash que la extraccion no cambio nada.
 *
 * Ver doc/estilos-centralizados/.
 */
export const estilosComunes = StyleSheet.create({
  // Texto de la "X" que cierra los modales. Identico en 14 modales.
  textStyle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
});
