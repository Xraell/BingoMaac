const UrlApi = "http://10.0.2.2:8000/api/partida";

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
    const response = await fetch(UrlApi);
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Partidas:", error);
    return null;
  }
};

export const ObtenerPartida = async (id) => {
  try {
    const response = await fetch(UrlApi + "/" + id);
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
    console.error("Error en VerificarPartida:", error);
    return null;
  }
};
export const ObtenerPremiosPartida = async (idPartida) => {
  try {
    const response = await fetch(UrlApi + "/obtener-premios/" + idPartida);
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
    console.error("Error en ObtenerpremiosPartida:", error);
    return null;
  }
};
export const ObtenerPartidaActual = async () => {
  try {
    const response = await fetch(UrlApi + "/obtener-partida-actual");
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
    console.error("Error en obtener partida actual:", error);
    return null;
  }
};

export const ObtenerDatosPartida = async (idPartida, idUsuario) => {
  try {
    const url =
      UrlApi +
      "/obtener-datos/" +
      idPartida +
      (idUsuario ? "?idUsuario=" + idUsuario : "");
    const response = await fetch(url);
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
    console.error("Error en obtener datos partida:", error);
    return null;
  }
};
export const agregarPartida = async (Partida, Promociones, Costo, Premios) => {
  console.log("🚀 ~ agregarPartida ~ Premios:", Premios)
  const url = UrlApi;

  try {
    const response = await fetch(url + "/crear", {
      method: "POST",
      body: JSON.stringify({
        partida: Partida,
        promociones: Promociones,
        premio: Premios,
        costo: Costo
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al agregar Partida: ${response.status} `
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en Partida:", error);
    throw error;
  }
};

export const actualizarPartida = async (User, id) => {
  const url = UrlApi + "/" + id;

  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(User),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al actualizar Partida: ${response.status} ${response.statusText
        } ${JSON.stringify(User)}`
      );
    }

    return true;
  } catch (error) {
    console.error("Error en Partida:", error);
    throw error;
  }
};
export const eliminarPartida = async (id) => {
  const url = UrlApi + '/' + id;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Error al eliminar Partida: ${response.status} ${response.statusText
        } `
      );
    }
    return true;
  } catch (error) {
    console.error("Error en Partida:", error);
    throw error;
  }
};
