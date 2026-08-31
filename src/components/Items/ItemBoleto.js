import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BingoColors } from "../../Theme/Colors";
import { Text } from "react-native-paper";
export default function ItemBoleto({ boleto, setBoleto, abrir }) {
  return (
    <TouchableOpacity
      style={[{ width: "100%", alignItems: "center", marginVertical: 7 }]}
      onPress={() => {
        setBoleto(boleto);
        abrir();
      }}
      disabled={!!boleto.idUsuario}
    >
      <View style={boleto.idUsuario ? styles.bxClose : styles.bx}>
        <Text
          variant="titleMedium"
          style={[
            styles.txt,
            {
              color: boleto.idUsuario ? BingoColors.white : BingoColors.primary,
            },
          ]}
        >
          Nº SERIAL:{boleto.NroSerial}
        </Text>
        {boleto.idUsuario && (
          <Text
            variant="titleMedium"
            style={[styles.txt, { color: BingoColors.white, paddingLeft: 20 }]}
          >
            NO DISPONIBLE
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  bx: {
    width: "95%",
    backgroundColor: BingoColors.white,
    padding: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: BingoColors.primary,
    flexDirection: "row",
  },
  txt: {
    fontWeight: "bold",

    color: BingoColors.primary,
  },
  bxClose: {
    width: "95%",
    backgroundColor: BingoColors.secondary,
    padding: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: BingoColors.secondary,
    opacity: 0.8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
