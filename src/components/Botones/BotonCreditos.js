import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useAppContext } from "../../context/AppProvider";
import { BingoColors } from "../../Theme/Colors";
export default function BotonCreditos() {
  const { user, partidaActual } = useAppContext();
  return (
    <View>
      <Button
        mode="contained"
        icon={"ticket"}
        style={{
          backgroundColor: BingoColors.primary,
          margin: 10,
          width: 120
        }}
        labelStyle={{ fontSize: 15, fontWeight: "bold" }}
      >
        {user.Creditos} Bs
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({});
