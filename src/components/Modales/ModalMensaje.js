import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { Audio } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ModalMensaje({ visible, mensaje, onClose }) {
  const { audio, descripcion, titulo } = mensaje;
  const [sound, setSound] = useState(null);
  
  // Animated values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      confettiAnim.setValue(0);
      bounceAnim.setValue(0);

      // Start animations sequence
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.loop(
            Animated.sequence([
              Animated.timing(bounceAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
              }),
              Animated.timing(bounceAnim, {
                toValue: 0,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
              }),
            ])
          ),
          Animated.loop(
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 3000,
              easing: Easing.linear,
              useNativeDriver: true,
            })
          ),
          Animated.timing(confettiAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Play audio
      playAudio();
    }
  }, [visible]);

  const playAudio = async () => {
    if (audio !== 0) {
      try {
        const audioUri = getAudioUri(audio);
        const newSound = new Audio.Sound();
        await newSound.loadAsync(audioUri);
        await newSound.playAsync();
        setSound(newSound);
      } catch (error) {
        console.error("Error al reproducir audio:", error);
      }
    }
  };

  const getAudioUri = (audioId) => {
    switch (audioId) {
      case 1:
        return require("../../sounds/women/terminado.wav");
      case 2:
        return require("../../sounds/women/aplauso.wav");
      default:
        return null;
    }
  };

  // Create transform animations
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0],
  });

  // Render confetti
  const renderConfetti = () => {
    const confetti = [];
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
    
    for (let i = 0; i < 20; i++) {
      const randomX = Math.random() * width;
      const randomDelay = Math.random() * 1000;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.push(
        <Animated.View
          key={i}
          style={[
            styles.confetti,
            {
              left: randomX,
              backgroundColor: randomColor,
              transform: [{
                translateY: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 600],
                })
              }, {
                rotate: `${Math.random() * 360}deg`,
              }],
            }
          ]}
        />
      );
    }
    return confetti;
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        {renderConfetti()}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: bounce },
              ],
            },
          ]}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <MaterialCommunityIcons name="star-face" size={60} color="#FFD700" />
          </Animated.View>
          
          <Text style={styles.title}>{titulo}</Text>
          <Text style={styles.description}>{descripcion}</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (sound) {
                sound.stopAsync();
              }
              onClose();
            }}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginVertical: 15,
    textAlign: "center",
    textTransform: "uppercase",
  },
  description: {
    fontSize: 18,
    color: "#34495E",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
  },
  confetti: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});