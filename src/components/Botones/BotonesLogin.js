import { Alert, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { BingoColors } from "../../Theme/Colors";
import { useAppContext } from "../../context/AppProvider";
import { VerificarUsuario } from "../../Utils/Usuario";
import { apiFetch } from "../../Utils/http";
import { leerToken, borrarToken } from "../../Utils/sesion";
import { ROL_ADMIN } from "../../constants/roles";
export default function BotonesLogin({ correo, clave }) {
  const [cargando, setCargando] = useState(false);
  const { heightWindow, setUser, setMembresia ,setOpc} = useAppContext();
  useEffect(() => {
    verificarSession();
  }, []);
  const verificarSession = async () => {
    setCargando(true);
    try {
      const token = await leerToken();
      if (!token) {
        setCargando(false);
        return;
      }
      const usuario = await apiFetch("/usuario/me");
      setUser(usuario);
      setOpc(usuario.Rol === ROL_ADMIN ? 2 : 1);
    } catch (error) {
      // Token invalido o caducado: sesion limpia y al login.
      await borrarToken();
    }
    setCargando(false);
  };
  const Verificar = async () => {
    setCargando(true);
    try {
      const response = await VerificarUsuario(correo, clave);
      setUser(response)
      if(response.Rol==ROL_ADMIN){
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
