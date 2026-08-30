import { apiFetch } from "./http";

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
  try {
    const data = await apiFetch("/ganador/partida/" + idPartida);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en ObtenerGanadoresPorPartida:", error);
    return null;
  }
};

export const agregarGanadoresPremio = async (Ganador) => {
  try {
    const data = await apiFetch("/ganador/crearGanadores", {
      method: "POST",
      body: JSON.stringify(Ganador),
    });
    return data;
  } catch (error) {
    console.error("Error en Ganador:", error);
    throw error;
  }
};
