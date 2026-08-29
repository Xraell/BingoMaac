const UrlApi = "http://10.0.0.2:8000/api/ganador";

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
    const response = await fetch(UrlApi + "/partida/" + idPartida);
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
    console.error("Error en ObtenerGanadoresPorPartida:", error);
    return null;
  }
};

export const agregarGanadoresPremio = async (Ganador) => {
  const url = UrlApi;
  try {
    const response = await fetch(url+"/crearGanadores", {
      method: "POST",
      body: JSON.stringify(Ganador),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al agregar Ganador: ${response.status} `
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en Ganador:", error);
    throw error;
  }
};
