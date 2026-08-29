import React, { useState, useEffect, useContext } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
} from "react-native";
import { ActivityIndicator, Button, Switch, Text } from "react-native-paper";
import { useAppContext } from "../../context/AppProvider";
import { BingoColors } from "../../Theme/Colors";
const ModalComoFunciona = () => {
  const [visible, setModalVisible] = useState(false);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        style={{}}
        transparent={true}
        visible={visible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>X</Text>
            </Pressable>
            <Text variant="titleLarge" style={styles.title}>
              ¿COMO FUNCIONA LA APP BINGO MAAC?
            </Text>
            <Text variant="titleMedium" style={styles.title}>

              Está es una app para jugar Bingo Clásico 90, dónde usted podrá realizar su recarga de dinero y posterior a tener saldo a favor podrá adquirir cartónes para la jugada más próxima a realizar, en esta app cuenta con una trasmisión en vivo de la extracción de números de manera aleatoria la cual podrá apreciar en el momento de ejecución de la partida, sus cartones se irán tachando de forma automática hasta que se termine la jugada, también cuenta con un tabla de 90 números los cuales también se van tachando según van saliendo. ¡ No sé pierda de nuestras partidas recargue y adquiera sus cartones ya mismo !..
            </Text>
          </View>
        </View>
      </Modal>

      <Button
        mode="outlined"
        textColor={BingoColors.black}
        style={{ margin: 10, width: "90%" }}
        onPress={() => setModalVisible(!visible)}
        icon={"help-circle"}
      >
        ¿COMO FUNCIONA LA APP BINGO MAAC?
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  animation: {
    width: "100%",
    height: 200,
  },
  fecha: {
    fontWeight: "bold",
    width: "95%",
    textAlign: "center",
    padding: 6,
    borderRadius: 5,
    marginVertical: 5,
  },
  Descripcion: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    textAlign: "center",
  },
  rowItem: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  Encabezado: {
    borderRadius: 5,
    padding: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: BingoColors.secondary,
    marginTop: 10,
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    marginHorizontal: 10,
    fontWeight: "900",
    color: BingoColors.black,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  modalView: {
    backgroundColor: BingoColors.white,
    position: "relative",
    borderRadius: 20,
    paddingVertical: 10,
    paddingTop: 20,
    paddingHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 300,
    marginTop: "40%",
    maxHeight: '90%',
    width: "92%",
  },
  button: {
    borderRadius: 10,
    padding: 3,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: BingoColors.primary,
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 100,
    paddingHorizontal: 10,
  },
  textStyle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  lista: {
    width: "100%",
  },
});

export default ModalComoFunciona;
