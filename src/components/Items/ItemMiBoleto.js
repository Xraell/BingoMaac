import {
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { BingoColors } from "../../Theme/Colors";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ItemMiBoleto({ boleto, numeros }) {
  const [filas, setFilas] = useState([]);
  const { width } = useWindowDimensions();
  const squareSize = width / 9.4;
  const [numerosArray, setNumerosArray] = useState([]);
  const limites = [
    [0, 9],
    [10, 19],
    [20, 29],
    [30, 39],
    [40, 49],
    [50, 59],
    [60, 69],
    [70, 79],
    [80, 90],
  ];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let array = []
    if(numeros !=null){

      array= numeros.map((e) => e.Nro);
    }
    setNumerosArray(array);
    setLoading(false);
  }, [numeros]);

  useEffect(() => {
    if (boleto) {
      const numeros = Object.values(boleto).slice(4);
      const filasGeneradas = [];
      for (let i = 0; i < 3; i++) {
        const fila = [];
        let filaindex = 0;
        for (let j = 0; j < 9; j++) {
          if (
            numeros[i * 5 + filaindex] >= limites[j][0] &&
            numeros[i * 5 + filaindex] <= limites[j][1]
          ) {
            fila.push(numeros[i * 5 + filaindex]);
            filaindex++;
          } else {
            fila.push("-1");
          }
        }

        filasGeneradas.push(fila);
      }

      setFilas(filasGeneradas);
    }
  }, [boleto, numerosArray]);

  return (
    <View style={styles.bx}>
      <View style={styles.Tarjeta}>
        <Text
          variant="titleLarge"
          style={{
            color: BingoColors.white,
            backgroundColor: BingoColors.secondary,
            textAlign: "center",
            fontWeight: "bold",
            padding: 5,
          }}
        >
          PROYECTO MAAC
        </Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={BingoColors.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <ScrollView horizontal>
            <View style={{ display: "flex", flexDirection: "column" }}>
              {filas.map((fila, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {fila.map((numero, i) => {
                  return (
                    <TouchableOpacity key={i} style={[styles.bxNumero,{ width: squareSize, height: squareSize }]}>
                      {numero > 0 ? (
                        <Text style={styles.numero}>{numero}</Text>
                      ) : (
                        <Image
                          source={require("../../images/logo.png")}
                          resizeMode="cover"
                          style={{ width: squareSize, height: squareSize }}
                        />
                      )}
                      {numerosArray.includes(Number(numero)) ? (
                        <Text
                          style={{
                            fontSize: 40,
                            top: -10,
                            fontWeight: "bold",
                            position: "absolute",
                            color: BingoColors.primary,
                            opacity: 0.7,
                          }}
                        >
                          X
                        </Text>
                      ) : (
                        <></>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              ))}
            </View>
          </ScrollView>
        )}
        <View style={{ width: "100%" }}>
          <Text
            variant="bodyLarge"
            style={{
              textAlign: "left",
              paddingLeft: 10,
              fontWeight: "bold",
              borderRightWidth: 3,
              width: "35%",
            }}
          >
            SERIAL Nº {boleto.NroSerial}
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  Tarjeta:{
    borderWidth:1
  },
  bxNumero: {
    borderWidth: 1,
    alignItems: "center",
  },
  numero: {
    fontSize: 22,
    padding: 5,
    fontWeight: "bold",
    position: "relative",
  },
  bx: {
    flex: 1,
    backgroundColor: BingoColors.white,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
});
