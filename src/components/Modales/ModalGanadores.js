import React, { useEffect } from 'react';
import { Modal, View, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { BingoColors } from '../../Theme/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ModalGanadores({ visible, ganadores, onClose }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Animación de entrada
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start();

      // Reproducir sonido según el tipo de premio
      reproducirSonido(ganadores.Premio);
    }
  }, [visible]);

  const reproducirSonido = async (tipoPremio) => {
    try {
      const soundMap = {
        'Cartón lleno': require('../../sounds/women/bingo.wav'),
        'Línea': require('../../sounds/women/linea.wav'),
        'Terno': require('../../sounds/women/terno.wav'),
        'Cuarta': require('../../sounds/women/cuarta.wav'),
      };

      const sound = soundMap[tipoPremio];
      if (sound) {
        const { sound: audioPlayer } = await Audio.Sound.createAsync(sound);
        await audioPlayer.playAsync();
      }
    } catch (error) {
    }
  };

  const getIconForPrize = (premio) => {
    const iconMap = {
      'Cárton lleno': 'trophy',
      'Línea': 'vector-line',
      'Cuarta': 'arrow-top-right',
      'Terno': 'arrow-top-right',
    };
    return iconMap[premio.toUpperCase()] || 'star';
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View 
        style={[
          styles.modalContainer,
          { opacity: fadeAnim }
        ]}
      >
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.headerContainer}>
            <MaterialCommunityIcons 
              name={getIconForPrize(ganadores.Premio)}
              size={30}
              color={BingoColors.primary}
            />
            <Text style={styles.title}>
              {ganadores.Nombres.length === 1 ? '¡Ganador!' : '¡Ganadores!'}
            </Text>
          </View>

          <Text style={styles.premioText}>
            Premio: {ganadores.Premio}
          </Text>

          <ScrollView style={styles.scrollContainer}>
            {ganadores.Nombres.length > 0 ? (
              ganadores.Nombres.map((nombre, index) => (
                <Animated.View
                  key={index}
                  entering={Animated.sequence([
                    Animated.delay(index * 200),
                    Animated.spring({
                      duration: 500,
                      useNativeDriver: true,
                    })
                  ])}
                  style={styles.ganadorContainer}
                >
                  <MaterialCommunityIcons 
                    name="account-circle"
                    size={24}
                    color={BingoColors.secondary}
                  />
                  <Text style={styles.ganador}>{nombre.usuario}</Text>
                </Animated.View>
              ))
            ) : (
              <Text style={styles.noGanadoresText}>
                No hay ganadores para este premio.
              </Text>
            )}
          </ScrollView>

          <LottieView
            source={require('../Animations/confetti.json')}
            autoPlay
            loop={false}
            style={styles.confetti}
          />

          <Button
            mode="contained"
            style={styles.closeButton}
            onPress={onClose}
            icon="close-circle"
          >
            Cerrar
          </Button>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: BingoColors.primary,
  },
  premioText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: BingoColors.secondary,
  },
  scrollContainer: {
    maxHeight: Dimensions.get('window').height * 0.4,
    marginBottom: 20,
  },
  ganadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  ganador: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  noGanadoresText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: BingoColors.secondary,
  },
});