import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Searchbar } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import { BingoColors } from "../../Theme/Colors";
import { useAppContext } from "../../context/AppProvider";
export default function FiltrarUsuarios({ filtrar }) {
  const { listUsers } = useAppContext();
  const [txtBusqueda, setTxtBusqueda] = useState("");
  const filtros = ["Nombre", "Telefono", "Codigo"];
  const [filtroSeleccionado, setFiltroSeleccionado] = useState(filtros[0]);

  const obtenerCodigoUsuario = (user) => {
    return (
      user.Nombres.substring(0, 2) +
      user.Apellidos.substring(0, 2) +
      user.id +
      user.Telefono.substring(1, 5)
    ).replace(/\s/g, "");
  };
  useEffect(() => {
    if (listUsers) {
      let listaFiltrada = [...listUsers];
      if (txtBusqueda) {
        listaFiltrada = listaFiltrada.filter((usuario) => {
          switch (filtroSeleccionado) {
            case "Nombre":
              return usuario.Nombres.toLowerCase().includes(
                txtBusqueda.toLowerCase()
              );
            case "Telefono":
              return usuario.Telefono.includes(txtBusqueda);
            case "Codigo":
              let txt = txtBusqueda
                .replace(new RegExp("Mi código es:", "g"), "")
                .trim();
              return obtenerCodigoUsuario(usuario).includes(txt);
            default:
              return true;
          }
        });
      }
      filtrar(listaFiltrada);
    }
  }, [txtBusqueda, filtroSeleccionado]);

  return (
    <View style={styles.bx}>
      <Searchbar
        placeholder="Buscar"
        mode="bar"
        style={styles.search}
        onChangeText={setTxtBusqueda}
        value={txtBusqueda.replace(new RegExp("Mi código es:", "g"), "")}
      />
      <SelectDropdown
        buttonStyle={{
          width: "30%",
          borderRadius: 15,
          backgroundColor: BingoColors.white,
          opacity: 0.9,
        }}
        buttonTextStyle={{ textAlign: "left" }}
        defaultButtonText="Filtrar por"
        data={filtros}
        onSelect={(selectedItem, index) => {
          setFiltroSeleccionado(filtros[index]);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  bx: {
    margin: 10,
    flexDirection: "row",
    gap: 10,
  },
  search: {
    backgroundColor: BingoColors.white,
    flexGrow: 1,
  },
});
