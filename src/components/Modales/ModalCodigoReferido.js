import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";

const ModalCodigoReferido = () => {
  const [visible, setModalVisible] = useState(false);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
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
              ¿CÓMO FUNCIONA EL CÓDIGO DE REFERIDO?
            </Text>
            <Text style={styles.bodyText}>
              Cada usuario recibe un código único que puede compartir con otras personas.
              Cuando alguien usa tu código para registrarse, ambos obtienen beneficios.
            </Text>
            <Text style={styles.bodyText}>
              Tú recibirás un porcentaje de cada recarga o compra que esa persona realice dentro de la app.
            </Text>
            <Text style={styles.bodyText}>
              ¡Invita a tus amigos y empieza a ganar créditos hoy mismo!
            </Text>
          </View>
        </View>
      </Modal>

      <Button
        mode="outlined"
        textColor={BingoColors.white}
        
        style={{ width: "100%",backgroundColor:BingoColors.primary }}
        onPress={() => setModalVisible(!visible)}
        icon={"information"}
      >
        ¿CÓMO FUNCIONA EL CÓDIGO DE REFERIDO?
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
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
    maxHeight: "60%",
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
  title: {
    marginTop: 20,
    textAlign: "center",
    marginHorizontal: 10,
    fontWeight: "900",
    color: BingoColors.black,
  },
  bodyText: {
    marginTop: 10,
    fontSize:18,
    color: BingoColors.black,
  },
});

export default ModalCodigoReferido;
