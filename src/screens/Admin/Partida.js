import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { BingoColors } from "../../Theme/Colors";
import { Button, Text } from "react-native-paper";
import { useAppContext } from "../../context/AppProvider";
import Tablapartidas from "../../components/Tablas/TablaPartidas";
import { useEffect, useState } from "react";
import ModalEditarPartida from "../../components/Modales/ModalEditarPartida";
import ModalAgregarPartida from "../../components/Modales/ModalAgregarPartida";
import { ReiniciarBoletos } from "../../Utils/Boleto";
import ModalPrecio from "../../components/Modales/ModalPrecio";
import { actualizarPartida } from "../../Utils/Partida";

export default function Partida() {
  const { partidaActual, partidas,setPartidaActual,setPartidas } = useAppContext();
  const [partidaSeleccionada, setPartidaSeleccionada] = useState(partidaActual);
  const [visible, setVisible] = useState(false);
  const [tick,setTick]= useState(false)
  const [modalPrecioVisible, setModalPrecioVisible] = useState(false); 
  const [Activo,setActivo]= useState(partidaActual.Activo==1)
  const solicitarPrecio = () => {
    setModalPrecioVisible(true); 
  };
  useEffect(() => {
    setActivo(partidaActual.Activo==1)
  }, [partidaActual])
  useEffect(() => {
    setActivo(partidaActual.Activo==1)
  }, [tick])
  const cambiarEstado = async ()=>{
    const partAct = partidaActual
    partAct.Activo= partidaActual.Activo==1?0:1
    await actualizarPartida(partAct, partidaActual.id)
    setPartidas((prev)=>{
      return prev.map((e)=>e.id==partidaActual.id ?partAct:e)
    })
    
    setPartidaActual(partAct)
    setTick((prev)=>!prev)
  }
  const cargarBoletosPartida = async (Precio) => {
    Alert.alert(
      "Confirmación",
      "¿Esta seguro de cargar los boletos para esta partida?(Todos los boletos se reiniciaran a la partida actual y estarás disponibles para su compra)",
      [
        {
          text: "NO",
          onPress: () => {},
        },
        {
          text: "SI",
          onPress: async () => {
            const response = await ReiniciarBoletos(partidaActual.id,Precio);
            if (!response) {
              return Alert.alert(
                "Error",
                "No se pudo actualizar los boletos por un error desconocido"
              );
            }
            Alert.alert("Exito", "Los boletos fueron actualizados correctamente");
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: BingoColors.primary }}>
      <View style={styles.bx}>
        <ModalAgregarPartida></ModalAgregarPartida>
        <Tablapartidas
          lista={partidas}
          setPartida={setPartidaSeleccionada}
          abrirModal={() => setVisible(true)}
        ></Tablapartidas>
        {
          partidaActual.id> 0?<>
          <Text
          variant="titleLarge"
          style={{ textAlign: "center", fontWeight: "bold", margin: 10 }}
        >
          PARTIDA ACTUAL Nº{partidaActual.NroPartida}
        </Text>
        <Button
          mode="contained"
          icon={Activo ? "stop" : "play"}
          style={{ margin: 10 }}
          onPress={cambiarEstado}
        >
          {Activo ? "DETENER PARTIDA" : "ACTIVAR PARTIDA"}
        </Button>
        <Button
          mode="elevated"
          icon={"upload"}
          style={{ margin: 10 }}
          onPress={()=>cargarBoletosPartida(partidaActual.CostoBoleto)}
        >
          REINICIAR BOLETOS
        </Button>
        <ModalEditarPartida
          setVisible={setVisible}
          visible={visible}
          partida={partidaSeleccionada}
        ></ModalEditarPartida>
        </> :<></>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bx: {
    flex: 1,
    backgroundColor: BingoColors.background,
    borderTopRightRadius: 40,
  },
});