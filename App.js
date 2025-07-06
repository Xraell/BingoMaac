import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Provider as PaperProvider, DefaultTheme, configureFonts } from "react-native-paper";
import { BingoColors } from './src/Theme/Colors';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppProvider';
import Controller from './src/screens/Controller';
export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: BingoColors.primary,
      secondary: BingoColors.secondary,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppProvider>
          <View style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
              <Controller />
            </PaperProvider>
          </View>
          <StatusBar style='light' />
        </AppProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create();
