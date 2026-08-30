import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
  Image,
  Alert,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { BingoColors } from "../../Theme/Colors";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { useAppContext } from "../../context/AppProvider";
import { useNavigation } from "@react-navigation/native";
import { ObtenerBoletosUsuario } from "../../Utils/Boleto";
import { agregarcompra, crearObjetocompra } from "../../Utils/Compra";
import { ObtenerPartidaActual } from "../../Utils/Partida";
import { estilosComunes } from "../../Theme/estilosComunes";

// Subcomponente para una celda individual de Boleto
const CeldaBoleto = ({ numero, squareSize }) => {
  const renderCeldaContent = () => {
    if (numero > 0) {
      return <Text style={styles.numero} adjustsFontSizeToFit
        minimumFontScale={0.5} >{numero}</Text>;
    }
    return (
      <Image
        source={require("../../images/logo.png")}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[styles.bxNumero, { width: squareSize, height: squareSize }]}
    >
      {renderCeldaContent()}
    </TouchableOpacity>
  );
};

// Subcomponente para una fila de la tarjeta de Boleto
const FilaBoleto = ({ fila, squareSize }) => (
  <View style={styles.filaContainer}>
    {fila.map((numero, i) => (
      <CeldaBoleto key={i} numero={numero} squareSize={squareSize} />
    ))}
  </View>
);

// Subcomponente para la tarjeta de Boleto completa
const TarjetaBoleto = ({ boleto, filas, squareSize }) => (
  <View style={styles.Tarjeta}>
    <Text style={styles.tituloBoleto}>PROYECTO MAAC</Text>
    <ScrollView horizontal>
      <View style={{ flex: 1, flexDirection: "column" }}>
        {filas.map((fila, index) => (
          <FilaBoleto key={index} fila={fila} squareSize={squareSize} />
        ))}
      </View>
    </ScrollView>
    <View style={styles.serialContainer}>
      <Text style={styles.serialTexto}>SERIAL Nº {boleto.NroSerial}</Text>
    </View>
  </View>
);

