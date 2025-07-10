import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { BingoColors } from "../../Theme/Colors";
import ItemGanador from "../Items/ItemGanador";
import ModalBoletoGanador from "../Modales/ModalBoletoGanador";
import { SegmentedButtons } from 'react-native-paper';
import { Audio } from 'expo-av';  // Make sure this package is installed

export default function ListaGanadores({ ganadoresFila, ganadoresCompleto, ganadoresTerno, ganadoresCuarta, numeros }) {
  const [ganadorSeleccionado, setGanadorSeleccionado] = useState({
    NroSerial: 0,
    Precio: 0,
    idUsuario: 0,
    idPartida: 0,
    Nro1: "0", Nro2: "0", Nro3: "0", Nro4: "0", Nro5: "0",
    Nro6: "0", Nro7: "0", Nro8: "0", Nro9: "0", Nro10: "0",
    Nro11: "0", Nro12: "0", Nro13: "0", Nro14: "0", Nro15: "0",
    Nombres: "", Apellidos: ""
  });
  const [visible, setVisible] = useState(false);
  const [categoria, setCategoria] = useState('completo');
  
  // States to handle previous winners
  const [prevGanadoresFila, setPrevGanadoresFila] = useState(ganadoresFila.length);
  const [prevGanadoresCompleto, setPrevGanadoresCompleto] = useState(ganadoresCompleto.length);
  const [prevGanadoresTerno, setPrevGanadoresTerno] = useState(ganadoresTerno.length);
  const [prevGanadoresCuarta, setPrevGanadoresCuarta] = useState(ganadoresCuarta.length);

  // Animated values
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const scaleTitle = useRef(new Animated.Value(0.5)).current;
  const fadeInButtons = useRef(new Animated.Value(0)).current;

  // Load sounds for each category
  const soundRefs = {
    completo: useRef(null),
    fila: useRef(null),
    terno: useRef(null),
    cuarta: useRef(null),
  };

  useEffect(() => {
    // Load the audio files when the component mounts
    async function loadSounds() {
      soundRefs.completo.current = new Audio.Sound();
      soundRefs.fila.current = new Audio.Sound();
      soundRefs.terno.current = new Audio.Sound();
      soundRefs.cuarta.current = new Audio.Sound();

      await soundRefs.completo.current.loadAsync(require('../../sounds/women/bingo.wav'));
      await soundRefs.fila.current.loadAsync(require('../../sounds/women/linea.wav'));
      await soundRefs.terno.current.loadAsync(require('../../sounds/women/terno.wav'));
      await soundRefs.cuarta.current.loadAsync(require('../../sounds/women/cuarta.wav'));
    }

    loadSounds();
    return () => {
      // Unload sounds when component unmounts
      Object.values(soundRefs).forEach(async (soundRef) => {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }
      });
    };
  }, []);

  const categorias = [
    { label: `Completo (${ganadoresCompleto.length})`, value: 'completo' },
    { label: `Linea (${ganadoresFila.length})`, value: 'fila' },
    { label: `Terno (${ganadoresTerno.length})`, value: 'terno' },
    { label: `Cuarta (${ganadoresCuarta.length})`, value: 'cuarta' },
  ];

  const obtenerGanadores = () => {
    switch (categoria) {
      case 'completo':
        return ganadoresCompleto;
      case 'fila':
        return ganadoresFila;
      case 'terno':
        return ganadoresTerno;
      case 'cuarta':
        return ganadoresCuarta;
      default:
        return [];
    }
  };

  const reproducirAudio = async (categoria) => {
    if (soundRefs[categoria].current) {
      await soundRefs[categoria].current.replayAsync();
    }
  };

  // useEffect to detect new winners
  useEffect(() => {
    switch (categoria) {
      case 'completo':
        if (prevGanadoresCompleto == 0 && ganadoresCompleto.length > prevGanadoresCompleto) {
          reproducirAudio('completo');
          setPrevGanadoresCompleto(ganadoresCompleto.length);
        }
        break;
      case 'fila':
        if (prevGanadoresFila  == 0 && ganadoresFila.length > prevGanadoresFila) {
          reproducirAudio('fila');
          setPrevGanadoresFila(ganadoresFila.length);
        }
        break;
      case 'terno':
        if (prevGanadoresTerno  == 0 && ganadoresTerno.length > prevGanadoresTerno) {
          reproducirAudio('terno');
          setPrevGanadoresTerno(ganadoresTerno.length);
        }
        break;
      case 'cuarta':
        if (prevGanadoresCuarta  == 0 && ganadoresCuarta.length > prevGanadoresCuarta) {
          reproducirAudio('cuarta');
          setPrevGanadoresCuarta(ganadoresCuarta.length);
        }
        break;
    }
  }, [ganadoresCompleto, ganadoresFila, ganadoresTerno, ganadoresCuarta]);

  const showModal = () => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true
      })
    ]).start();
  };

  const hideModal = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 50,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true
      })
    ]).start(() => setVisible(false));
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleTitle, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.timing(fadeInButtons, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { transform: [{ scale: scaleTitle }] }]}>
        Boletos ganadores
      </Animated.Text>

      <Animated.View style={{ opacity: fadeInButtons }}>
        <SegmentedButtons
          value={categoria}
          onValueChange={setCategoria}buttons={categorias.map((cat) => ({
            ...cat,
            style: {
              backgroundColor: categoria === cat.value ? BingoColors.primary : BingoColors.white,
              
            },
            labelStyle: {
              fontSize: categoria === cat.value ? 10 : 12,
              fontWeight: categoria === cat.value ? 'bold' : 'normal',
              color: categoria === cat.value ? BingoColors.white : BingoColors.black,
            },
          }))}
          style={styles.segmentedButtons}
        />
      </Animated.View>

      <ScrollView style={styles.verticalScroll}>
        {obtenerGanadores().map((e, index) => (
          <AnimatedTouchableOpacity
            key={index}
            activeOpacity={0.7}
            style={{
              opacity: fadeInButtons,
              transform: [{
                translateY: fadeInButtons.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }]
            }}
          >
            <ItemGanador
              ganador={e}
              completo={categoria === 'completo'}
              setGanador={setGanadorSeleccionado}
              verGanador={showModal}
            />
          </AnimatedTouchableOpacity>
        ))}
      </ScrollView>

      {visible && (
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity,
              transform: [{ translateY }]
            }
          ]}
        >
          <ModalBoletoGanador
            visible={visible}
            setModalVisible={hideModal}
            ganador={ganadorSeleccionado}
            numerosPartida={numeros}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: BingoColors.background,
  },
  title: {
    color: BingoColors.primary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  segmentedButtons: {
    marginBottom: 20,
    backgroundColor: BingoColors.white,
    borderRadius: 12,
    elevation: 3,
  },
  verticalScroll: {
    backgroundColor: BingoColors.white,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});