import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import { useAppContext } from "../../context/AppProvider";
import {
  ObtenerPartidas,
  actualizarPartida,
  agregarPartida,
  crearObjetoPartida,
  eliminarPartida,
} from "../../Utils/Partida";
export default function BotonesAgregarPartida({
  Nro,
  Descripcion,
  Activo,
  setVisible,
  Terna,
  Cuarta,
  Fila,
  Lleno,
  MontoTerna,
  MontoCuarta,
  MontoFila,
  MontoLleno,
  promociones,
  costoBoleto
}) {
  const [loading, setLoading] = useState(false);
  const { setPartidas, setPartidaActual } = useAppContext();
  const ConfirmarAgregar = async () => {
    Alert.alert("Confirmación", "¿Esta seguro de agregar la Partida?", [
      {
        text: "NO",
        onPress: () => { },
      },
      {
        text: "SI",
        onPress: () => AgregarDatos(),
      },
    ]);
  };
  const validarDatos = () => {
    if (!Nro || !Descripcion || !costoBoleto || costoBoleto <= 0) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return true;
    }

    return false;
  };

  const AgregarDatos = async () => {
    if (validarDatos()) {
      return;
    }
    try {
      setLoading(true);
      const premios = {
        terna: {
          habilitado: Terna,
          monto: MontoTerna
        },
        cuarta: {
          habilitado: Cuarta,
          monto: MontoCuarta
        },
        fila: {
          habilitado: Fila,
          monto: MontoFila
        },
        lleno: {
          habilitado: Lleno,
          monto: MontoLleno
        },
      }
      const PartidaNuevo = crearObjetoPartida(Nro, Descripcion, Activo,costoBoleto);
      const response = await agregarPartida(PartidaNuevo, promociones, costoBoleto,premios);
      const Partidas = await ObtenerPartidas();
      setPartidas(Partidas);
      if (Partidas.length > 0) {
        setPartidaActual(Partidas[0]);
      } else {
        setPartidaActual({
          NroPartida: 0,
          Descripcion: "",
          Activo: "",
          CostoBoleto:0
        });
      }
      setVisible(false);
      setLoading(false);
      Alert.alert("Partida agregada", "Se agrego la partida correctamente");
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Ocurrio un error desconocido");
    }
  };
  return (
    <View
      style={{
        margin: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
      }}
    >
      {!loading ? (
        <>
          <IconButton
            icon={"content-save"}
            size={38}
            mode="outlined"
            onPress={ConfirmarAgregar}
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
