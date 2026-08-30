import React, { useState } from "react";
import { Modal, StyleSheet, Pressable, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import { estilosComunes } from "../../Theme/estilosComunes";
const ModalComoRetirarCredito = () => {
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
              <Text style={estilosComunes.textStyle}>X</Text>
            </Pressable>
            <Text variant="titleLarge" style={styles.title}>

              ¿COMO RETIRAR CREDITO?
            </Text>
            <Text variant="titleMedium" style={styles.title}>
              Debe ir al icono de inicio en la app y realizar la solicitud del saldo que desea retirar por el icono de WhatsApp, con su nombre y apellido con el cual se registró en la app y sus datos bancarios de pago movil. En un máximo de 24 horas su dinero estará en su cuenta bancaria.
            </Text>
          </View>
        </View>
      </Modal>

      <Button
        mode="outlined"
        textColor={BingoColors.black}
        style={{ width: "100%" }}
        onPress={() => setModalVisible(!visible)}
        icon={"help-circle"}
      >
        ¿COMO RETIRAR CREDITO?
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  animation: {
    width: "100%",
    height: 200,
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
});

export default ModalComoRetirarCredito;
