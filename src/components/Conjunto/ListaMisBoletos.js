import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  PanResponder,
  Animated,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import { useAppContext } from "../../context/AppProvider";
import ItemMiBoleto from "../Items/ItemMiBoleto";
import { ObtenerNumerosPartida } from "../../Utils/Numero";
import {
  ObtenerPartida,
  ObtenerPartidaActual,
  ObtenerPartidas,
} from "../../Utils/Partida";
import ListaNrosRetirados from "../Listas/ListaNrosRetirados";
import TablaBingo from "./TablaBingo";
import { ObtenerMensajePartida } from "../../Utils/Mensaje";
import ModalMensaje from "../Modales/ModalMensaje";
import { ObtenerGanadoresPorPartida } from "../../Utils/Ganador";
import ModalGanadores from "../Modales/ModalGanadores";

export default function ListaMisBoletos() {
  const [sincronizado, setSincronizado] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msjVisible, setMsjVisible] = useState(false)
  const [mensajeP, setMensajeP] = useState({ "audio": 0, "descripcion": "", "idMensaje": 0, "idPartida": 0, "titulo": "" })
  const { misBoletos, setMisBoletos, partidaActual, tick, setPartidaActual } =
    useAppContext();
  const [numerosRetirados, setNumerosRetirados] = useState([]);
  const [numerosFormateados, setNumerosFormateados] = useState([]);
  const [topHeight, setTopHeight] = useState(200);
  const [middleHeight, setMiddleHeight] = useState(200);
  const [bottomHeight, setBottomHeight] = useState(200);
  const totalHeight = 700; // Total available height
  const minSectionHeight = 100; // Minimum height for any section

  const topPan = useRef(new Animated.Value(0)).current;
  const bottomPan = useRef(new Animated.Value(0)).current;

  const [ganadores, setGanadores] = useState({
    "Premio": "",
    "Nombres": []
  });
  const [ganadoresResponse, setGanadoresResponse] = useState({})
  const [premiosYaAlertados,setPremiosYaAlertados] = useState([])
  const [modalGanadoresVisible, setModalGanadoresVisible] = useState(false);
  const topPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newTopHeight = Math.max(
          minSectionHeight,
          Math.min(totalHeight - 2 * minSectionHeight, topHeight + gestureState.dy)
        );
        const remainingHeight = totalHeight - newTopHeight;
        const newMiddleHeight = Math.max(
          minSectionHeight,
          Math.min(remainingHeight - minSectionHeight, middleHeight)
        );

        topPan.setValue(gestureState.dy);
        setMiddleHeight(newMiddleHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        const newTopHeight = Math.max(
          minSectionHeight,
          Math.min(totalHeight - 2 * minSectionHeight, topHeight + gestureState.dy)
        );
        setTopHeight(newTopHeight);
        topPan.setValue(0);
      },
    })
  ).current;

  // Bottom drag handle pan responder
  const bottomPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newBottomHeight = Math.max(
          minSectionHeight,
          Math.min(totalHeight - topHeight - minSectionHeight, bottomHeight - gestureState.dy)
        );
        const newMiddleHeight = totalHeight - topHeight - newBottomHeight;

        if (newMiddleHeight >= minSectionHeight) {
          bottomPan.setValue(gestureState.dy);
          setMiddleHeight(newMiddleHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const newBottomHeight = Math.max(
          minSectionHeight,
          Math.min(totalHeight - topHeight - minSectionHeight, bottomHeight - gestureState.dy)
        );
        setBottomHeight(newBottomHeight);
        bottomPan.setValue(0);
      },
    })
  ).current;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ganadoresData = await ObtenerGanadoresPorPartida(partidaActual.id)
        setGanadoresResponse(ganadoresData)
        verificarGanadoresParaAlertar(ganadoresData)
        const response = await ObtenerNumerosPartida(partidaActual.id);
        const soloNumeros = response.map(item => item.Nro)
          .filter(num => num !== undefined);
        if (soloNumeros.includes(-1)) {
          const mensaje = await ObtenerMensajePartida(partidaActual.id)
          if (mensaje) {
            setSincronizado(false)
            setMensajeP(mensaje)
            setMsjVisible(true)
          }
        } else {

          setNumerosRetirados(response);
          setNumerosFormateados(soloNumeros);
        }


      } catch (error) {
        console.error("Error al obtener números:", error);
      }
    };

    if (sincronizado) {
      fetchData();
      const intervalId = setInterval(fetchData, 11000);
      return () => clearInterval(intervalId);
    } else {
      setNumerosRetirados([]);
      setNumerosFormateados([]);
    }
  }, [sincronizado, partidaActual.id]);
  const verificarGanadoresParaAlertar = (ganadoresData) => {
    setPremiosYaAlertados((prevPremiosYaAlertados) => {
      if (ganadoresData) {
        const nuevosPremios = [...prevPremiosYaAlertados];
  
        if (!nuevosPremios.includes("Cartón lleno") && ganadoresData["Cartón lleno"]) {
          nuevosPremios.push("Cartón lleno");
          setGanadores({
            Premio: "Cartón lleno",
            Nombres: ganadoresData["Cartón lleno"],
          });
          setModalGanadoresVisible(true);
        } else if (!nuevosPremios.includes("Línea") && ganadoresData.Línea) {
          nuevosPremios.push("Línea");
          setGanadores({
            Premio: "Línea",
            Nombres: ganadoresData.Línea,
          });
          setModalGanadoresVisible(true);
        } else if (!nuevosPremios.includes("Cuarta") && ganadoresData.Cuarta) {
          nuevosPremios.push("Cuarta");
          setGanadores({
            Premio: "Cuarta",
            Nombres: ganadoresData.Cuarta,
          });
          setModalGanadoresVisible(true);
        } else if (!nuevosPremios.includes("Terno") && ganadoresData.Terno) {
          nuevosPremios.push("Terno");
          setGanadores({
            Premio: "Terno",
            Nombres: ganadoresData.Terno,
          });
          setModalGanadoresVisible(true);
        }
  
        return nuevosPremios;
      }
  
      return prevPremiosYaAlertados;
    });
  };
  

  const sincronizar = async () => {
    if (misBoletos.length < 2) {
      return Alert.alert(
        "Boletos insuficientes",
        "Se requieren al menos 2 boletos para sincronizar la partida."
      );
    }
    setSincronizando(true);
    try {
      const response = await ObtenerPartidaActual();
      if (response) {
        setPartidaActual(response);
      }
      if (response.terminado) {

        Alert.alert(
          "Partida finalizada",
          "La partida ya finalizó."
        );
      } else if (response.Activo == 1) {
        setSincronizado(!sincronizado);
      } else {
        Alert.alert(
          "Partida no iniciada",
          "La partida aún no ha sido iniciada por el encargado. Espere a que se comunique el comienzo de la partida para poder sincronizar en vivo sus boletos."
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo sincronizar la partida");
    } finally {
      setSincronizando(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [misBoletos, tick]);

  useEffect(() => {
    try {
      if (misBoletos[0]?.idPartida != partidaActual.id) {
        setMisBoletos([]);
      }
    } catch (error) {
      setMisBoletos([]);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ModalGanadores
        visible={modalGanadoresVisible}
        ganadores={ganadores}
        onClose={() => {
          setModalGanadoresVisible(false)
          verificarGanadoresParaAlertar(ganadoresResponse);
        }}
      />


      <View style={styles.container}>
        {
          sincronizado && (
            <>
              {/* Top section */}
              <Animated.View style={[styles.topSection, { height: topHeight }]}>
                {sincronizado && numerosFormateados.length > 0 && (
                  <ListaNrosRetirados lista={numerosFormateados} />
                )}
              </Animated.View>

              {/* First drag handle */}
              <View {...topPanResponder.panHandlers} style={styles.dragHandle}>
                <View style={styles.dragBar} />
              </View>

              {/* Middle section */}
              <View style={[styles.middleSection, { height: middleHeight }]}>
                {sincronizado && numerosFormateados.length > 0 && (
                  <TablaBingo numerosFormateados={numerosFormateados} />
                )}
              </View>

              {/* Second drag handle */}
              <View {...bottomPanResponder.panHandlers} style={styles.dragHandle}>
                <View style={styles.dragBar} />
              </View>

            </>
          )
        }

      </View>
      {/* Bottom section */}
      <View style={[styles.bottomSection, sincronizado ? { height: bottomHeight + 40 } : { height: '85%' }]}>
        {loading ? (
          <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
        ) : (
          <ScrollView style={{ flex: 1 }}>
            {misBoletos.length > 0 &&
              misBoletos.map((miBoleto, index) => (
                <ItemMiBoleto
                  key={index}
                  boleto={miBoleto}
                  numeros={numerosRetirados}
                />
              ))}
          </ScrollView>
        )}
      </View>
      <Button
        mode="contained"
        icon={!sincronizado ? "play" : "stop"}
        disabled={sincronizando}
        style={{
          margin: 10,
          backgroundColor: sincronizado
            ? BingoColors.secondary
            : BingoColors.primary,
        }}
        onPress={sincronizar}
      >
        {sincronizando ? (
          <ActivityIndicator size="small" color={BingoColors.white} />
        ) : !sincronizado ? (
          "SINCRONIZAR"
        ) : (
          "DESINCRONIZAR"
        )}
      </Button>
      <ModalMensaje visible={msjVisible} mensaje={mensajeP} onClose={() => setMsjVisible(false)}></ModalMensaje>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  topSection: {
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  middleSection: {
    backgroundColor: '#fff',
  },
  bottomSection: {
    backgroundColor: '#f1f1f1',
  },
  dragHandle: {
    height: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dragBar: {
    width: 40,
    height: 4,
    backgroundColor: '#999',
    borderRadius: 2,
  },
});