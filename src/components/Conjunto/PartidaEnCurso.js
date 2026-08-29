import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { IconButton, Text, TextInput, Button } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import ListaNrosRetirados from "../Listas/ListaNrosRetirados";
import ListaGanadores from "../Listas/ListaGanadores";
import { Audio } from 'expo-av';
import {
  ObtenerNumerosPartida,
  agregarNumero,
  crearObjetoNumero,
} from "../../Utils/Numero";
import { useAppContext } from "../../context/AppProvider";
import { ObtenerBoletosGanadores } from "../../Utils/Boleto";
import BotonTerminarPartida from "../Botones/BotonTerminarPartida";
import BotonFinalizarPartida from "../Botones/BotonFinalizarPartida";
import { agregarGanadoresPremio, crearObjetoGanador, crearObjetoGanadores } from "../../Utils/Ganador";

export default function PartidaEnCurso({ volver }) {
  const { partidaActual } = useAppContext();
  const [nrosRetirados, setNrosRetirados] = useState([]);
  const [ganadoresFila, setGanadoresFila] = useState([]);
  const [ganadoresTerno, setGanadoresTerno] = useState([]);
  const [ganadoresCuarta, setGanadoresCuarta] = useState([]);
  const [ganadoresCompleto, setGanadoresCompleto] = useState([]);
  const [nroInput, setNro] = useState("");
  const [loading, setLoading] = useState(false);
  const [automatico, setAutomatico] = useState(false);
  const timeoutRef = useRef(null);
  const isAddingNumber = useRef(false);
  const ultimoNroAgregado = useRef(0);
  const nrosRetiradosRef = useRef(nrosRetirados);
  const automaticoRef = useRef(automatico);

  const ganadoresFilaRef = useRef([]);
  const ganadoresTernoRef = useRef([]);
  const ganadoresCuartaRef = useRef([]);
  const ganadoresCompletoRef = useRef([]);

  const [sound, setSound] = useState();
  useEffect(() => {
    ganadoresFilaRef.current = ganadoresFila;
  }, [ganadoresFila]);

  useEffect(() => {
    ganadoresTernoRef.current = ganadoresTerno;
  }, [ganadoresTerno]);

  useEffect(() => {
    ganadoresCuartaRef.current = ganadoresCuarta;
  }, [ganadoresCuarta]);

  useEffect(() => {
    ganadoresCompletoRef.current = ganadoresCompleto;
  }, [ganadoresCompleto]);
  useEffect(() => {
    nrosRetiradosRef.current = nrosRetirados;
  }, [nrosRetirados]);

  useEffect(() => {
    automaticoRef.current = automatico;
  }, [automatico]);


  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../sounds/women/bienvenido.wav")
    );
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  useEffect(() => {
    obtenerNumeros();
    obtenerGanadores();
    playSound();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [obtenerNumeros, obtenerGanadores]);
  const arraysAreEqual = (array, valueType) => {

    console.log("Comparando array con valueType:", valueType);
    console.log("Array recibido:", array);


    const getCurrentStateLength = () => {
      switch (valueType) {
        case 1: return ganadoresCompletoRef.current.length;
        case 2: return ganadoresFilaRef.current.length;
        case 3: return ganadoresCuartaRef.current.length;
        case 4: return ganadoresTernoRef.current.length;
        default:
          console.error("Valor inválido para valueType");
          return 0;
      }
    };

    const currentStateLength = getCurrentStateLength();
    console.log(`Longitud actual para valueType ${valueType}:`, currentStateLength);
    if (currentStateLength > 0) {
      return true;
    }

    return array.length === currentStateLength;
  };


  const obtenerNumeros = useCallback(async () => {
    try {
      const response = await ObtenerNumerosPartida(partidaActual.id);
      const arregloNumeros = response.map((e) => e.Nro);
      if (arregloNumeros.includes(-1)) {
        volver();
        return Alert.alert(
          "Partida finalizada",
          "La partida ya fue finalizada, por lo cual no puede iniciarse otra vez"
        );
      }
      setNrosRetirados(arregloNumeros);
    } catch (error) {
      console.error("Error al obtener números:", error);
    }
  }, [partidaActual.id, volver]);

  const obtenerGanadores = useCallback(async () => {
    try {
      const ganadores = await ObtenerBoletosGanadores(partidaActual.id);
      const boletosCompletosChanged = !arraysAreEqual(ganadores.boletos_completos, 1);
      const boletosGanadoresFilaChanged = !arraysAreEqual(ganadores.boletos_ganadores_fila, 2);
      const boletosGanadoresCuartaChanged = !arraysAreEqual(ganadores.boletos_ganadores_cuarta, 3);
      const boletosGanadoresTernoChanged = !arraysAreEqual(ganadores.boletos_ganadores_terno, 4);


      const ganadoresChanged =
        boletosCompletosChanged ||
        boletosGanadoresFilaChanged ||
        boletosGanadoresCuartaChanged ||
        boletosGanadoresTernoChanged;

      console.log('boletosCompletosChanged: ', boletosCompletosChanged);
      console.log('boletosGanadoresFilaChanged: ', boletosGanadoresFilaChanged);
      console.log('boletosGanadoresCuartaChanged: ', boletosGanadoresCuartaChanged);
      console.log('boletosGanadoresTernoChanged: ', boletosGanadoresTernoChanged);
      console.log('ganadoresChanged: ', ganadoresChanged);
      console.log('automaticoRef: ', automaticoRef);
      if (ganadoresChanged && automaticoRef.current) {
        toggleAutomatico()
      }
      if (boletosCompletosChanged && ganadoresCompleto.length == 0) {
        const idUsuariosGanadores = ganadores.boletos_completos.map((e) => ({ "idUsuario": e.idUsuario }))
        const ganadoresCo = crearObjetoGanadores(idUsuariosGanadores, partidaActual.id, ganadores.idPremioCompleto)
        await agregarGanadoresPremio(ganadoresCo)
        console.log('ganadores: ', ganadoresCo);
      }
      if (boletosGanadoresFilaChanged && ganadoresFila.length == 0) {
        const idUsuariosGanadores = ganadores.boletos_ganadores_fila.map((e) => ({ "idUsuario": e.idUsuario }))
        const ganadoresF = crearObjetoGanadores(idUsuariosGanadores, partidaActual.id, ganadores.idPremioLinea)
        await agregarGanadoresPremio(ganadoresF)
        console.log('ganadores: ', ganadoresF);
      }
      if (boletosGanadoresCuartaChanged && ganadoresCuarta.length == 0) {
        const idUsuariosGanadores = ganadores.boletos_ganadores_cuarta.map((e) => ({ "idUsuario": e.idUsuario }))
        const ganadoresC = crearObjetoGanadores(idUsuariosGanadores, partidaActual.id, ganadores.idPremioCuarta)
        await agregarGanadoresPremio(ganadoresC)
        console.log('ganadores: ', ganadoresC);
      }
      if (boletosGanadoresTernoChanged && ganadoresTerno.length == 0) {
        console.log('boletosGanadoresTernoChanged: ', ganadores);
        const idUsuariosGanadores = ganadores.boletos_ganadores_terno.map((e) => ({ "idUsuario": e.idUsuario }))
        const ganadoresT = crearObjetoGanadores(idUsuariosGanadores, partidaActual.id, ganadores.idPremioTerno)
        await agregarGanadoresPremio(ganadoresT)
        console.log('ganadores: ', ganadoresT);
      }
      setGanadoresCompleto(ganadores.boletos_completos);
      setGanadoresFila(ganadores.boletos_ganadores_fila);
      setGanadoresCuarta(ganadores.boletos_ganadores_cuarta);
      setGanadoresTerno(ganadores.boletos_ganadores_terno);
    } catch (error) {
      console.error("Error al obtener ganadores:", error);
    }
  }, [partidaActual.id]);

  const agregarNro = useCallback(async (nro, terminar = false) => {
    if (isAddingNumber.current) return;
    if (nrosRetiradosRef.current.includes(Number(nro))) {
      Alert.alert(
        "Número ya ingresado",
        "El número ya se encuentra en la lista de números ingresados"
      );
      return;
    }
    if ((nro < 1 || nro > 90) && !terminar) {
      Alert.alert(
        "Número no valido",
        "El número no puede ser menos a 1 ni mayor a 90"
      );
      return;
    }

    isAddingNumber.current = true;
    setLoading(true);
    const nuevoNro = crearObjetoNumero(partidaActual.id, nro);
    try {
      await agregarNumero(nuevoNro);
      setNrosRetirados((prev) => {
        const nuevoEstado = [Number(nro), ...prev];
        console.log("nuevoEstado: ", nuevoEstado);
        return nuevoEstado;
      });

      ultimoNroAgregado.current = Number(nro);

      await obtenerGanadores();
      setNro("");
    } catch (error) {
      console.error("Error al agregar número:", error);
    } finally {
      setLoading(false);
      isAddingNumber.current = false;
    }
  }, [partidaActual.id, obtenerGanadores]);

  const agregarNumeroAleatorio = useCallback(async () => {
    if (nrosRetiradosRef.current.length >= 90) {
      Alert.alert("Todos los números han sido retirados");
      setAutomatico(false);
      return false;
    }

    let nroAleatorio;
    do {
      nroAleatorio = Math.floor(Math.random() * 90) + 1;
    } while (nrosRetiradosRef.current.includes(nroAleatorio) || nroAleatorio === ultimoNroAgregado.current);

    await agregarNro(nroAleatorio);
    return true;
  }, [agregarNro]);

  const programarSiguienteNumero = useCallback(() => {
    if (automaticoRef.current && !isAddingNumber.current) {
      console.log("Programando siguiente número...");
      timeoutRef.current = setTimeout(async () => {
        try {
          if (!automaticoRef.current) return;
          const success = await agregarNumeroAleatorio();
          if (success && automaticoRef.current) {
            programarSiguienteNumero();
          }
        } catch (error) {
          console.error("Error al agregar número aleatorio:", error);
          if (automaticoRef.current) {
            programarSiguienteNumero();
          }
        }
      }, 5000);
    }
  }, [agregarNumeroAleatorio]);

  useEffect(() => {
    if (automatico) {
      programarSiguienteNumero();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [automatico, programarSiguienteNumero]);

  const toggleAutomatico = useCallback(() => {
    setAutomatico((prev) => !prev);
  }, []);

  return (
    <View style={{ flex: 1, marginVertical: 30 }}>
      <BotonFinalizarPartida setNro={setNro} agregarNro={agregarNro} volver={volver} />
      <BotonTerminarPartida volver={() => volver()} />

      <ListaNrosRetirados lista={nrosRetirados} />
      <ListaGanadores
        ganadoresFila={ganadoresFila}
        ganadoresCompleto={ganadoresCompleto}
        ganadoresCuarta={ganadoresCuarta}
        ganadoresTerno={ganadoresTerno}
        numeros={nrosRetirados}
      />

      {!automatico && (
        <View style={{ flexDirection: "row", width: "100%", paddingHorizontal: 20 }}>
          <TextInput
            mode="outlined"
            style={{ flexGrow: 1 }}
            label={"Número retirado"}
            value={nroInput + ""}
            keyboardType="numeric"
            onChangeText={(t) => setNro(t)}
          />
          {!loading ? (
            <IconButton
              icon={"send"}
              mode="contained"
              onPress={() => agregarNro(nroInput)}
              style={styles.btnSend}
              iconColor={BingoColors.white}
              disabled={loading}
            />
          ) : (
            <ActivityIndicator color={BingoColors.primary} style={{ margin: 10 }} size={"large"} />
          )}
        </View>
      )}

      <Button mode={automatico ? "contained" : "outlined"} onPress={toggleAutomatico} style={{ marginTop: 20, marginHorizontal: 20 }}>
        {automatico ? "Detener Automático" : "Iniciar Automático"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  btnSend: {
    backgroundColor: BingoColors.primary,
    marginLeft: 10,
  },
});