// Componente principal: Modal de Boleto
const ModalBoleto = ({
  visible,
  setModalVisible,
  boleto,
  boletos,
  setBoletos,
}) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const squareSize = width / 9.4;
  const [filas, setFilas] = useState([]);
  const {
    user,
    setUser,
    misBoletos,
    setMisBoletos,
    setTick,
    partidaActual,
    setPartidaActual,
  } = useAppContext();
  const [comprando, setComprando] = useState(false);

  const limites = [
    [0, 9],
    [10, 19],
    [20, 29],
    [30, 39],
    [40, 49],
    [50, 59],
    [60, 69],
    [70, 79],
    [80, 90],
  ];

  useEffect(() => {
    if (boleto) {
      const numeros = Object.values(boleto).slice(4);
      const filasGeneradas = [];
      for (let i = 0; i < 3; i++) {
        const fila = [];
        let filaindex = 0;
        for (let j = 0; j < 9; j++) {
          if (
            numeros[i * 5 + filaindex] >= limites[j][0] &&
            numeros[i * 5 + filaindex] <= limites[j][1]
          ) {
            fila.push(numeros[i * 5 + filaindex]);
            filaindex++;
          } else {
            fila.push("-1");
          }
        }
        filasGeneradas.push(fila);
      }
      setFilas(filasGeneradas);
    }
  }, [boleto]);

  const obtenerMisBoletosDesdeServidor = async () => {
    try {
      const response = await ObtenerBoletosUsuario(user.id);
      setMisBoletos(response);
    } catch (error) {
      setMisBoletos([]);
    }
  };

  const registrarBoleto = async () => {
    const nuevaCompra = crearObjetocompra(
      boleto.Precio,
      user.id,
      `compra de boleto ${boleto.NroSerial}`
    );
    try {
      let responseCompra = await agregarcompra(nuevaCompra);

      const us = user;
      us.Creditos -= boleto.Precio;
      if (responseCompra[0].MontoDescuento > 0) {
        us.Creditos += responseCompra[0].MontoDescuento;
      }
      setUser(us);
      setBoletos(boletos.filter((item) => item.NroSerial !== boleto.NroSerial));

      if (responseCompra[0].boletosRecarga <= 0) {
        const mB = misBoletos;
        mB.push(boleto);
        setTick((prev) => !prev);
        setMisBoletos(mB);
      } else {
        obtenerMisBoletosDesdeServidor();
      }

      setComprando(false);

      if (responseCompra[0].MontoDescuento > 0 && responseCompra[0].boletosRegalo <= 0) {
        Alert.alert(
          "Éxito y Promoción obtenida",
          `¡El boleto se adquirió correctamente y también se te sumó ${responseCompra[0].MontoDescuento}Bs por alcanzar la promoción seleccionada!`
        );
      } else if (responseCompra[0].boletosRegalo > 0 && responseCompra[0].MontoDescuento > 0) {
        Alert.alert(
          "Éxito y Promoción obtenida",
          `¡El boleto se adquirió correctamente, se te sumó ${responseCompra[0].MontoDescuento}Bs y también se agregaron ${responseCompra[0].boletosRegalo} de regalo por alcanzar la promoción seleccionada!`
        );
      } else {
        Alert.alert("Éxito", "El boleto fue adquirido exitosamente.");
      }

      setModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Error",
        "Ocurrió un error desconocido, actualice la lista de boletos para comprobar que no fue adquirido por alguien más." + error
      );
    }
  };

  const confirmar = () => {
    Alert.alert("CONFIRMACIÓN", "¿Desea adquirir el boleto?", [
      {
        text: "NO",
      },
      {
        text: "SI",
        onPress: async () => {
          setComprando(true);
          const response = await ObtenerPartidaActual();
          if (response) {
            setPartidaActual(response);
          }

          if (response.Activo == 1) {
            setComprando(false);
            return Alert.alert(
              "Partida Ya Iniciada",
              "No es posible comprar boletos para una partida que ya ha comenzado."
            );
          }

          if (user.Creditos >= boleto.Precio) {
            return registrarBoleto();
          }

          setComprando(false);
          return Alert.alert(
            "Crédito insuficiente",
            "No cuenta con crédito suficiente para adquirir el boleto, recargue más por favor.",
            [
              {
                text: "Recargar",
                onPress: () => {
                  setModalVisible(false);
                  navigation.navigate("Perfil");
                },
              },
            ]
          );
        },
      },
    ]);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView]}>
          <View style={styles.closeButtonContainer}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={estilosComunes.textStyle}>X</Text>
            </Pressable>
          </View>

          <TarjetaBoleto
            boleto={boleto}
            filas={filas}
            squareSize={squareSize}
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.confirmButton}
              onPress={confirmar}
            >
              {comprando ? (
                <ActivityIndicator
                  size="small"
                  color={BingoColors.white}
                />
              ) : (
                "Obtener boleto"
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: BingoColors.white,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "98%",
  },
  closeButtonContainer: {
    width: "100%",
    alignItems: "flex-end",
    paddingRight: 10,
    marginBottom: 10,
  },
  button: {
    borderRadius: 10,
    padding: 3,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: BingoColors.primary,
    borderRadius: 100,
    paddingHorizontal: 10,
  },
  filaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bxNumero: {
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  numero: {
    padding: 5,
    fontWeight: "bold",
  },
  Tarjeta: {
    borderWidth: 2,
    width: "100%",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 5,
    borderColor: BingoColors.secondary,
  },
  tituloBoleto: {
    color: BingoColors.white,
    backgroundColor: BingoColors.secondary,
    textAlign: "center",
    fontWeight: "bold",
    padding: 5,
  },
  serialContainer: {
    width: "100%",
  },
  serialTexto: {
    textAlign: "left",
    paddingLeft: 10,
    fontWeight: "bold",
    borderRightWidth: 3,
    width: "40%",
  },
  buttonContainer: {
    marginTop: 10,
    width: "100%",
    alignItems: "flex-end",
  },
  confirmButton: {
    width: "50%",
  },
});

export default ModalBoleto;