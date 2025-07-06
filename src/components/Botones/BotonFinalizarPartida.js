import { Alert, StyleSheet, Text, View, Modal } from "react-native";
import { IconButton, TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { BingoColors } from "../../Theme/Colors";
import { agregarMensaje, crearObjetoMensaje } from "../../Utils/Mensaje";
import { useAppContext } from "../../context/AppProvider";

export default function BotonFinalizarPartida({ agregarNro, volver }) {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageDescription, setMessageDescription] = useState("");
  const [selectedAudio, setSelectedAudio] = useState("");
  const {partidaActual} = useAppContext()
  const audioOptions = [
    { label: "Audio Terminado", value: "1" },
    { label: "Audio Aplausos", value: "2" },
  ];

  const handleEndGame = () => {
    setShowMessageModal(true);
  };

  const handleSendMessage = async () => {
    const mensaje = crearObjetoMensaje(0,partidaActual.id,messageTitle,messageDescription,selectedAudio)
    await agregarMensaje(mensaje)
    setShowMessageModal(false);
    agregarNro(-1, true);
    volver();
  };

  const handleCancelMessage = () => {
    setShowMessageModal(false);
    agregarNro(-1, true);
    volver();
  };

  const confirmacion = () => {
    Alert.alert(
      "CONFIRMACIÓN DE FINALIZACIÓN DE PARTIDA",
      "¿Esta seguro de dar por finalizado la partida actual? (No podrá iniciarla nuevamente)",
      [
        { text: "NO" },
        { text: "SI", onPress: handleEndGame },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <IconButton
        style={styles.bx}
        icon="stop"
        size={25}
        mode="outlined"
        iconColor={BingoColors.black}
        onPress={confirmacion}
      />

      <Modal
        visible={showMessageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enviar mensaje personalizado</Text>

            <TextInput
              label="Título"
              value={messageTitle}
              onChangeText={setMessageTitle}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Descripción"
              value={messageDescription}
              onChangeText={setMessageDescription}
              style={styles.input}
              multiline
              numberOfLines={3}
              mode="outlined"
            />

            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>Seleccionar audio:</Text>
              {audioOptions.map((option) => (
                <Button
                  key={option.value}
                  mode={selectedAudio === option.value ? "contained" : "outlined"}
                  onPress={() => setSelectedAudio(option.value)}
                  style={styles.audioButton}
                >
                  {option.label}
                </Button>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancelMessage}
                style={styles.button}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSendMessage}
                style={styles.button}
                disabled={!messageTitle || !messageDescription || !selectedAudio}
              >
                Enviar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 60,
    top: -20,
  },
  bx: {
    backgroundColor: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: 500,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  selectContainer: {
    marginBottom: 16,
  },
  selectLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  audioButton: {
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  button: {
    minWidth: 120,
  },
});