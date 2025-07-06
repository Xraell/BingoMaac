import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import * as Linking from "expo-linking";
export default function RedesSociales() {
  const redireccionar = (url) => {
    Linking.openURL(url);
  };
  return (
    <View>
      <Text style={styles.title} variant="titleLarge">
        NUESTRAS REDES SOCIALES
      </Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={()=>redireccionar("https://www.instagram.com/proyectomaacoficial?igsh=MXA3bXlzbjN4ZHNnOA==")}>
          <Image
            style={styles.img}
            source={require("../../images/instagram.png")}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>redireccionar("https://www.tiktok.com/@proyectomaacoficial?_t=8kab0dJv046&_r=1")}>
          <Image
            style={styles.img}
            source={require("../../images/tiktok.png")}
          ></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={()=>redireccionar("https://api.whatsapp.com/send/?phone=584141279671&app_absent=0")}>
          <Image
            style={styles.img}
            source={require("../../images/whats.png")}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>redireccionar("https://www.facebook.com/profile.php?id=61551837091425&mibextid=ZbWKwL")}>
          <Image
            style={styles.img}
            source={require("../../images/facebook.png")}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    marginHorizontal: 30,
  },
  img: {
    width: 110,
    height: 110,
  },
});
