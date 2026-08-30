import React from "react";
import { renderizarArbol } from "../../../test-utils/render";

// ModalEditarPartida pide los premios de la partida al montar. Se mockea solo
// esa funcion para que el render sea deterministico; el resto de Utils/Partida
// sigue siendo el real.
jest.mock("../../../Utils/Partida", () => ({
  ...jest.requireActual("../../../Utils/Partida"),
  ObtenerPremiosPartida: jest.fn().mockResolvedValue({ premios: [] }),
}));

import ModalActivaTuCuenta from "../ModalActivaTuCuenta";
import ModalCodigoReferido from "../ModalCodigoReferido";
import ModalComoConseguirCredito from "../ModalComoConseguirCredito";
import ModalComoFunciona from "../ModalComoFunciona";
import ModalComoRetirarCredito from "../ModalComoRetirarCredito";
import ModalAgregarPromocion from "../ModalAgregarPromocion";
import ModalDetallesParticipante from "../ModalDetallesParticipante";
import ModalAgregarCredito from "../ModalAgregarCredito";
import ModalDetallesUsuario from "../ModalDetallesUsuario";
import ModalRetirarCredito from "../ModalRetirarCredito";
import ModalAgregarPartida from "../ModalAgregarPartida";
import ModalEditarPartida from "../ModalEditarPartida";

// Estos snapshots son la red de seguridad de la tarea 03 de
// doc/estilos-centralizados/: fotografian el arbol renderizado ANTES de mover
// ningun estilo. Si al extraer una constante compartida cambia una propiedad,
// el diff del snapshot lo señala.
//
// Un snapshot compara arboles de React, no pixeles: sirve para detectar que un
// estilo cambio, no para garantizar que la pantalla se ve bien.

const usuario = {
  id: 1,
  Nombres: "Ana",
  Apellidos: "Gomez",
  Telefono: "555",
  Creditos: 100,
  numeros_serial: "1,2,3",
};

describe("modales autocontenidos", () => {
  it("ModalActivaTuCuenta", () => {
    expect(renderizarArbol(<ModalActivaTuCuenta />)).toMatchSnapshot();
  });

  it("ModalCodigoReferido", () => {
    expect(renderizarArbol(<ModalCodigoReferido />)).toMatchSnapshot();
  });

  it("ModalComoConseguirCredito", () => {
    expect(renderizarArbol(<ModalComoConseguirCredito />)).toMatchSnapshot();
  });

  it("ModalComoFunciona", () => {
    expect(renderizarArbol(<ModalComoFunciona />)).toMatchSnapshot();
  });

  it("ModalComoRetirarCredito", () => {
    expect(renderizarArbol(<ModalComoRetirarCredito />)).toMatchSnapshot();
  });
});

describe("modales con props", () => {
  it("ModalAgregarPromocion", () => {
    expect(
      renderizarArbol(
        <ModalAgregarPromocion promociones={[]} setPromociones={() => {}} />
      )
    ).toMatchSnapshot();
  });

  it("ModalDetallesParticipante", () => {
    expect(
      renderizarArbol(
        <ModalDetallesParticipante
          usuario={usuario}
          visible={true}
          setVisible={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
});

describe("modales que consumen AppContext", () => {
  it("ModalAgregarCredito", () => {
    expect(
      renderizarArbol(
        <ModalAgregarCredito usuario={usuario} visible={true} setVisible={() => {}} />,
        { conContexto: true }
      )
    ).toMatchSnapshot();
  });

  it("ModalDetallesUsuario", () => {
    expect(
      renderizarArbol(
        <ModalDetallesUsuario usuario={usuario} visible={true} setVisible={() => {}} />,
        { conContexto: true }
      )
    ).toMatchSnapshot();
  });

  it("ModalRetirarCredito", () => {
    expect(
      renderizarArbol(
        <ModalRetirarCredito usuario={usuario} visible={true} setVisible={() => {}} />,
        { conContexto: true }
      )
    ).toMatchSnapshot();
  });

  it("ModalAgregarPartida", () => {
    expect(
      renderizarArbol(<ModalAgregarPartida />, { conContexto: true })
    ).toMatchSnapshot();
  });

  it("ModalEditarPartida", () => {
    expect(
      renderizarArbol(
        <ModalEditarPartida
          partida={{ id: 1, NroPartida: 5, Descripcion: "Partida", Activo: 1 }}
          visible={true}
          setVisible={() => {}}
        />,
        { conContexto: true }
      )
    ).toMatchSnapshot();
  });
});
