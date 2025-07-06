import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';
import { Surface } from 'react-native-paper';
import { BingoColors } from '../../Theme/Colors';
import { Audio } from 'expo-av';
import soundFilesItemNro from '../Data/soundFilesItemNro';

// Mapa de archivos de sonido

export default function ItemNro({ nro, index, totalItems, theme }) {
  const floatAnimValue = useRef(new Animated.Value(0)).current;
  const entranceAnimValue = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null); // Referencia para el sonido

  useEffect(() => {
    // Cargar y reproducir el sonido si el índice es 0 (último número agregado)
    const playSound = async () => {
      if (index === 0) {
        try {
          const soundFile = soundFilesItemNro[nro]; // Obtiene el archivo de sonido correspondiente
          if (soundFile) {
            const { sound } = await Audio.Sound.createAsync(soundFile);
            soundRef.current = sound;
            await sound.playAsync();
          } else {
            console.log('Archivo de sonido no encontrado para:', nro);
          }
        } catch (error) {
          console.log('Error al reproducir el sonido:', error);
        }
      }
    };

    playSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [index, nro]);

  useEffect(() => {
    // Animación de entrada
    Animated.timing(entranceAnimValue, {
      toValue: 1,
      duration: 500,
      delay: index * 100, // Retraso según el índice
      useNativeDriver: true,
    }).start();

    // Animación flotante
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    floatAnimation.start();

    return () => {
      floatAnimation.stop();
    };
  }, []);

  const getSize = () => {
    const maxSize = 70;
    const minSize = 50;
    const sizeStep = (maxSize - minSize) / (totalItems - 1);

    if (isNaN(sizeStep) || sizeStep < 0) {
      return minSize;
    }

    if (index === 0) {
      return 120;
    }

    const calculatedSize = maxSize - (index - 1) * sizeStep;
    return Math.max(calculatedSize, minSize);
  };

  const size = getSize();

  // Animación flotante
  const translateY = floatAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  const scale = floatAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const rotate = floatAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });

  // Animación de entrada
  const entranceTranslateY = entranceAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0], // Empieza 50 píxeles más abajo y se mueve hacia arriba
  });

  const entranceOpacity = entranceAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: Animated.add(translateY, entranceTranslateY) },
          { scale },
          { rotate },
        ],
        opacity: entranceOpacity,
        marginRight: 10,
      }}
    >
      <Surface
        style={[
          styles.item,
          {
            backgroundColor: theme.colors.primaryContainer,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 5,
            borderStyle: 'dotted',
            borderColor: BingoColors.white,
          },
        ]}
        elevation={4}
      >
        <Text
          style={[
            styles.itemText,
            {
              fontSize: size * 0.5,
              color: theme.colors.onPrimaryContainer,
            },
          ]}
        >
          {nro}
        </Text>
      </Surface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontWeight: 'bold',
  },
});
