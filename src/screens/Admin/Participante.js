import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import { Button } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import { useAppContext } from "../../context/AppProvider";
import { ObtenerReportePartida } from "../../Utils/Boleto";
import TablaParticipantes from "../../components/Tablas/TablaParticipantes";
import ModalDetallesParticipante from "../../components/Modales/ModalDetallesParticipante";
import BotonExportarReporte from "../../components/Botones/BotonExportarReporte";

export default function Participante() {
  const { user,partidaActual } = useAppContext();
  const [listaInternaUsuarios, setListaInternaUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(user);
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    obtenerListaParticipantes();
  }, []);

  const obtenerListaParticipantes = async () => {
    setLoading(true);
    try {
      const reporte = await ObtenerReportePartida(partidaActual.id);
      setListaInternaUsuarios(reporte);
      Alert.alert("Datos cargados", "Los participantes fueron cargandos correctamente.")
    } catch (error) {
      console.error("Error al actualizar participantes:", error);
      Alert.alert("Error", "Ha ocurrido un error al actualizar los participantes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: BingoColors.primary, flex: 1 }}>
      <View style={styles.bx}>
        <Text
          style={{
            fontSize: 22,
            margin: 10,
            color: BingoColors.primary,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Participantes del sorteo Nº{partidaActual.NroPartida}
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color={BingoColors.accent} />
        ) : (
          <TablaParticipantes listaFiltrada={listaInternaUsuarios} abrirModal={()=>setVisible(true)} setUsuario={setUsuarioSeleccionado} />
        )}
        <View >
          <Button
            style={{ marginHorizontal: 15 }}
            mode="contained"
            icon="reload"
            onPress={obtenerListaParticipantes}
          >
            ACTUALIZAR
          </Button>
          <BotonExportarReporte />
        </View>
      </View>
      <ModalDetallesParticipante setVisible={setVisible} visible={visible} usuario={usuarioSeleccionado}  />
    </View>
  );
}

const styles = StyleSheet.create({
  bx: {
    flex: 1,
    backgroundColor: BingoColors.background,
    borderTopRightRadius: 30,
    justifyContent: "space-between",
  },
});
