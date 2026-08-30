import { View } from "react-native";
import { useAppContext } from "../context/AppProvider";
import Login from "./Login";
import { StatusBar } from "expo-status-bar";
import { BingoColors } from "../Theme/Colors";
import TabsUser from "../navigation/TabsUser";
import TopBanner from "../components/Accesorios/TopBanner";
import TabsAdmin from "../navigation/TabsAdmin";
export default function Controller() {
  const { opc } = useAppContext();
  return (
    <View style={{ flex: 1,backgroundColor:BingoColors.background }}>
      {opc != 0 && (
        <>
          <StatusBar style="light"></StatusBar>
          <TopBanner></TopBanner>
        </>
      )}
      {opc == 0 && (
        <>
          <StatusBar style="dark"></StatusBar>
          <Login></Login>
        </>
      )}
      {opc == 1 && <TabsUser />}
      {opc == 2 && <TabsAdmin></TabsAdmin>}
    </View>
  );
}
