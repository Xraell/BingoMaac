import { StyleSheet, Text, View } from "react-native";
import { BingoColors } from "../../Theme/Colors";
import ModalComoFunciona from "../../components/Modales/ModalComoFunciona";
import RedesSociales from "../../components/Accesorios/RedesSociales";
export default function Inicio() {
  return (
    <View style={{flex:1,backgroundColor: BingoColors.primary}}>
      <View style={styles.bx}>
        <RedesSociales></RedesSociales>
        <ModalComoFunciona></ModalComoFunciona>
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
