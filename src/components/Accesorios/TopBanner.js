import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
export default function TopBanner() {
  return (
    <View style={styles.bx}>
      <Text variant="titleLarge" style={styles.title}>
        Bingo Maac{" "}
        <MaterialCommunityIcons
          name="star-shooting"
          size={20}
        />
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    backgroundColor: BingoColors.primary,
    paddingTop: 30,
    paddingBottom: 15,
    top: 0,
    width: "100%",
    borderBottomLeftRadius:40
  },
  title: { 
    fontWeight: "bold",
    textAlign: "center",
    color: BingoColors.white,
    justifyContent:'center',
    alignItems:'center'
  },
});
