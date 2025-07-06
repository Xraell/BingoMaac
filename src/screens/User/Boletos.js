import { StyleSheet, Text, View } from "react-native";
import { BingoColors } from "../../Theme/Colors";
import MensajeRegistrate from "../../components/Mensajes/MensajesRegistrate";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppProvider";
import ListaBoletos from "../../components/Conjunto/ListaBoletos";
import ModalInicioPartida from "../../components/Modales/ModalInicioPartida";
export default function Boletos() {
  const {user}= useAppContext()
  const [opcBoleto,setOpcBoleto]= useState(false)
  useEffect(() => {
    setOpcBoleto(user.Rol=="GUEST")
  },[user]);
  return (
    <View style={{ flex: 1, backgroundColor: BingoColors.primary }}>
      <View style={styles.bx}>
        {opcBoleto?(<MensajeRegistrate></MensajeRegistrate>):(<ListaBoletos></ListaBoletos>)}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    flex: 1,
    backgroundColor: BingoColors.background,
    borderTopRightRadius: 40,
  },
});
