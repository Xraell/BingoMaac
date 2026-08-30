import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import BotonCreditos from "../Botones/BotonCreditos";
import { Button, Text } from "react-native-paper";
import { useAppContext } from "../../context/AppProvider";
import { BingoColors } from "../../Theme/Colors";
import { useEffect, useState } from "react";
import { ObtenerBoletosAleatorios } from "../../Utils/Boleto";
import ItemBoleto from "../Items/ItemBoleto";
import ModalBoleto from "../Modales/ModalBoleto";
import ModalInicioPartida from "../Modales/ModalInicioPartida";
import MetaPromocion from "../Accesorios/MetaPromocion";

export default function ListaBoletos() {
  const { partidaActual } = useAppContext();
  const [listaBoletos, setListaBoletos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para el spinner
  const [visible, setModalVisible] = useState(false);
  const [boletoSeleccionado, setBoletoSeleccionado] = useState({
    Nro1: "1",
    Nro10: "31",
    Nro11: "32",
    Nro12: "41",
    Nro13: "25",
    Nro14: "7",
    Nro15: "55",
    Nro2: "4",
    Nro3: "7",
    Nro4: "9",
    Nro5: "11",
    Nro6: "12",
    Nro7: "22",
    Nro8: "18",
    Nro9: "14",
    NroSerial: 1,
    Precio: 80,
    idPartida: 0,
    idUsuario: 1,
  });

  useEffect(() => {
    cargarBoletos();
  }, []);

  const cargarBoletos = async () => {
    try {
      setLoading(true); // Mostrar el spinner
      const response = await ObtenerBoletosAleatorios(partidaActual.id);
      setListaBoletos(response);
    } finally {
      setLoading(false); // Ocultar el spinner
    }
  };

  return (
    <View style={styles.bx}>
      <ModalInicioPartida></ModalInicioPartida>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

        <BotonCreditos />
        <MetaPromocion></MetaPromocion>
      </View>
      {listaBoletos ? <><ModalBoleto
        visible={visible}
        setModalVisible={setModalVisible}
        boleto={boletoSeleccionado}
        boletos={listaBoletos}
        setBoletos={setListaBoletos}
      />
        <Text variant="titleLarge" style={styles.title}>
          Boletos disponibles para la partida Nº{partidaActual.NroPartida}
        </Text>
        <Text variant="titleLarge" style={styles.subTtitle}>
          {partidaActual.Descripcion}
        </Text>
        {loading ? ( // Mostrar el spinner si está cargando
          <ActivityIndicator size="large" color={BingoColors.primary} style={{ marginTop: 20 }} />
        ) : (
          <ScrollView>
            {listaBoletos.map((e) => (
              <ItemBoleto
                key={e.NroSerial}
                abrir={() => setModalVisible(true)}
                boleto={e}
                setBoleto={setBoletoSeleccionado}
              />
            ))}
          </ScrollView>
        )}
        <Button
          mode="elevated"
          icon={"autorenew"}
          style={{ margin: 15 }}
          onPress={cargarBoletos}
          disabled={loading} // Deshabilitar el botón mientras se está cargando
        >
          ACTUALIZAR BOLETOS
        </Button>
      </>
        : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant="titleLarge" style={{ color: BingoColors.primary, fontWeight: 'bold' }}>No hay boletos disponibles.</Text>
        </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  bx: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    marginTop: 15,
  },
  subTtitle: {
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
    color: BingoColors.primary,
    opacity: 0.9,
    marginHorizontal: 10,
    borderRadius: 5,
  },
});
