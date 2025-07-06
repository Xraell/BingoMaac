import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { BingoColors } from '../../Theme/Colors';
import { Button, TextInput } from 'react-native-paper';
const ModalPrecio = ({ visible, onClose, onSubmit }) => {
  const [precio, setPrecio] = useState('');
  const handleSubmit = () => {
    onSubmit(precio);
    setPrecio('');
    onClose();
  };
  return (
    <Modal visible={visible} transparent>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
          mode='outlined'
            style={styles.input}
            label="Ingrese el precio del boleto"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <Button mode='contained'   onPress={onClose} color={BingoColors.secondary} >Cancelar</Button>
            <Button mode='elevated'  onPress={handleSubmit} color={BingoColors.primary} >Aceptar</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width:'100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default ModalPrecio;