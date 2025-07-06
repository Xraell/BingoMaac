import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { BingoColors } from "../../Theme/Colors";
import { Button, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { ObtenerTotalCreditos } from "../../Utils/Usuario";
export default function Creditos() {
    const [total,setTotal]= useState(0)
    useEffect(()=>{
        obtenerTotal()
    },[])
    const obtenerTotal = async ()=>{
        const response = await ObtenerTotalCreditos();
        setTotal(response.suma_creditos)
        Alert.alert("Exito","La sumatoria de bolivares se sincronizó")
    }
  return (
    <View style={{ flex: 1, backgroundColor: BingoColors.primary }}>
      <View style={styles.bx}>
        <View style={{backgroundColor:BingoColors.white,marginVertical:20,marginHorizontal:10,borderRadius:10,padding:10}}>
            <Text variant="titleLarge" style={{fontWeight:'bold',color:BingoColors.black}}>Sumatoria de Bolivares de todos los usuarios registrados:</Text>
            <Text variant="displayMedium" style={{fontWeight:'bold',color:BingoColors.primary,padding:5,textAlign:'center'}}>{total} Bs</Text>
        </View>
        <Button mode="contained" icon={'reload'} style={{margin:10}} onPress={obtenerTotal}>ACTUALIZAR</Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    flex: 1,
    backgroundColor: BingoColors.background,
    borderTopRightRadius: 40,
    justifyContent: "space-between",
  },
});
