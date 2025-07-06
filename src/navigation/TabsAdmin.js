import { StyleSheet, Text, View } from 'react-native'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Partida from '../screens/Admin/Partida';
import { BingoColors } from '../Theme/Colors';
import Usuario from '../screens/Admin/Usuario';
import { ObtenerPartidaActual, ObtenerPartidas } from '../Utils/Partida';
import { useEffect } from 'react';
import { useAppContext } from '../context/AppProvider';
import { ObtenerUsuarios } from '../Utils/Usuario';
import Juego from '../screens/Admin/Juego';
import Participante from '../screens/Admin/Participante';
import Creditos from '../screens/Admin/Creditos';
const Tab = createMaterialBottomTabNavigator();
export default function TabsAdmin() {
  const {setPartidaActual,setPartidas,setListUsers}= useAppContext()
  useEffect(() => {
    cargarDatos()
  }, [])
  const cargarDatos = async ()=>{
    const response = await ObtenerPartidaActual()
    if(response){
      
    setPartidaActual(response)
    }
    const lista = await ObtenerPartidas()
    setPartidas(lista)
    const usuarios = await ObtenerUsuarios()
    setListUsers(usuarios)
    console.log("response: ", response);
    
  }
  return (
    <Tab.Navigator
      initialRouteName="Partida"
      activeColor={BingoColors.white}
      inactiveColor={BingoColors.white}
      activeIndicatorStyle={{ backgroundColor: BingoColors.white }}
      barStyle={{ backgroundColor: BingoColors.primary }}
    >
      <Tab.Screen
        name="Partida"
        component={Partida}
        options={{
          tabBarLabel: "Partida",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="ticket"
              color={focused ? BingoColors.primary : BingoColors.white}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Usuario"
        component={Usuario}
        options={{
          tabBarLabel: "Usuarios",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="account-group"
              color={focused ? BingoColors.black : BingoColors.white}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Participantes"
        component={Participante}
        options={{
          tabBarLabel: "Participantes",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="account-group"
              color={focused ? BingoColors.black : BingoColors.white}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Creditos"
        component={Creditos}
        options={{
          tabBarLabel: "Creditos",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="cash-multiple"
              color={focused ? BingoColors.black : BingoColors.white}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Juego"
        component={Juego}
        options={{
          tabBarLabel: "Juego",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="play"
              color={focused ? BingoColors.black : BingoColors.white}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
const styles = StyleSheet.create({})