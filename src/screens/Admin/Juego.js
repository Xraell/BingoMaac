import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { BingoColors } from "../../Theme/Colors";
import { Button, Text } from "react-native-paper";
import { useAppContext } from "../../context/AppProvider";
import { useEffect, useState } from "react";
import PartidaEnCurso from "../../components/Conjunto/PartidaEnCurso";
import BotonCerrarSesion from "../../components/Botones/BotonCerrarSesion";
export default function Juego() {
  const { partidaActual, partidas } = useAppContext();
  const [opcJuego, setOpcJuego] = useState(0);
  const iniciarPartida = () => {
    if (partidaActual.Activo == 1) {
      setOpcJuego(1);
    } else {
      Alert.alert(
        "PARTIDA INACTIVA",
        "No se puede inicar la partida ya que esta se encuentra inactiva."
      );
    }
  };
  useEffect(() => {
    if (!partidaActual.id > 0) {
      setOpcJuego(2);
    } else {
      setOpcJuego(0);
    }
  }, [partidaActual]);

  return (
    <View style={{ flex: 1, backgroundColor: BingoColors.primary }}>
      <View style={styles.bx}>
        {opcJuego == 0 && (
          <>
            <Button
              mode="contained"
              icon={"play"}
              style={{ margin: 20 }}
              onPress={iniciarPartida}
            >
              INICIAR PARTIDA Nº {partidaActual.NroPartida}
            </Button>
            <BotonCerrarSesion></BotonCerrarSesion>
          </>
        )}
        {opcJuego == 1 && (
          <PartidaEnCurso volver={() => setOpcJuego(0)}></PartidaEnCurso>
        )}
        {opcJuego == 2 && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              variant="titleMedium"
              style={{
                fontWeight: "bold",
                textAlign: "center",
                marginHorizontal: 20,
              }}
            >
              No se tiene ninguna partida registrada para poder iniciar
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    flex: 1,
    backgroundColor: BingoColors.background,
    borderTopRightRadius: 40,
    justifyContent: "center",
  },
});
