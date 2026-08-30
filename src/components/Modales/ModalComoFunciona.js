import React, { useState } from "react";
import { Modal, StyleSheet, Pressable, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import { estilosComunes } from "../../Theme/estilosComunes";
const ModalComoFunciona = () => {
  const [visible, setModalVisible] = useState(false);
  return (
    <View style={estilosComunes.vistaCentrada}>
      <Modal
        animationType="slide"
        style={{}}
        transparent={true}
        visible={visible}
      >
        <View style={estilosComunes.vistaCentrada}>
          <View style={styles.modalView}>
            <Pressable
              style={[estilosComunes.botonModal, estilosComunes.botonCerrar]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={estilosComunes.textStyle}>X</Text>
            </Pressable>
            <Text variant="titleLarge" style={styles.title}>
              ¿COMO FUNCIONA LA APP BINGO MAAC?
            </Text>
            <Text variant="titleMedium" style={styles.title}>

              Está es una app para jugar Bingo Clásico 90, dónde usted podrá realizar su recarga de dinero y posterior a tener saldo a favor podrá adquirir cartónes para la jugada más próxima a realizar, en esta app cuenta con una trasmisión en vivo de la extracción de números de manera aleatoria la cual podrá apreciar en el momento de ejecución de la partida, sus cartones se irán tachando de forma automática hasta que se termine la jugada, también cuenta con un tabla de 90 números los cuales también se van tachando según van saliendo. ¡ No sé pierda de nuestras partidas recargue y adquiera sus cartones ya mismo !..
            </Text>
          </View>
        </View>
      </Modal>

      <Button
        mode="outlined"
        textColor={BingoColors.black}
        style={{ margin: 10, width: "90%" }}
        onPress={() => setModalVisible(!visible)}
        icon={"help-circle"}
      >
        ¿COMO FUNCIONA LA APP BINGO MAAC?
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  animation: {
    width: "100%",
    height: 200,
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    marginHorizontal: 10,
    fontWeight: "900",
    color: BingoColors.black,
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
    marginTop: "40%",
    maxHeight: '90%',
    width: "92%",
  },
});

export default ModalComoFunciona;
