import { pedirODevolverNull, pedirOLanzar } from "./http";

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
  return pedirODevolverNull("/mensaje/partida/" + id, "VerificarNumero");
};

export const agregarMensaje = async (Mensaje) => {
  return pedirOLanzar("/mensaje/crear", "Mensaje", {
    method: "POST",
    body: JSON.stringify(Mensaje),
  });
};
