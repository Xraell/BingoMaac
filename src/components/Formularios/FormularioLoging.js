import { Image, StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppProvider";
import { BingoColors } from "../../Theme/Colors";
import SelectDropdown from "react-native-select-dropdown";
import { codigosTelefonicos, paisesSudamerica } from "../Data/paises";
export default function FormularioLoging({ C, setC, E, setE }) {
  const { heightWindow } = useAppContext();
  const [codigoPais, setCodigoPais] = useState("000");
  const [telefono,setTelefono]= useState("")
  const [pais, setPais] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  useEffect(()=>{
    setE(codigoPais+" "+telefono)
  },[codigoPais,telefono])
  return (
    <View style={[styles.bx]}>
      <Text variant="displaySmall" style={styles.title}>
        Inicio de sesión
      </Text>
      <View
        style={{ height: heightWindow * 0.3, marginTop: heightWindow * 0.01 }}
      >
        <Image
          source={require("../../images/logo.png")}
          style={{ width: "100%", maxHeight: "100%", objectFit: "contain" }}
        ></Image>
        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
        <SelectDropdown
          buttonStyle={{  width: "90%", backgroundColor: BingoColors.white }}
          buttonTextStyle={{ textAlign: "left", color: "#353131" }}
          defaultButtonText="Seleccione su país"
          data={paisesSudamerica}
          onSelect={(selectedItem, index) => {
            setPais(selectedItem);
            setCodigoPais(codigosTelefonicos[index]);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
        <View
          style={{
            width: "80%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            alignItems:'center'
          }}
        >
          <Text
            style={{
              width: "25%",
              textAlign: "center",
              fontWeight: "bold",
              height: "80%",
              textAlignVertical: "center",
              backgroundColor: BingoColors.white,
            }}
            variant="bodyLarge"
          >
            {codigoPais}
          </Text>
          <TextInput
            value={telefono}
            onChangeText={(text) => {
              setTelefono(text);
            }}
            mode="flat"
            label={"Número de celular"}
            keyboardType="phone-pad"
            style={[styles.txtInput, { width: "75%" }]}
          ></TextInput>
        </View>
        </View>
        <TextInput
          label={"Contraseña"}
          value={C}
          onChangeText={(text) => setC(text)}
          secureTextEntry={passwordVisible}
          keyboardType="ascii-capable"
          style={styles.txtInput}
          right={
            <TextInput.Icon
              icon={passwordVisible ? "eye" : "eye-off"}
              color={BingoColors.primary}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          }
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    backgroundColor: BingoColors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "center",
    paddingBottom:40,
    flex: 1,
  },
  title: {
    color: BingoColors.tertiary,
    fontWeight: "bold",
    textAlign: "center",
  },
  txtInput: {
    backgroundColor: BingoColors.white,
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 10,
  },
});
