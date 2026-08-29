import { StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppProvider";
import { useNavigation } from "@react-navigation/native";
import { BingoColors } from "../Theme/Colors";
import Inicio from "../screens/User/Inicio";
import Boletos from "../screens/User/Boletos";
import MisBoletos from "../screens/User/MisBoletos";
import Perfil from "../screens/User/Perfil";
import { ObtenerDatosPartida, ObtenerPartidaActual } from "../Utils/Partida";
import { ObtenerBoletosUsuario } from "../Utils/Boleto";

const Tab = createMaterialBottomTabNavigator();

export default function TabsUser() {
  const navigation = useNavigation();
  const { user, setPartidaActual, setMisBoletos,setPremios ,setPromociones,setPromocion} = useAppContext();

  useEffect(() => {
    obtenerPActual();
  }, []);
  useEffect(() => {
    if (user.Rol == "USER") {
      obtenerListas()
    }
  }, [user]);
  const obtenerListas = async () => {
    try {

      const response = await ObtenerBoletosUsuario(user.id)
      console.log("🚀 ~ obtenerListas ~ response:", response)
      setMisBoletos(response)
    } catch (error) {
      console.log("error: ", error);
      setMisBoletos([])

    }
  }
  const obtenerPActual = async () => {
    const response = await ObtenerPartidaActual()
    console.log("🚀 ~ obtenerPActual ~ response:", response)
    if (response) {
      obtenerPremiosActual(response.id);
      setPartidaActual(response)
    }
  };
  const obtenerPremiosActual = async (idPartida) => {
    const response = await ObtenerDatosPartida(idPartida, user.id)
    console.log("🚀 ~ obtenerPremiosActual ~ response:", response)
    if (response) {
      setPremios(response.premios)
      setPromociones(response.promociones)
      setPromocion(response.promocionUsuario ?? null)
    }
  };
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      activeColor={BingoColors.white}
      inactiveColor={BingoColors.white}
      activeIndicatorStyle={{ backgroundColor: BingoColors.white }}
      barStyle={{ backgroundColor: BingoColors.primary }}
    >
      <Tab.Screen
        name="Inicio"
        component={Inicio}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="gamepad-variant"
              color={focused ? BingoColors.black : BingoColors.white}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Boletos"
        component={Boletos}
        options={{
          tabBarLabel: "Boletos",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="clover"
              color={focused ? BingoColors.black : BingoColors.white}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MisBoletos"
        component={MisBoletos}
        options={{
          tabBarLabel: "Mis Boletos",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="account"
              color={focused ? BingoColors.black : BingoColors.white}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="account"
              color={focused ? BingoColors.black : BingoColors.white}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
