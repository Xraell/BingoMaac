import React, { useState, useEffect, useContext } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import BotonesEditarPartida from "../Botones/BotonesEditarPartida";
import { ObtenerPremiosPartida, ObtenerPromocionesPartida } from "../../Utils/Partida";
const ModalEditarPartida = ({ partida, visible, setVisible }) => {
  const [nroPartida, setNroPartida] = useState(partida.NroPartida + "");
  const [descripcion, setDescripcion] = useState(partida.Descripcion);

  const [activo, setActivo] = useState(partida.Activo == 1);

  const [terna, setTerna] = useState(false);
  const [cuarta, setCuarta] = useState(false);
  const [fila, setFila] = useState(false);
  const [lleno, setLleno] = useState(false);

  const [idTerna, setIdTerna] = useState(0);
  const [idCuarta, setIdCuarta] = useState(0);
  const [idFila, setIdFila] = useState(0);
  const [idLleno, setIdLleno] = useState(0);

  const [montoTerna, setMontoTerna] = useState("0");
  const [montoCuarta, setMontoCuarta] = useState("0");
  const [montoFila, setMontoFila] = useState("0");
  const [montoLleno, setMontoLleno] = useState("0");

  useEffect(() => {
    resetValues()
    obtenerPromociones()
    setNroPartida(partida.NroPartida + "")
    setDescripcion(partida.Descripcion)
    setActivo(partida.Activo == 1)
  }, [partida])
  const resetValues = () => {
    setTerna(false);
    setCuarta(false);
    setFila(false);
    setLleno(false);
  
    setIdTerna(0);
    setIdCuarta(0);
    setIdFila(0);
    setIdLleno(0);
  
    setMontoTerna("0");
    setMontoCuarta("0");
    setMontoFila("0");
    setMontoLleno("0");
  };
  
  const obtenerPromociones = async () => {
    const response = await ObtenerPremiosPartida(partida.id)
    if (response.premios.length > 0) {


      response.premios.forEach(premio => {

        const accion = accionesPremios[premio.premio.nombre];

        if (!accion) {
          return;
        }

        if (premio.monto > 0) {
          accion(premio.monto.toString(),premio.id);
        }
      });
    }
  }
  const accionesPremios = {
    "Terno": (monto,id) => {
      setTerna(true);
      setMontoTerna(monto);
      setIdTerna(id)
    },
    "Cuarta": (monto,id) => {
      setCuarta(true);
      setMontoCuarta(monto);
      setIdCuarta(id)
    },
    "Línea": (monto,id) => {
      setFila(true);
      setMontoFila(monto);
      setIdFila(id)
    },
    "Cartón lleno": (monto,id) => {
      setLleno(true);
      setMontoLleno(monto);
      setIdLleno(id)
    }
  };
  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.textStyle}>X</Text>
            </Pressable>
            <Text variant="titleLarge" style={styles.title}>
              DETALLES DE LA PARTIDA
            </Text>
            <TextInput
              mode="outlined"
              value={nroPartida}
              style={{ width: "95%", marginVertical: 5 }}
              label={"Nro de partida"}
              onChangeText={(t) => setNroPartida(t)}
            ></TextInput>
            <TextInput
              mode="outlined"
              value={descripcion}
              style={{ width: "95%", marginVertical: 5 }}
              onChangeText={(t) => setDescripcion(t)}
              label={"Descripción"}
            ></TextInput>
            <View
              style={{
                flexDirection: "row",
                margin: 10,
                alignItems: "center",
                width: '100%',
                paddingHorizontal: '5%',
                justifyContent: "space-between",
              }}
            >
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>ESTADO:</Text>
              <View style={{ flexDirection: 'row', alignItems: "center" }}>

                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: BingoColors.primary }}>{activo ? "ACTIVO" : "INACTIVO"}</Text>
                <Switch
                  value={activo}
                  onChange={() => setActivo(!activo)}
                ></Switch>
              </View>
            </View>

            {/* Premio Terna */}
            <View style={styles.row}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>TERNA:</Text>
              <Switch
                value={terna}
                onChange={() => setTerna(!terna)}
              ></Switch>
              <TextInput
                mode="outlined"
                value={montoTerna}
                style={styles.montoInput}
                label={"Monto"}
                keyboardType="numeric"
                onChangeText={(t) => setMontoTerna(t)}
              ></TextInput>
            </View>

            {/* Premio Cuarta */}
            <View style={styles.row}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>CUARTA:</Text>
              <Switch
                value={cuarta}
                onChange={() => setCuarta(!cuarta)}
              ></Switch>
              <TextInput
                mode="outlined"
                value={montoCuarta}
                style={styles.montoInput}
                label={"Monto"}
                keyboardType="numeric"
                onChangeText={(t) => setMontoCuarta(t)}
              ></TextInput>
            </View>

            {/* Premio Fila */}
            <View style={styles.row}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>LÍNEA:</Text>
              <Switch
                value={fila}
                onChange={() => setFila(!fila)}
              ></Switch>
              <TextInput
                mode="outlined"
                value={montoFila}
                style={styles.montoInput}
                label={"Monto"}
                keyboardType="numeric"
                onChangeText={(t) => setMontoFila(t)}
              ></TextInput>
            </View>

            {/* Premio Lleno */}
            <View style={styles.row}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>CARTON LLENO:</Text>
              <Switch
                value={lleno}
                onChange={() => setLleno(!lleno)}
              ></Switch>
              <TextInput
                mode="outlined"
                value={montoLleno}
                style={styles.montoInput}
                label={"Monto"}
                keyboardType="numeric"
                onChangeText={(t) => setMontoLleno(t)}
              ></TextInput>
            </View>
            <BotonesEditarPartida Activo={activo} Descripcion={descripcion} Nro={nroPartida} idPartida={partida.id} setVisible={setVisible} 
            Terna={terna}
            Cuarta={cuarta}
            Fila={fila}
            Lleno={lleno}
            MontoTerna={montoTerna}
            MontoCuarta={montoCuarta}
            MontoFila={montoFila}
            MontoLleno={montoLleno}
            IdTerna={idTerna}
            IdCuarta={idCuarta}
            IdFila={idFila}
            IdLleno={idLleno}
            ></BotonesEditarPartida>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  Descripcion: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    textAlign: "center",
  },
  rowItem: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  title: {
    marginTop: 10,
    textAlign: "center",
    marginHorizontal: 10,
    fontWeight: "900",
    color: BingoColors.black,
  },
  Text: {
    marginTop: 10,
    paddingHorizontal: 20,
    fontWeight: "900",
    color: BingoColors.primary,
    textAlign: "left",
    width: "100%",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
    position: "relative",
  },
  modalView: {
    backgroundColor: BingoColors.white,
    position: "relative",
    borderRadius: 20,
    paddingVertical: 10,
    paddingTop: 20,
    paddingHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 300,
    marginTop: "10%",
    width: "95%",
  },
  button: {
    borderRadius: 10,
    padding: 3,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: BingoColors.primary,
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 100,
    paddingHorizontal: 10,
  },
  textStyle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    marginX: 10,
    alignItems: "center",
    width: '100%',
    paddingHorizontal: '5%',
    justifyContent: "space-between",
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: "center",
  },
});

export default ModalEditarPartida;
