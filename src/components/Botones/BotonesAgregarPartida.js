import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import { useAppContext } from "../../context/AppProvider";
import { ObtenerPartidas, actualizarPartida, crearObjetoPartida, eliminarPartida } from "../../Utils/Partida";
export default function BotonesEditarPartida({
  idPartida,
  Nro,
  Descripcion,
  Activo,
  setVisible
}) {
  const [loading, setLoading] = useState(false);
  const { setPartidas } = useAppContext();
  const ConfirmarActualizar = async () => {
    Alert.alert("Confirmación", "¿Esta seguro de editar el Partida?", [
      {
        text: "NO",
        onPress: () => {},
      },
      {
        text: "SI",
        onPress: ()=>actualizarDatos(),
      },
    ]);
  };
  const validarDatos = () => {
    if (!Nro ||  !Descripcion) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return true;
    }

    return false;
  };

  const actualizarDatos = async () => {
    if (validarDatos()) {
      return;
    }
    try {
      setLoading(true);
      const PartidaNuevo = crearObjetoPartida(Nro,Descripcion,Activo
      );
      PartidaNuevo.id = idPartida;
      const response = await actualizarPartida(PartidaNuevo, idPartida);
      const Partidas = await ObtenerPartidas();
      setPartidas(Partidas);
      setVisible(false);
      setLoading(false);
      Alert.alert(
        "Partida actualizada",
        "Los registros de la partida fueron actualizados correctamente"
      );
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Ocurrio un error desconocido");
    }
  };
  const ConfirmarEliminar = async () => {
    Alert.alert(
      "Confirmación",
      "¿Esta seguro de eliminar todos los registros de la partida? (Se eliminarán los registros de ganadores y participaciones)",
      [
        {
          text: "NO",
          onPress: () => {},
        },
        {
          text: "SI",
          onPress: async () => {
            try {
              setLoading(true);
              const del = await eliminarPartida(idPartida);
              const Partidas = await ObtenerPartidas();
              setPartidas(Partidas);
              setVisible(false);
              setLoading(false);
              Alert.alert(
                "Partida eliminada",
                "Los registros de la partida fueron eliminados permanentemente"
              );
            } catch (error) {
              setLoading(false);
              Alert.alert("Error", "Ocurrio un error desconocido");
            }
          },
        },
      ]
    );
  };
  return (
    <View
      style={{
        margin: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        width:'100%'
      }}
    >
      {!loading ? (
        <>
          <IconButton
            icon={"delete"}
            size={38}
            mode="outlined"
            onPress={ConfirmarEliminar}
            style={{ borderRadius: 10 }}
          ></IconButton>
          <IconButton
            icon={"content-save-edit"}
            size={38}
            mode="outlined"
            onPress={ConfirmarActualizar}
            style={{ borderRadius: 10 }}
          ></IconButton>
        </>
      ) : (
        <ActivityIndicator
          size={40}
          color={BingoColors.black}
        ></ActivityIndicator>
      )}
    </View>
  );
}
const styles = StyleSheet.create({});
