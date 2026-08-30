import { pedirODevolverNull, pedirOLanzar } from "./http";

export const crearObjetoGanadores = (
  usuarios_ganadores,
  idPartida,
  idPremio
) => {
  return {
    usuarios_ganadores,
    idPartida:Number(idPartida),
    idPremio:Number(idPremio),
  };
};

export const ObtenerGanadoresPorPartida = async (idPartida) => {
  return pedirODevolverNull("/ganador/partida/" + idPartida, "ObtenerGanadoresPorPartida");
};

export const agregarGanadoresPremio = async (Ganador) => {
  return pedirOLanzar("/ganador/crearGanadores", "Ganador", {
    method: "POST",
    body: JSON.stringify(Ganador),
  });
};
