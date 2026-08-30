import React, { useState } from "react";
import { Modal, StyleSheet, Pressable, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
const ModalActivaTuCuenta = () => {
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
              ACTIVA Y ABONA SALDO A SU CUENTA AQUÍ!
            </Text>
            <Text variant="titleMedium" style={styles.title}>
              Pago móvil 04141279671  {' \n'}CI. 16673304 Bancamiga (0172) 
             {' \n'}
              Otros métodos de pago preguntar por el icono de WhatsApp.
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
        ACTIVA Y ABONA SALDO A SU CUENTA AQUÍ!
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

export default ModalActivaTuCuenta;
