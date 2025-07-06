import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Button, Text, Divider, IconButton } from 'react-native-paper';
import * as Linking from 'expo-linking';
import { useAppContext } from '../../context/AppProvider';
import ModalComoConseguirCredito from '../Modales/ModalComoConseguirCredito';
import ModalComoRetirarCredito from '../Modales/ModalComoRetirarCredito';
import ModalCodigoReferido from '../Modales/ModalCodigoReferido';
import { BingoColors } from '../../Theme/Colors';

export default function CreditosUsuario() {
  const { user } = useAppContext();

  const obtenerCodigoUsuario = () => {
    return (user.Nombres.substring(0, 2) +
      user.Apellidos.substring(0, 2) +
      user.id +
      user.Telefono.substring(1, 5)).replace(/\s/g, '');
  };

  const redireccionar = () => {
    Linking.openURL(
      `https://wa.me/584120193920?text=Mi código de usuario es: ${obtenerCodigoUsuario()}`
    );
  };

  const redireccionar2 = () => {
    Linking.openURL(
      `https://wa.me/584120193920?text=Mi código de usuario es: ${obtenerCodigoUsuario()} \nTengo disponible en mi cuenta de Bingo Maac el total de ${user.Creditos} Bs \nDeseo retirar: `
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title 
          title="Balance de Créditos" 
          left={(props) => <IconButton {...props} icon="wallet" color={BingoColors.primary} />} 
        />
        <Card.Content>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Bolivares disponibles:</Text>
            <Text style={styles.balanceAmount}>{user.Creditos} Bs</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.actionsContainer}>
            <Button 
              mode="contained" 
              icon="cash-refund" 
              onPress={redireccionar2}
              style={styles.button}
            >
              Solicitar Retiro
            </Button>
            <Button 
              mode="outlined" 
              icon="send" 
              onPress={redireccionar}
              style={styles.button}
            >
              Enviar Comprobante
            </Button>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.infoContainer}>
        <ModalCodigoReferido />
        <ModalComoRetirarCredito />
        <ModalComoConseguirCredito />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: BingoColors.primary,
  },
  divider: {
    marginVertical: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  infoContainer: {
    padding: 16,
  },
});