import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { BingoColors } from "../Theme/Colors";
import { IconButton } from "react-native-paper";
import { useState } from "react";
import { useAppContext } from "../context/AppProvider";
import BotonesLogin from "../components/Botones/BotonesLogin";
import FormularioLoging from "../components/Formularios/FormularioLoging";
export default function Login() {
  const { heightWindow } = useAppContext();
  const [clave, setClave] = useState("");
  const [email, setEmail] = useState("");
  return (
    <View style={styles.bx}>
      <View style={{ height: heightWindow * 0.8 }}>
        <FormularioLoging C={clave} setC={setClave} E={email} setE={setEmail}></FormularioLoging>
      </View>
      <BotonesLogin correo={email} clave={clave}></BotonesLogin>
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    backgroundColor: BingoColors.tertiary,
    flex: 1,
    justifyContent: "space-between",
  },
  helpButtom: {
    position: "absolute",
    right: 5,
    top: 30,
    zIndex: 1000,
  },
});
