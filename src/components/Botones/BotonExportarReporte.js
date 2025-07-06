import React, { useEffect, useState } from "react";
import { PermissionsAndroid, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { format } from "date-fns";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import * as Sharing from "expo-sharing";
import { useAppContext } from "../../context/AppProvider";
import { requestStoragePermission } from "../../Utils/storagePermissions";
export default function BotonExportarReporte({ datos }) {
  console.log("datos: ", datos);
  const [datosExport, setDatosExport] = useState({});
  const { partidaActual } = useAppContext();
  const fechaActual = format(new Date(), "dd/MM/yyyy");
  const horaActual = format(new Date(), "hh:mm a");
  useEffect(() => {
    const formatoReporte = datos.flatMap((e) => {
      const nros = e.numeros_serial.split(",");
      const seriales = nros.map((nro) => ({
        Fecha: "",
        HORA: "",
        "NºPARTIDA": "",
        COMPRO: "",
        NOMBRE: "",
        SERIAL: nro,
      }));
      return [ 
        {
          Fecha: "",
          HORA: "",
          "NºPARTIDA": "",
          COMPRO: e.total_boletos,
          NOMBRE: e.Nombres + " " + e.Apellidos,
          SERIAL: "",
        },
        ...seriales,
      ];
    });
    setDatosExport([{
        Fecha: fechaActual,
        HORA: horaActual,
        NºPARTIDA: partidaActual.NroPartida,
        COMPRO: "",
        NOMBRE: "",
        SERIAL: "",
      },...formatoReporte]);
    console.log("formatoReporte: ", formatoReporte);
  }, [datos]);

  const exportar = async () => {
    try {
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(datosExport);
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Participantes_partida_" + partidaActual.NroPartida
      );
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const fileName =
        "Informe_partida_" +
        partidaActual.NroPartida +
        "_" +
        horaActual +
        ".xlsx";
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      try {
        await FileSystem.writeAsStringAsync(fileUri, wbout, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(fileUri, {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
      } catch (error) {
        console.log("Error writeFile", error);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const ExporTouch = async () => {
    try {
     
        const hasPermission = await requestStoragePermission();
        if (hasPermission) {
          exportar();
          console.log("PERMISO OBTENIDO");
        } else {
          console.log("PERMISO NO OBTENIDO");
        }
    } catch (error) {
      console.log("Error en grsnted:" + error);
      return;
    }
  };
  return (
    <View style={styles.container}>
      <Button
        mode="elevated"
        icon="microsoft-excel"
        style={{ margin: 20 }}
        onPress={() => exportar()}
      >
        EXPORTAR EN EXCEL
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({});
