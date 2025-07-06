import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, Animated } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";
import ItemNro from "../Items/ItemNro";
import { PinchGestureHandler, State } from "react-native-gesture-handler";

export default function ListaNrosRetirados({ lista }) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const baseScale = useRef(new Animated.Value(1)).current;

  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: true }
  );

  const onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      baseScale.setValue(scale._value);
      scale.setValue(1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Números retirados
      </Text>
      <PinchGestureHandler
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchHandlerStateChange}
      >
        <Animated.View>
          <Surface 
            style={[
              styles.bx, 
              { 
                backgroundColor: BingoColors.primary,
                transform: [{ scale: Animated.multiply(scale, baseScale) }]
              }
            ]} 
            elevation={4}
          >
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {lista.map((e, index) => (
                <ItemNro
                  key={e}
                  nro={e}
                  index={index}
                  totalItems={lista.length}
                  theme={theme}
                />
              ))}
            </ScrollView>
          </Surface>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    margin: 5,
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: 18,
  },
  bx: {
    marginHorizontal: 20,
    padding: 20,
    borderBottomRightRadius: 1000,
    borderTopLeftRadius: 1000,
    overflow: 'visible'
  },
});