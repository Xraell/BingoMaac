import { Alert, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { BingoColors } from "../../Theme/Colors";
import { useAppContext } from "../../context/AppProvider";
import { ObtenerUsuario, VerificarUsuario } from "../../Utils/Usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function BotonesLogin({ correo, clave }) {
  const [cargando, setCargando] = useState(false);
  const { heightWindow, setUser, setMembresia ,setOpc} = useAppContext();
  useEffect(() => {
    verificarSession();
  }, []);
  const verificarSession = async () => {
    // await AsyncStorage.clear()
    setCargando(true);
    try {
      const idUsuario = await AsyncStorage.getItem("idUsuario");
      console.log("idUsuario: ", idUsuario);
      if (idUsuario !== null) {
        return verificarUsuarioPorID(idUsuario);
      }
      setCargando(false);
    } catch (error) {}
  };
  const verificarUsuarioPorID = async (id) => {
    try {
      const response = await ObtenerUsuario(id);
      console.log("response: ", response);
      setUser(response);
      if(response.Rol == "ADMIN"){
        return setOpc(2)
      }
      if (response.Rol == "USER") {
        setUser(response)
        return setOpc(1)
        
      }
      verificarMembresia(response.id);
    } catch (error) {
      setCargando(false);
    }
  };
  const Verificar = async () => {
    setCargando(true);
    try {
      const response = await VerificarUsuario(correo, clave);
      await AsyncStorage.setItem("idUsuario",response.id.toString());
      console.log("response.id.toString(): ", response.id.toString());
      setUser(response)
      if(response.Rol=="ADMIN"){
        return setOpc(2)
      }
      return setOpc(1)
    } catch (error) {
      Alert.alert(
        "Inicio de sesión fallido",
        "Correo o contraseña incorrectos"
      );
    }
    setCargando(false);
  };

  return (
    <View style={[styles.bx, { height: heightWindow * 0.2 }]}>
      <Button
        mode="elevated"
        icon={"email"}
        style={[styles.btn]}
        onPress={Verificar}
      >
        {cargando ? (
          <ActivityIndicator animating={true} color={BingoColors.primary} />
        ):(
          "INGRESAR"
        )}
      </Button>
      <Button
        mode="contained"
        icon={"account"}
        style={styles.btn}
        onPress={() => setOpc(1)}
      >
        INGRESAR COMO INVITADO
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    justifyContent: "start",
    gap: 20,
  },
  btn: {
    fontSize: 35,
    marginHorizontal: "10%",
  },
});
