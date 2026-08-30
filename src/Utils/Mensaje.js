import { apiFetch } from "./http";

export const crearObjetoMensaje = (
  idMensaje,
  idPartida,
  titulo,
  descripcion,
  audio
) => {
  return {
    idMensaje,
    idPartida:Number(idPartida),
    titulo,
    descripcion,
    audio:Number(audio)
  };
};

export const ObtenerMensajePartida = async (id) => {
  try {
    const data = await apiFetch("/mensaje/partida/" + id);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en VerificarNumero:", error);
    return null;
  }
};

export const agregarMensaje = async (Mensaje) => {
  try {
    const data = await apiFetch("/mensaje/crear", {
      method: "POST",
      body: JSON.stringify(Mensaje),
    });
    return data;
  } catch (error) {
    console.error("Error en Mensaje:", error);
    throw error;
  }
};
