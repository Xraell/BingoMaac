import { Alert, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BingoColors } from "../../Theme/Colors";
import { useAppContext } from "../../context/AppProvider";
import { usuarioInvitado } from "../Data/usuarioInvitado";
import { apiFetch } from "../../Utils/http";
import { borrarToken } from "../../Utils/sesion";
export default function BotonCerrarSesion({top=false}) {
  const { setOpc,setUser } = useAppContext();
  const salir = async () => {
    Alert.alert("Confirmación", "¿Esta seguro/a de cerrar sesión?", [
      {
        text: "NO",
        onPress: () => {},
      },
      {
        text: "SI",
        onPress: async () => {
          try {
            await apiFetch("/usuario/logout", { method: "POST" });
          } catch {
            // Sin red no se puede revocar; la sesion local se cierra igual.
          }
          await borrarToken();
          await AsyncStorage.removeItem("idUsuario");   // limpiar el rastro antiguo
          setUser(usuarioInvitado)
          setOpc(0);
        },
      },
    ]);
  };
  return (
    <View style={top?styles.bxT:{}}>
      <IconButton
        icon={"exit-to-app"}
        size={40}
        iconColor={BingoColors.black}
        onPress={salir}
      ></IconButton>
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  bxT: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
