import React, { useState } from "react";
import { Modal, StyleSheet, Pressable, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import { estilosComunes } from "../../Theme/estilosComunes";
const ModalActivaTuCuenta = () => {
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
              ACTIVA Y ABONA SALDO A SU CUENTA AQUÍ!
            </Text>
            <Text variant="titleMedium" style={styles.title}>
              Pago móvil 04141279671  {' \n'}CI. 16673304 Bancamiga (0172) 
             {' \n'}
              Otros métodos de pago preguntar por el icono de WhatsApp.
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
        ACTIVA Y ABONA SALDO A SU CUENTA AQUÍ!
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

export default ModalActivaTuCuenta;
