import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { BingoColors } from "../../Theme/Colors";
import { Button, Text } from "react-native-paper";

// Subcomponente para una celda individual de Bingo
const CeldaBingo = ({ numero, squareSize, numerosPartida }) => {
  const renderCeldaContent = () => {
    if (numero > 0) {
      return <Text style={styles.numero} adjustsFontSizeToFit
      minimumFontScale={0.5}>{numero}</Text>;
    }
    return (
      <Image
        source={require("../../images/logo.png")}
        resizeMode="cover"
        style={{ width: squareSize, height: squareSize }}
      />
    );
  };

  return (
    <View style={[styles.bxNumero, { width: squareSize, height: squareSize }]}>
      {renderCeldaContent()}
      {numerosPartida.includes(Number(numero)) && (
        <View style={styles.marcadorXContainer}>
          <Text style={styles.marcadorX}>X</Text>
        </View>
      )}
    </View>
  );
};

// Subcomponente para una fila de la tarjeta de Bingo
const FilaBingo = ({ fila, squareSize, numerosPartida }) => (
  <View style={styles.filaContainer}>
    {fila.map((numero, i) => (
      <CeldaBingo 
        key={i} 
        numero={numero} 
        squareSize={squareSize} 
        numerosPartida={numerosPartida} 
      />
    ))}
  </View>
);

// Subcomponente para la tarjeta de Bingo completa
const TarjetaBingo = ({ ganador, filas, squareSize, numerosPartida }) => (
  <View style={styles.Tarjeta}>
    <Text style={styles.tituloBingo}>PROYECTO MAAC</Text>
    {filas.map((fila, index) => (
      <FilaBingo 
        key={index} 
        fila={fila} 
        squareSize={squareSize} 
        numerosPartida={numerosPartida} 
      />
    ))}
    <View style={styles.serialContainer}>
      <Text style={styles.serialTexto}>
        SERIAL Nº {ganador.NroSerial}
      </Text>
    </View>
  </View>
);

// Componente principal: Modal de Boleto Ganador
const ModalBoletoGanador = ({ visible, setModalVisible, ganador, numerosPartida }) => {
  const [filas, setFilas] = useState([]);
  const { width } = useWindowDimensions();
  const squareSize = width / 9.4;

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
    if (ganador) {
      const numeros = Object.values(ganador).slice(4);
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
  }, [ganador]);

  return (
    <Modal 
      animationType="slide" 
      transparent={true} 
      visible={visible} 
      style={{ backgroundColor: "transparent" }}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView]}>
          <View style={styles.closeButtonContainer}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>X</Text>
            </Pressable>
          </View>
          
          <Text
            variant="titleLarge"
            style={styles.tituloGanador}
          >
            Usuario ganador
          </Text>
          
          <View style={styles.infoContainer}>
            <Text
              variant="titleMedium"
              style={styles.infoGanador}
            >
              Nombre: {ganador.Nombres}
            </Text>
            
            <Text
              variant="titleMedium"
              style={styles.infoGanador}
            >
              Apellido: {ganador.Apellidos}
            </Text>
          </View>
          
          <TarjetaBingo 
            ganador={ganador} 
            filas={filas} 
            squareSize={squareSize} 
            numerosPartida={numerosPartida} 
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  filaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bxNumero: {
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  numero: {
    fontSize: 22,
    padding: 5,
    fontWeight: "bold",
  },
  marcadorXContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  marcadorX: {
    fontSize: 40,
    fontWeight: "bold",
    color: BingoColors.primary,
    opacity: 0.7,
  },
  Tarjeta: {
    borderWidth: 2,
    width: "100%",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 5,
    borderColor: BingoColors.secondary,
  },
  tituloBingo: {
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
    width: "35%",
  },
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
    shadowColor: "#00000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  textStyle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  tituloGanador: {
    fontWeight: "bold",
    color: BingoColors.black,
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  infoGanador: {
    width: "100%", 
    margin: 2,
  }
});

export default ModalBoletoGanador;