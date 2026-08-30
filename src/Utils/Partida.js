import { apiFetch, pedirODevolverNull, pedirOLanzar } from "./http";

export const crearObjetoPartida = (
  NroPartida,
  Descripcion,
  Activo,
  CostoBoleto
) => {
  return {
    NroPartida,
    Descripcion,
    Activo,
    CostoBoleto
  };
};
export const ObtenerPartidas = async () => {
  try {
    const data = await apiFetch("/partida");
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Partidas:", error);
    return null;
  }
};

export const ObtenerPremiosPartida = async (idPartida) => {
  return pedirODevolverNull("/partida/obtener-premios/" + idPartida, "ObtenerpremiosPartida");
};
export const ObtenerPartidaActual = async () => {
  return pedirODevolverNull("/partida/obtener-partida-actual", "obtener partida actual");
};

export const ObtenerDatosPartida = async (idPartida, idUsuario) => {
  try {
    const ruta =
      "/partida/obtener-datos/" +
      idPartida +
      (idUsuario ? "?idUsuario=" + idUsuario : "");
    const data = await apiFetch(ruta);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en obtener datos partida:", error);
    return null;
  }
};
export const agregarPartida = async (Partida, Promociones, Costo, Premios) => {
  return pedirOLanzar("/partida/crear", "Partida", {
    method: "POST",
    body: JSON.stringify({
      partida: Partida,
      promociones: Promociones,
      premio: Premios,
      costo: Costo
    }),
  });
};

export const actualizarPartida = async (User, id) => {
  try {
    await apiFetch("/partida/" + id, {
      method: "PUT",
      body: JSON.stringify(User),
    });
    return true;
  } catch (error) {
    console.error("Error en Partida:", error);
    throw error;
  }
};
export const eliminarPartida = async (id) => {
  try {
    await apiFetch("/partida/" + id, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error en Partida:", error);
    throw error;
  }
};
