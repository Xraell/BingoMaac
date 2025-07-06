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
  ScrollView,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Switch,
  Text,
} from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
const ModalDetallesParticipante = ({ usuario, visible, setVisible }) => {
  const [listaNros, setListaNros] = useState([]);
  useEffect(() => {
    if(usuario.numeros_serial){
      
    const nros = usuario.numeros_serial.split(",");
    setListaNros(nros);
    }
  }, [usuario]);

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.textStyle}>X</Text>
            </Pressable>
            <Text variant="titleLarge" style={styles.title}>
              DETALLES DEL USUARIO
            </Text>
            <Text variant="titleMedium" style={styles.Text}>
              Nombre:{usuario.Nombres}
            </Text>
            <Text variant="titleMedium" style={styles.Text}>
              Apellido:{usuario.Apellidos}
            </Text>
            <Text
              variant="titleMedium"
              style={{ marginVertical: 10, paddingLeft: 20, width: "100%" }}
            >
              Boletos comprados
            </Text>
            <ScrollView style={{width:'100%'}}>
              
            {listaNros.map((e,index) => (
              <Text
                key={e}
                variant="titleMedium"
                style={{ width: "100%", paddingLeft: 20 }}
              >{index+1}:
                Nº SERIAL:{e}
              </Text>
            ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  title: {
    marginTop: 10,
    textAlign: "center",
    marginHorizontal: 10,
    fontWeight: "900",
    color: BingoColors.black,
  },
  Text: {
    marginTop: 10,
    paddingHorizontal: 20,
    fontWeight: "900",
    color: BingoColors.primary,
    textAlign: "left",
    width: "100%",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
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
    marginTop: "50%",
    width: "90%",
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
});

export default ModalDetallesParticipante;
