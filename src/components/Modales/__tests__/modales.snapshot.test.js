import React from "react";
import { renderizarArbol, renderizarAbierto } from "../../../test-utils/render";

// ModalEditarPartida pide los premios de la partida al montar. Se mockea solo
// esa funcion para que el render sea deterministico; el resto de Utils/Partida
// sigue siendo el real.
// ModalBoleto llama a useNavigation(), que exige un NavigationContainer por
// encima. Se sustituye solo ese hook para poder montarlo suelto.
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({ navigate: jest.fn() }),
}));

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
import ModalBoleto from "../ModalBoleto";
import ModalBoletoGanador from "../ModalBoletoGanador";

// Estos snapshots son la red de seguridad de la tarea 03 de
// doc/estilos-centralizados/: fotografian el arbol renderizado ANTES de mover
// ningun estilo. Si al extraer una constante compartida cambia una propiedad,
// el diff del snapshot lo señala.
//
// Un snapshot compara arboles de React, no pixeles: sirve para detectar que un
// estilo cambio, no para garantizar que la pantalla se ve bien.

// Un boleto tal y como lo devuelve la API: 4 campos de cabecera y luego los 15
// numeros. El orden importa: los componentes hacen Object.values(...).slice(4).
const boleto = {
  id: 1,
  NroSerial: "0001",
  Precio: 10,
  idPartida: 1,
  Nro1: 5,
  Nro2: 12,
  Nro3: 23,
  Nro4: 31,
  Nro5: 44,
  Nro6: 50,
  Nro7: 61,
  Nro8: 72,
  Nro9: 85,
  Nro10: 8,
  Nro11: 19,
  Nro12: 27,
  Nro13: 38,
  Nro14: 55,
  Nro15: 66,
};

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

// Los modales de arriba que guardan `visible` en su propio estado se montan
// cerrados: su contenido -donde viven `button`, `buttonClose` y `textStyle`- no
// llega al arbol. Sin estos snapshots, la red de la tarea 03 solo cubriria 5 de
// los 12 modales que toca. Aqui se abren pulsando su boton.
describe("modales abiertos", () => {
  it("ModalActivaTuCuenta abierto", () => {
    expect(
      renderizarAbierto(
        <ModalActivaTuCuenta />,
        "ACTIVA Y ABONA SALDO A SU CUENTA AQUÍ!"
      )
    ).toMatchSnapshot();
  });

  it("ModalCodigoReferido abierto", () => {
    expect(
      renderizarAbierto(<ModalCodigoReferido />, "¿CÓMO FUNCIONA EL CÓDIGO DE REFERIDO?")
    ).toMatchSnapshot();
  });

  it("ModalComoConseguirCredito abierto", () => {
    expect(
      renderizarAbierto(<ModalComoConseguirCredito />, "¿COMO CONSEGUIR CRÉDITOS?")
    ).toMatchSnapshot();
  });

  it("ModalComoFunciona abierto", () => {
    expect(
      renderizarAbierto(<ModalComoFunciona />, "¿COMO FUNCIONA LA APP BINGO MAAC?")
    ).toMatchSnapshot();
  });

  it("ModalComoRetirarCredito abierto", () => {
    expect(
      renderizarAbierto(<ModalComoRetirarCredito />, "¿COMO RETIRAR CREDITO?")
    ).toMatchSnapshot();
  });

  it("ModalAgregarPartida abierto", () => {
    expect(
      renderizarAbierto(<ModalAgregarPartida />, "Agregar partida", { conContexto: true })
    ).toMatchSnapshot();
  });

  it("ModalAgregarPromocion abierto", () => {
    expect(
      renderizarAbierto(
        <ModalAgregarPromocion promociones={[]} setPromociones={() => {}} />,
        "Abrir Promociones"
      )
    ).toMatchSnapshot();
  });
});

// ModalBoleto y ModalBoletoGanador son los otros dos consumidores del grupo
// mayoritario de `button`. Sin ellos la red cubriria 10 de 12.
describe("modales de boleto", () => {
  it("ModalBoleto", () => {
    expect(
      renderizarArbol(
        <ModalBoleto
          visible={true}
          setModalVisible={() => {}}
          boleto={boleto}
          boletos={[boleto]}
          setBoletos={() => {}}
        />,
        { conContexto: true }
      )
    ).toMatchSnapshot();
  });

  it("ModalBoletoGanador", () => {
    expect(
      renderizarArbol(
        <ModalBoletoGanador
          visible={true}
          setModalVisible={() => {}}
          ganador={boleto}
          numerosPartida={[5, 12, 23]}
        />
      )
    ).toMatchSnapshot();
  });
});
