import React, { useState, useEffect } from "react";
import { View, Modal, Pressable, StyleSheet } from "react-native";
import { Text, TextInput, Switch, Button } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import BotonAgregarPartida from "../Botones/BotonAgregarPartida";
import { useAppContext } from "../../context/AppProvider";
import ModalAgregarPromocion from "./ModalAgregarPromocion";

const ModalAgregarPartida = ({ }) => {
  const [visible, setVisible] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [costoBoleto, setCostoBoleto] = useState("0");
  const { partidaActual } = useAppContext();
  const [nroPartida, setNroPartida] = useState(partidaActual.NroPartida + 1 + "");
  const [promociones, setPromociones] = useState([{
    "nroBoletos": "1",
    "valor": "30",
    "boletosRegalo":"0"
  }, {
    "nroBoletos": "2",
    "valor": "50",
    "boletosRegalo":"0"
  }, {
    "nroBoletos": "3",
    "valor": "70",
    "boletosRegalo":"1"
  }, {
    "nroBoletos": "4",
    "valor": "90",
    "boletosRegalo":"1"
  }, {
    "nroBoletos": "5",
    "valor": "110",
    "boletosRegalo":"2"
  }]);
  const [activo, setActivo] = useState(false);
  const [terna, setTerna] = useState(false);
  const [cuarta, setCuarta] = useState(false);
  const [fila, setFila] = useState(false);
  const [lleno, setLleno] = useState(false);

  const [montoTerna, setMontoTerna] = useState("0");
  const [montoCuarta, setMontoCuarta] = useState("0");
  const [montoFila, setMontoFila] = useState("0");
  const [montoLleno, setMontoLleno] = useState("0");

  useEffect(() => {
    setNroPartida(partidaActual.NroPartida + 1 + "");
  }, [partidaActual]);

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
              AGREGAR PARTIDA
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
            <TextInput
              mode="outlined"
              value={costoBoleto}
              style={{ width: "95%", marginVertical: 5 }}
              onChangeText={(t) => setCostoBoleto(t)}
              label={"Costo de boleto"}
            ></TextInput>

            <View
              style={styles.row}
            >
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>ESTADO:</Text>
              <View style={styles.switchContainer}>
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
            <ModalAgregarPromocion promociones={promociones} setPromociones={setPromociones}></ModalAgregarPromocion>
            <BotonAgregarPartida
              Activo={activo}
              Descripcion={descripcion}
              Nro={nroPartida}
              setVisible={setVisible}
              Terna={terna}
              Cuarta={cuarta}
              Fila={fila}
              Lleno={lleno}
              MontoTerna={montoTerna}
              MontoCuarta={montoCuarta}
              MontoFila={montoFila}
              MontoLleno={montoLleno}
              promociones={promociones}
              costoBoleto={costoBoleto}
            ></BotonAgregarPartida>
          </View>
        </View>
      </Modal>
      <Button mode="outlined" style={{ paddingHorizontal: 10, margin: 10 }} onPress={() => setVisible(true)}>Agregar partida</Button>
    </View>
  );
};

const styles = StyleSheet.create({
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
  montoInput: {
    width: "30%",
    marginLeft: 10,
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
  title: {
    marginTop: 10,
    textAlign: "center",
    marginHorizontal: 10,
    fontWeight: "900",
    color: BingoColors.black,
  },
});

export default ModalAgregarPartida;
