import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { Text, Avatar, Card, Divider } from 'react-native-paper';
import { useAppContext } from '../../context/AppProvider';
import * as Clipboard from 'expo-clipboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BingoColors } from '../../Theme/Colors';
import BotonCerrarSesion from '../Botones/BotonCerrarSesion';

const PerfilUsuario = () => {
  const { user } = useAppContext();

  let referralCode = "";
  if (user) {
    const nombres = user.Nombres || "";
    const apellidos = user.Apellidos || "";
    const telefono = user.Telefono || "";

    referralCode = `${user.id}${nombres.slice(0, 3)}${apellidos.slice(0, 3)}${telefono.slice(-3)}`.toUpperCase().trim();
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralCode);
    ToastAndroid.show("Código de referido copiado al portapapeles",ToastAndroid.SHORT);
  };

  const UserInfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <Icon name={icon} size={24} color={BingoColors.primary} style={styles.infoIcon} />
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <Card style={styles.card}>
      <Card.Title
        title="Perfil de Usuario"
        left={(props) => <Avatar.Icon {...props} icon="account" />}
        right={(props) => (
          <BotonCerrarSesion />
        )}
      />
      <Card.Content>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={80}
            source={require("../../images/avatar.png")}
          />
          <Text style={styles.userName}>{`${user.Nombres} ${user.Apellidos}`}</Text>
        </View>

        <Divider style={styles.divider} />

        <UserInfoItem icon="phone" label="Teléfono" value={user.Telefono} />

        <Divider style={styles.divider} />

        <View style={styles.referralContainer}>
          <Text style={styles.referralTitle}>Código de Referido</Text>
          <View style={styles.referralCodeContainer}>
            <Text style={styles.referralCode}>{referralCode}</Text>
            <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
              <Icon name="content-copy" size={24} color={BingoColors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  referralContainer: {
    marginTop: 16,
  },
  referralTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
  },
  referralCode: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  copyButton: {
    padding: 8,
  },
});

export default PerfilUsuario;