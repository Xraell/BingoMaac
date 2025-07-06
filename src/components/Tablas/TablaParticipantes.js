import * as React from "react";
import { DataTable, IconButton } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";

const TablaParticipantes = ({
  listaFiltrada,
  abrirModal,
  setUsuario,
}) => {
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4, 7]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState([7]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, listaFiltrada.length);
  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  const mostrarUsuario = (user) => {
    setUsuario(user);
    abrirModal();
  };
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Nombre</DataTable.Title>
        <DataTable.Title>Apellido</DataTable.Title>
        <DataTable.Title numeric>Cantidad</DataTable.Title>
        <DataTable.Title numeric>Acción</DataTable.Title>
      </DataTable.Header>

      {listaFiltrada.slice(from, to).map((item,index) => (
        <DataTable.Row
          key={index}
          style={{ borderTopWidth: 1, borderTopColor: BingoColors.tertiary }}
        >
          <DataTable.Cell>{item.Nombres}</DataTable.Cell>
          <DataTable.Cell>{item.Apellidos}</DataTable.Cell>
          <DataTable.Cell numeric>{item.total_boletos}</DataTable.Cell>
          <DataTable.Cell numeric>
            <IconButton
              onPress={() => mostrarUsuario(item)}
              mode="contained"
              style={{ backgroundColor: BingoColors.white }}
              iconColor={BingoColors.black}
              size={20}
              icon={"view-list"}
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

export default TablaParticipantes;
