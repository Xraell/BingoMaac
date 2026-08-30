import React, { useEffect, useState } from "react";
import { PermissionsAndroid, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { format } from "date-fns";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import * as Sharing from "expo-sharing";
import { useAppContext } from "../../context/AppProvider";
import { ObtenerReportePartidaNuevo } from "../../Utils/Boleto";
import { requestStoragePermission } from "../../Utils/storagePermissions";

export default function BotonExportarReporte() {
  const [datosExport, setDatosExport] = useState({});
  const { partidaActual } = useAppContext();
  const fechaActual = format(new Date(), "dd/MM/yyyy");
  const horaActual = format(new Date(), "hh:mm a");
  const crearTablaTickets = (boletos,datosExportPort) => {
    const COLUMNAS = 10;
    const filas = Math.ceil(boletos.length / COLUMNAS);
    let tabla = [];

    tabla.push({
      A: fechaActual,
      B: horaActual,
      C: `Partida N° ${partidaActual.NroPartida}`,
      D: "",
      E: "TABLA DE BOLETOS"
    });

    tabla.push({});

    for (let i = 0; i < filas; i++) {
      tabla.push({});
    }

    for (let col = 0; col < COLUMNAS; col++) {
      const colKey = String.fromCharCode(65 + col);

      for (let fila = 0; fila < filas; fila++) {
        const index = col * filas + fila;

        if (index < boletos.length) {
          const boleto = boletos[index];
          tabla[fila + 2][colKey] = `#${boleto.NroSerial} ${boleto.Nombres} ${boleto.Apellidos}`;
        } else {
          tabla[fila + 2][colKey] = "";
        }
      }
    }


    tabla.push({});
    tabla.push({});

    tabla.push({
      A: "RESUMEN DE PARTIDA",
      B: "",
      C: "",
      D: "",
      E: ""
    });

    tabla.push({
      A: "Total Boletos Vendidos:",
      B: datosExportPort.total_boletos_vendidos,
      C: "",
      D: "",
      E: ""
    });

    tabla.push({
      A: "Total Boletos en Juego:",
      B: datosExportPort.total_boletos_en_juego,
      C: "",
      D: "",
      E: ""
    });

    tabla.push({
      A: "Monto Recaudado:",
      B: `Bs/ ${datosExportPort.monto_recaudado}`,
      C: "",
      D: "",
      E: ""
    });

    return tabla;
  };



  const exportar = async (datos) => {
    try {
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(datos);

      // Ajustar ancho de columnas
      const colWidths = Array(10).fill({ wch: 30 });
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(
        wb,
        ws,
        `Partida_${partidaActual.NroPartida}`
      );

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const fileName = `Informe_partida_${partidaActual.NroPartida}_${horaActual}.xlsx`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    } catch (error) {
    }
  };
  const handleExport = async () => {
    try {

      const datosRecibidos = await ObtenerReportePartidaNuevo(partidaActual.id);
      setDatosExport(datosRecibidos);

      const tabla = crearTablaTickets(datosRecibidos.boletos_vendidos,datosRecibidos);
      await exportar(tabla);
    } catch (error) {
    }
  };

  return (
    <View style={styles.container}>
      <Button
        mode="elevated"
        icon="microsoft-excel"
        style={{ margin: 20 }}
        onPress={handleExport}
      >
        EXPORTAR EN EXCEL
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  }
});