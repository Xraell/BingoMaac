const UrlApi = "https://bingoservice.digitalrobert.digital/api/mensaje";

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
    const response = await fetch(UrlApi + "/partida/" + id);
    const data = await response.json();
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    if (data && response.ok) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error en VerificarNumero:", error);
    return null;
  }
};

export const agregarMensaje = async (Mensaje) => {
  const url = UrlApi;
  try {
    const response = await fetch(url+"/crear", {
      method: "POST",
      body: JSON.stringify(Mensaje),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al agregar Mensaje: ${response.status} `
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en Mensaje:", error);
    throw error;
  }
};
