import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { BingoColors } from '../../Theme/Colors';
import SelectDropdown from "react-native-select-dropdown";
import { paisesSudamerica, codigosTelefonicos } from '../Data/paises';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BotonRegistro from '../Botones/BotonRegistro';

export default function FormularioRegistro() {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [pais, setPais] = useState('');
  const [codigoPais, setCodigoPais] = useState('');
  const [telefono, setTelefono] = useState('');
  const [clave, setClave] = useState('');
  const [codigoInvitado, setCodigoInvitado] = useState('');


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registro de Usuario</Text>

          <TextInput
            label="Nombres"
            value={nombres}
            onChangeText={setNombres}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Apellidos"
            value={apellidos}
            onChangeText={setApellidos}
            style={styles.input}
            mode="outlined"
          />

          <SelectDropdown
            data={paisesSudamerica}
            onSelect={(selectedItem, index) => {
              setPais(selectedItem);
              setCodigoPais(codigosTelefonicos[index]);
            }}
            defaultButtonText="Seleccione su país"
            buttonTextAfterSelection={(selectedItem) => selectedItem}
            rowTextForSelection={(item) => item}
            buttonStyle={styles.dropdown}
            buttonTextStyle={styles.dropdownButtonText}
            renderDropdownIcon={(isOpened) => (
              <Icon name={isOpened ? 'arrow-drop-up' : 'arrow-drop-down'} color={BingoColors.primary} size={30} />
            )}
            dropdownIconPosition="right"
          />

          <View style={styles.phoneContainer}>
            <TextInput
              label="Código"
              value={codigoPais}
              editable={false}
              style={styles.phoneCode}
              mode="outlined"
            />
            <TextInput
              label="Número de celular"
              value={telefono}
              onChangeText={setTelefono}
              style={styles.phoneNumber}
              mode="outlined"
              keyboardType="phone-pad"
            />
          </View>

          <TextInput
            label="Contraseña"
            value={clave}
            onChangeText={setClave}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Código de invitado (opcional)"
            value={codigoInvitado.toUpperCase()}
            onChangeText={setCodigoInvitado}
            style={styles.input}
            
            mode="outlined"
          />


          <BotonRegistro telefono={codigoPais + " " + telefono} nombre={nombres} apellido={apellidos} clave={clave} codigoInvitado={codigoInvitado}></BotonRegistro>

          <HelperText type="info" style={styles.helperText}>
            Al registrarte, aceptas nuestros términos y condiciones.
          </HelperText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BingoColors.background,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: BingoColors.white,
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BingoColors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: BingoColors.white,
  },
  dropdown: {
    width: '100%',
    height: 50,
    backgroundColor: BingoColors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: BingoColors.primary,
    marginBottom: 15,
  },
  dropdownButtonText: {
    textAlign: 'left',
    color: '#000',
  },
  phoneContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  phoneCode: {
    flex: 1,
    marginRight: 10,
    backgroundColor: BingoColors.white,
  },
  phoneNumber: {
    flex: 3,
    backgroundColor: BingoColors.white,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: BingoColors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperText: {
    textAlign: 'center',
    marginTop: 10,
  },
});