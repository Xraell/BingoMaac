import { StyleSheet, View } from "react-native";
import { BingoColors } from "../../Theme/Colors";
import Lottie from "lottie-react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
export default function MensajeRegistrate() {
    const navigation = useNavigation()
  return (
    <View style={styles.bx}>
      <View style={styles.bxMensaje}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={styles.bxAnimation}>
            <Lottie
              style={styles.animation}
              source={require("../Animations/register.json")}
              autoPlay
              loop
            />
          </View>
        </View>
        <Text variant="titleLarge" style={styles.title}>
        ¡Registrese y empiece a participar en nuestras partidas de Bingo clásico 90!
        </Text>
        <Text variant="bodyLarge" style={{ textAlign: "center" }}>
        Una vez registrado podrás apreciar nuestras galerías de Cartónes y seleccionar los que desee y así ganar uno de nuestros premios de Línea o Bingo (cartón lleno) 
        </Text>
        <Button
          mode="contained"
          style={{ marginVertical: 10 }}
          onPress={() => navigation.navigate("Perfil")}
        >
          REGISTRARSE
        </Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
  animation: {
    width: 70,
    height: 70,
  },
  bxMensaje: {
    backgroundColor: BingoColors.white,
    position: "relative",
    padding: 10,
    borderRadius: 10,
    paddingTop: 40,
    maxWidth: "90%",
  },
  bxAnimation: {
    backgroundColor: BingoColors.primary,
    borderRadius: 20,
    padding: 5,
    position: "absolute",
    top: -80,
  },
});
