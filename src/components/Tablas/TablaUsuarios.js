import * as React from "react";
import { DataTable, IconButton } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";

const TablaUsuarios = ({
  listaFiltrada,
  abrirModal,
  setUsuario,
  abrirModal2,
  abrirModal3,
}) => {
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4, 10]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState([10]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, listaFiltrada.length);
  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  const mostrarUsuario = (user) => {
    setUsuario(user);
    abrirModal();
  };
  const mostrarAgregarCreditos = (user) => {
    setUsuario(user);
    abrirModal2();
  };
  const mostrarRetirarCreditos = (user) => {
    setUsuario(user);
    abrirModal3();
  };
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Nombre</DataTable.Title>
        <DataTable.Title>Teléfono</DataTable.Title>
        <DataTable.Title numeric>Acción</DataTable.Title>
      </DataTable.Header>

      {listaFiltrada.slice(from, to).map((item) => (
        <DataTable.Row
          key={item.id}
          style={{ borderTopWidth: 1, borderTopColor: BingoColors.tertiary }}
        >
          <DataTable.Cell>{item.Nombres}</DataTable.Cell>
          <DataTable.Cell>{item.Telefono}</DataTable.Cell>
          <DataTable.Cell numeric>
            <IconButton
              onPress={() => mostrarRetirarCreditos(item)}
              mode="contained"
              style={{ backgroundColor: BingoColors.white }}
              iconColor={BingoColors.black}
              size={20}
              icon={"cash-minus"}
            ></IconButton>
            <IconButton
              onPress={() => mostrarAgregarCreditos(item)}
              mode="contained"
              style={{ backgroundColor: BingoColors.white }}
              iconColor={BingoColors.black}
              size={20}
              icon={"cash-plus"}
            ></IconButton>
            <IconButton
              onPress={() => mostrarUsuario(item)}
              mode="contained"
              style={{ backgroundColor: BingoColors.white }}
              iconColor={BingoColors.black}
              size={20}
              icon={"account-eye-outline"}
            ></IconButton>
          </DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(listaFiltrada.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${listaFiltrada.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={"Rows per page"}
      />
    </DataTable>
  );
};

export default TablaUsuarios;
