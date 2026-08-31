import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { temaDePrueba } from "../../../test-utils/render";
import ItemBoleto from "../ItemBoleto";

// La API cambio de forma: /boleto/obtener-boletos-partida devuelve idUsuario
// como booleano (false libre / true vendido) desde el arreglo del bug 2, en vez
// del null/id de antes. Ver BACKEND/doc/correccion-hallazgos/02-boletos-partida-rol.md.
//
// El `disabled` de este componente usaba `!= null`, y en JavaScript
// `false != null` es true: con la forma nueva, TODOS los boletos quedaban sin
// responder al toque. Se veian habilitados -la linea de estilo usa truthiness y
// si distingue-, pero no reaccionaban. Fallo silencioso.
//
// Estos tests cubren las dos formas para que el componente siga valiendo si el
// backend volviera a la anterior, y para que la regresion no pueda repetirse
// sin ponerse en rojo.

const boletoBase = {
  NroSerial: 42,
  Precio: 30,
  idPartida: 86,
  Nro1: "1", Nro2: "4", Nro3: "7", Nro4: "9", Nro5: "11",
  Nro6: "12", Nro7: "22", Nro8: "18", Nro9: "14", Nro10: "31",
  Nro11: "32", Nro12: "41", Nro13: "25", Nro14: "7", Nro15: "55",
};

function renderizar(idUsuario) {
  const setBoleto = jest.fn();
  const abrir = jest.fn();
  const vista = render(
    <PaperProvider theme={temaDePrueba}>
      <ItemBoleto
        boleto={{ ...boletoBase, idUsuario }}
        setBoleto={setBoleto}
        abrir={abrir}
      />
    </PaperProvider>
  );
  return { vista, setBoleto, abrir };
}

describe("ItemBoleto", () => {
  describe("con la forma actual de la API (idUsuario booleano)", () => {
    it("un boleto libre (false) se puede pulsar y abre el modal", () => {
      const { vista, setBoleto, abrir } = renderizar(false);

      fireEvent.press(vista.getByText(/N. SERIAL:42/));

      expect(abrir).toHaveBeenCalled();
      expect(setBoleto).toHaveBeenCalled();
      vista.unmount();
    });

    it("un boleto vendido (true) no responde y se marca NO DISPONIBLE", () => {
      const { vista, abrir } = renderizar(true);

      expect(vista.queryByText("NO DISPONIBLE")).not.toBeNull();
      fireEvent.press(vista.getByText(/N. SERIAL:42/));

      expect(abrir).not.toHaveBeenCalled();
      vista.unmount();
    });

    it("un boleto libre no se marca NO DISPONIBLE", () => {
      const { vista } = renderizar(false);

      expect(vista.queryByText("NO DISPONIBLE")).toBeNull();
      vista.unmount();
    });
  });

  describe("con la forma anterior (null / id numerico)", () => {
    it("un boleto libre (null) se puede pulsar", () => {
      const { vista, abrir } = renderizar(null);

      fireEvent.press(vista.getByText(/N. SERIAL:42/));

      expect(abrir).toHaveBeenCalled();
      vista.unmount();
    });

    it("un boleto vendido (id numerico) no responde", () => {
      const { vista, abrir } = renderizar(7);

      expect(vista.queryByText("NO DISPONIBLE")).not.toBeNull();
      fireEvent.press(vista.getByText(/N. SERIAL:42/));

      expect(abrir).not.toHaveBeenCalled();
      vista.unmount();
    });
  });
});
