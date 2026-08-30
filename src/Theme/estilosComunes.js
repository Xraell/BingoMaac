import { StyleSheet } from "react-native";
import { BingoColors } from "./Colors";

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

  // Boton de la "X" de cerrar. Identico en 12 modales.
  //
  // ModalBoleto y ModalBoletoGanador NO usan este: el suyo no lleva
  // `position: "absolute"` ni las coordenadas. Se parecen, pero uno esta
  // posicionado en absoluto y el otro no. Se quedan con el suyo local.
  botonCerrar: {
    backgroundColor: BingoColors.primary,
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 100,
    paddingHorizontal: 10,
  },

  // Base del boton de cerrar, que se compone con el anterior en un array:
  // style={[estilosComunes.botonModal, estilosComunes.botonCerrar]}.
  // Identico en 12 modales. Las otras 4 variantes de `button` del proyecto
  // (BotonFinalizarPartida, CreditosUsuario, FormularioRegistro, ModalMensaje)
  // son estilos distintos que se llaman igual, y se quedan donde estan.
  botonModal: {
    borderRadius: 10,
    padding: 3,
    elevation: 2,
  },

  // Envoltorio centrado del modal. Hay DOS constantes a proposito: 6 modales
  // llevan un `marginRight: 7` y otros 6 no. Son dos estilos distintos, no uno
  // con una errata: fusionarlos moveria 6 pantallas 7 pixeles. El dia que
  // alguien con un dispositivo delante decida que el margen sobra, los fusiona
  // en un commit propio y lo comprueba mirando la pantalla.
  vistaCentrada: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  vistaCentradaConMargen: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
    position: "relative",
  },
});
