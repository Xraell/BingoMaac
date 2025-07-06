import * as React from "react";
import { DataTable, IconButton } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";

const Tablapartidas = ({ lista, abrirModal,setPartida}) => {
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4, 7]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState([7]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, lista.length);
  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  const mostrarpartida = (partidaP) => {
    setPartida(partidaP)
    console.log("partidaP: ", partidaP);
    abrirModal();
  };
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>No. de partida</DataTable.Title>
        <DataTable.Title>Activo</DataTable.Title>
        <DataTable.Title numeric>Acción</DataTable.Title>
      </DataTable.Header>

      {lista.slice(from, to).map((item) => (
        <DataTable.Row
          key={item.id}
          style={{ borderTopWidth: 1, borderTopColor: BingoColors.tertiary }}
        >
          <DataTable.Cell>{item.NroPartida}</DataTable.Cell>
          <DataTable.Cell>{item.Activo==1?"ACTIVO":"INACTIVO"}</DataTable.Cell>
          <DataTable.Cell numeric>
            <IconButton
            onPress={()=>mostrarpartida(item)}
              mode="contained"
              style={{ backgroundColor: BingoColors.primary }}
              iconColor={BingoColors.white}
              size={20}
              icon={"clipboard-list"}
            ></IconButton>
          </DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(lista.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${lista.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={"Rows per page"}
      />
    </DataTable>
  );
};

export default Tablapartidas;
