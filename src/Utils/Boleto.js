import { apiFetch } from "./http";

export const ObtenerReportePartida = async (idPartida) => {
  try {
    const data = await apiFetch("/boleto/obtener-reportes/" + idPartida);
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Reporte", error);
    return null;
  }
};
export const ObtenerReportePartidaNuevo = async (idPartida) => {
  try {
    const data = await apiFetch("/boleto/obtener-reportes/nuevo/" + idPartida);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Reporte", error);
    return null;
  }
};
export const ObtenerBoletosUsuario = async (idUsuario) => {
  try {
    const data = await apiFetch("/boleto/obtener-boletos-usuario/" + idUsuario);
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON" + idUsuario);
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Boletos:", error);
    return [];
  }
};

export const ObtenerBoletosAleatorios = async (idPartida) => {
  try {
    const data = await apiFetch("/boleto/obtener-boletos-partida/" + idPartida);
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Boletos:", error);
    return null;
  }
};
export const ReiniciarBoletos = async (idPartida, Precio) => {
  try {
    const data = await apiFetch("/boleto/reiniciar-boletos/" + idPartida + "/" + Precio);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en reiniciar:", error);
    return null;
  }
};
export const ObtenerBoletosGanadores = async (idPartida) => {
  try {
    const data = await apiFetch("/boleto/obtener-ganadores-fila/" + idPartida);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en VerificarBoleto:", error);
    return null;
  }
};

