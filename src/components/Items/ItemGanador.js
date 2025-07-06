import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from "react-native";
import { BingoColors } from "../../Theme/Colors";
import { IconButton } from "react-native-paper";

export default function ItemGanador({
  ganador,
  completo,
  setGanador,
  verGanador,
  index
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        delay: index * 100,
        useNativeDriver: false,
      }),
    ]).start();

    // Continuous subtle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { 
          toValue: 1.05, 
          duration: 3000, 
          easing: Easing.inOut(Easing.bounce),
          useNativeDriver: true 
        }),
        Animated.timing(pulseAnim, { 
          toValue: 1, 
          duration: 3000, 
          easing: Easing.inOut(Easing.bounce),
          useNativeDriver: true 
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      BingoColors.secondary, 
      completo ? 'gold' : BingoColors.tertiary,
      completo ? '#FFD700' : BingoColors.primary // Slight color shift for continuous effect
    ],
  });

  const textColor = completo ? BingoColors.black : BingoColors.white;

  return (
    <Animated.View style={[
      styles.container,
      {
        transform: [
          { scale: scaleAnim },
          { scale: pulseAnim }, // Apply pulse animation
        ],
      }
    ]}>
      <TouchableOpacity
        style={[
          styles.bx,
          { backgroundColor },
        ]}
        onPress={() => {
          setGanador(ganador);
          verGanador();
        }}
      >
        <Animated.Text
          style={[
            styles.txt,
            { color: textColor },
          ]}
        >
          {ganador.Nombres} {ganador.Apellidos}
        </Animated.Text>
        <View style={styles.rightContent}>
          <IconButton
            icon={"page-next"}
            iconColor={textColor}
            size={20}
          />
          <Animated.Text
            style={[
              styles.serialNumber,
              { 
                color: textColor, 
                borderColor: textColor,
                transform: [{ scale: pulseAnim }], // Apply pulse to serial number
              },
            ]}
          >
            {ganador.NroSerial}
          </Animated.Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  bx: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  txt: {
    fontWeight: "bold",
    fontSize: 16,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  serialNumber: {
    fontWeight: "bold",
    textAlignVertical: 'center',
    borderRadius: 10,
    borderWidth: 2,
    marginVertical: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    textAlign: 'center',
    fontSize: 14,
  },
});