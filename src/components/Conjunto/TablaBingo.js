import React, { useState } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, Text } from 'react-native';
import { BingoColors } from '../../Theme/Colors';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

const TablaBingo = ({ numerosFormateados = [] }) => {
  const [scale, setScale] = useState(1);
  const screenWidth = Dimensions.get('window').width;
  const baseCellSize = (screenWidth - 40) / 10;

  const onPinchGestureEvent = (event) => {
    const newScale = Math.min(Math.max(event.nativeEvent.scale, 0.5), 3);
    setScale(newScale);
  };

  const createBingoNumbers = () => {
    const numbers = [];
    let currentNumber = 1;
    
    for (let i = 0; i < 9; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        if (currentNumber <= 90) {
          row.push(currentNumber);
          currentNumber++;
        }
      }
      numbers.push(row);
    }
    return numbers;
  };

  const getBackgroundColor = (number) => {
    return numerosFormateados.includes(number) ? BingoColors.primary : BingoColors.white;
  };

  const getTextColor = (number) => {
    return numerosFormateados.includes(number) ? BingoColors.white : BingoColors.black;
  };

  const bingoNumbers = createBingoNumbers();

  return (
    <PinchGestureHandler
      onGestureEvent={onPinchGestureEvent}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
          setScale(Math.min(Math.max(nativeEvent.scale, 0.5), 3));
        }
      }}
    >
      <ScrollView style={{ height: '100%' }} contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.container, { transform: [{ scale }] }]}>
          {bingoNumbers.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((number) => (
                <View
                  key={`cell-${number}`}
                  style={[
                    styles.cell,
                    {
                      width: baseCellSize * scale,
                      height: baseCellSize * scale,
                      backgroundColor: getBackgroundColor(number),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.number,
                      {
                        color: getTextColor(number),
                        fontSize: 16 * scale,
                      },
                    ]}
                  >
                    {number}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </PinchGestureHandler>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: BingoColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  number: {
    fontWeight: 'bold',
  },
});

export default TablaBingo;
