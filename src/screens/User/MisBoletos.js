import { StyleSheet, View } from "react-native";
import MensajeRegistrate from "../../components/Mensajes/MensajesRegistrate";
import { BingoColors } from "../../Theme/Colors";
import { useAppContext } from "../../context/AppProvider";
import { useEffect, useState } from "react";
import ListaMisBoletos from "../../components/Conjunto/ListaMisBoletos";
export default function MisBoletos() {
  const { user } = useAppContext();
  const [opcMisBoletos,setOpcMisBoletos]= useState(0)
  useEffect(() => {
    if(user.Rol=="USER"){
      return setOpcMisBoletos(2)
    }
    return setOpcMisBoletos(1)
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: BingoColors.primary }}>
      <View style={styles.bx}>
        {
          opcMisBoletos ==1 && <MensajeRegistrate></MensajeRegistrate>
        }
        {
          opcMisBoletos ==2 && <ListaMisBoletos></ListaMisBoletos>
        }
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
