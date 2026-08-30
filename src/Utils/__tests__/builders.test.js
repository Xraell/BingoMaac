import { crearObjetoUsuario } from "../Usuario";
import { crearObjetoPartida } from "../Partida";
import { crearObjetocompra } from "../Compra";
import { crearObjetoMensaje } from "../Mensaje";
import { crearObjetoGanadores } from "../Ganador";

describe("crearObjeto* (funciones puras de src/Utils/)", () => {
  it("crearObjetoUsuario arma el objeto con los campos en orden", () => {
    const usuario = crearObjetoUsuario("Ana", "Gomez", "555", 0, "USER", "clave123");

    expect(usuario).toEqual({
      Nombres: "Ana",
      Apellidos: "Gomez",
      Telefono: "555",
      Creditos: 0,
      Rol: "USER",
      Clave: "clave123",
    });
  });

  it("crearObjetoPartida arma el objeto con los campos en orden", () => {
    const partida = crearObjetoPartida(12, "Partida de prueba", true, 5);

    expect(partida).toEqual({
      NroPartida: 12,
      Descripcion: "Partida de prueba",
      Activo: true,
      CostoBoleto: 5,
    });
  });

  it("crearObjetocompra arma el objeto con los campos en orden", () => {
    const compra = crearObjetocompra(10, 3, "compra de boleto");

    expect(compra).toEqual({
      Monto: 10,
      idUsuario: 3,
      Descripcion: "compra de boleto",
    });
  });

  it("crearObjetoMensaje convierte idPartida y audio a numero", () => {
    const mensaje = crearObjetoMensaje(1, "7", "Titulo", "Descripcion", "3");

    expect(mensaje).toEqual({
      idMensaje: 1,
      idPartida: 7,
      titulo: "Titulo",
      descripcion: "Descripcion",
      audio: 3,
    });
  });

  it("crearObjetoGanadores convierte idPartida e idPremio a numero", () => {
    const ganadores = crearObjetoGanadores([{ idUsuario: 1 }], "9", "2");

    expect(ganadores).toEqual({
      usuarios_ganadores: [{ idUsuario: 1 }],
      idPartida: 9,
      idPremio: 2,
    });
  });
});
