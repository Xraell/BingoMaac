import { StyleSheet, View } from "react-native";
import { BingoColors } from "../../Theme/Colors";
import ModalComoFunciona from "../../components/Modales/ModalComoFunciona";
import RedesSociales from "../../components/Accesorios/RedesSociales";
import ModalActivaTuCuenta from "../../components/Modales/ModalActivaTuCuenta";
export default function Inicio() {
  return (
    <View style={{flex:1,backgroundColor: BingoColors.primary}}>
      <View style={styles.bx}>
        <RedesSociales></RedesSociales>
        <ModalComoFunciona></ModalComoFunciona>
        <ModalActivaTuCuenta></ModalActivaTuCuenta>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    flex: 1,
    backgroundColor: BingoColors.background,
    borderTopRightRadius:40
  },
});
