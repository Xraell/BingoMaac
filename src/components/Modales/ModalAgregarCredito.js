import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Pressable, View, TextInput } from "react-native";
import { ActivityIndicator, Button, IconButton, Text } from "react-native-paper";
// import { ObtenerUsuarios, eliminarUsuario } from "../utils/Usuario";
import { BingoColors } from "../../Theme/Colors";
import { useAppContext } from "../../context/AppProvider";
import { AgregarCreditosUsuario } from "../../Utils/Usuario";
import { estilosComunes } from "../../Theme/estilosComunes";
const ModalAgregarCredito = ({ usuario, visible, setVisible }) => {
  const [loading, setLoading] = useState(false);
  const { setListUsers,listUsers } = useAppContext();
  const [Membresia, setMembresia] = useState("VIGENTE");
  const [cantidad, setCantidad] = useState(0);
  const ConfirmarAgregar = async () => {
    Alert.alert(
      "Confirmación",
      `¿Esta seguro de agregar ${cantidad} en creditos a ${usuario.Nombres} ${usuario.Apellidos}?`,
      [
        {
          text: "NO",
          onPress: () => {},
        },
        {
          text: "SI",
          onPress: async () => {
            try {
              setLoading(true);
              const usuarioActualizado = await AgregarCreditosUsuario(usuario.id,cantidad)
              let list = listUsers.map((e)=>e.id==usuarioActualizado.id?usuarioActualizado:e)
              setListUsers(list);
              setVisible(false);
              setLoading(false);
              Alert.alert(
                "Creditos agregados",
                "Los creditos fueron agregados correctamente"
              );
            } catch (error) {
              setLoading(false);
              Alert.alert("Error", error.message ?? "Ocurrio un error desconocido");
            }
          },
        },
      ]
    );
  };
  return (
    <View style={estilosComunes.vistaCentradaConMargen}>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={estilosComunes.vistaCentradaConMargen}>
          <View style={styles.modalView}>
            <Pressable
              style={[estilosComunes.botonModal, estilosComunes.botonCerrar]}
              onPress={() => setVisible(false)}
            >
              <Text style={estilosComunes.textStyle}>X</Text>
            </Pressable>
            <Text variant="titleLarge" style={styles.title}>
              AGREGAR CREDITOS
            </Text>
            <Text variant="titleMedium" style={styles.Text}>
              ¿Cuánto de crédito desea agregar a {usuario.Nombres}{" "}
              {usuario.Apellidos} ?
            </Text>
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <IconButton
                icon={"minus-thick"}
                mode="outlined"
                onPress={() =>
                  setCantidad((prev) => (prev != 0 ? (prev -= 10) : prev))
                }
              ></IconButton>
              <TextInput
                inputMode="numeric"
                value={cantidad + ""}
                style={{
                  fontSize: 30,
                  marginHorizontal: 20,
                  fontWeight: "bold",
                }}
                onChangeText={(t) => setCantidad(t)}
              ></TextInput>
              <IconButton
                icon={"plus-thick"}
                mode="outlined"
                onPress={() => setCantidad((prev) => (prev += 10))}
              ></IconButton>
            </View>
            <View style={{ margin: 10 }}>
              {!loading ? (
                <Button mode="contained" onPress={ConfirmarAgregar}>
                  Agregar crédito
                </Button>
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
    textAlign: "center",
    width: "100%",
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
    marginTop: "60%",
    width: "90%",
  },
});

export default ModalAgregarCredito;
