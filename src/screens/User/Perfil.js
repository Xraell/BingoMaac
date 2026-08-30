import { StyleSheet, View } from "react-native";
import { BingoColors } from "../../Theme/Colors";
import FormularioRegistro from "../../components/Formularios/FormularioRegistro";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppProvider";
import PerfilUsuario from "../../components/Conjunto/PerfilUsuario";
import CreditosUsuario from "../../components/Conjunto/CreditosUsuario";
export default function Perfil() {
  const { user } = useAppContext();
  const [opcUser, setOpcUser] = useState(true);
  useEffect(() => {
    setOpcUser(user.Rol == "GUEST");
  }, [user]);
  return (
    <View style={{ flex: 1, backgroundColor: BingoColors.primary }}>
      <View style={styles.bx}>
        {opcUser ? (
          <FormularioRegistro></FormularioRegistro>
        ) : (
          <>
            <PerfilUsuario></PerfilUsuario>
            <CreditosUsuario></CreditosUsuario>
          </>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    flex: 1,
    backgroundColor: BingoColors.background,
    borderTopRightRadius: 40,
    justifyContent:'space-between'
  },
});
