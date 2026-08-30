import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Pressable, View } from "react-native";
import { ActivityIndicator, IconButton, Text } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import { ObtenerUsuarios, eliminarUsuario } from "../../Utils/Usuario";
import { useAppContext } from "../../context/AppProvider";
const ModalDetallesUsuario = ({ usuario, visible, setVisible }) => {
  const [loading, setLoading] = useState(false);
  const { setListUsers } = useAppContext();
  const ConfirmarEliminar = async () => {
    Alert.alert(
      "Confirmación",
      "¿Esta seguro de eliminar todos los registros del usuario? (Se eliminarán sus boletos y participaciones)",
      [
        {
          text: "NO",
          onPress: () => {},
        },
        {
          text: "SI",
          onPress: async () => {
            try {
                setLoading(true)
              const del = await eliminarUsuario(usuario.id);
              const usuarios = await ObtenerUsuarios();
              setListUsers(usuarios);
              setVisible(false)
              setLoading(false)
              Alert.alert(
                "Usuario eliminado",
                "Los registros del usuario fueron eliminados permanentemente"
              );
            } catch (error) {
                setLoading(false)
              Alert.alert("Error", "Ocurrio un error desconocido");
            }
          },
        },
      ]
    );
  };
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
            <Text variant="titleMedium" style={styles.Text}>
              Teléfono:{usuario.Telefono}
            </Text>
            <Text variant="titleMedium" style={styles.Text}>
              Credito disponible:{usuario.Creditos}
            </Text>
            <View style={{ margin: 10 }}>
              {!loading ? (
                <IconButton
                  icon={"delete"}
                  size={38}
                  mode="outlined"
                  onPress={ConfirmarEliminar}
                  style={{ borderRadius: 10 }}
                ></IconButton>
              ) : (
                <ActivityIndicator
                  size={40}
                  color={BingoColors.black}
                ></ActivityIndicator>
              )}
            </View>
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

export default ModalDetallesUsuario;
