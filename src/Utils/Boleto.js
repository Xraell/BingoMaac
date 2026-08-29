const UrlApi = "http://10.0.2.2:8000/api/boleto";

export const crearObjetoBoleto = (
  Nombres,
  Apellidos,
  Telefono,
  Creditos,
  Rol,
  Clave,
) => {
  return {
    Nombres,
    Apellidos,
    Telefono,
    Creditos,
    Rol,
    Clave,
  };
};
export const ObtenerReportePartida = async (idPartida) => {
  try {
    const response = await fetch(UrlApi + "/obtener-reportes/" + idPartida);
    const data = await response.json();
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
    const response = await fetch(UrlApi + "/obtener-reportes/nuevo/" + idPartida);
    const data = await response.json();
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    if (data && response.ok) {
      return data;
    } else {
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Reporte", error);
    return null;
  }
};
export const ObtenerBoletos = async () => {
  try {
    const response = await fetch(UrlApi);
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Boletos:", error);
    return null;
  }
};
export const ObtenerBoletosUsuario = async (idUsuario) => {
  try {
    const response = await fetch(UrlApi + "/obtener-boletos-usuario/" + idUsuario);
    const data = await response.json();
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
  let response
  try {
    response = await fetch(UrlApi + "/obtener-boletos-partida/" + idPartida);
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON");
    }
    return data;
  } catch (error) {
    const data = await response.json();
    console.error("Error en Obtener Boletos:", error + "data:" + data);
    return null;
  }
};
export const ObtenerBoleto = async (id) => {
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
    console.error("Error en VerificarBoleto:", error);
    return null;
  }
};
export const ReiniciarBoletos = async (idPartida, Precio) => {
  try {
    const response = await fetch(UrlApi + "/reiniciar-boletos/" + idPartida + "/" + Precio);
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
    console.error("Error en reiniciar:", error);
    return null;
  }
};
export const ObtenerBoletosGanadores = async (idPartida) => {
  try {
    const response = await fetch(UrlApi + "/obtener-ganadores-fila/" + idPartida);
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
    console.error("Error en VerificarBoleto:", error);
    return null;
  }
};
export const ObtenerBoletoActual = async () => {
  try {
    const response = await fetch(UrlApi + "/obtener-Boleto-actual");
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
    console.error("Error en obtener Boleto actual:", error);
    return null;
  }
};

export const agregarBoleto = async (Boleto) => {
  const url = UrlApi;

  try {
    const response = await fetch(url + "/crear", {
      method: "POST",
      body: JSON.stringify(Boleto),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al agregar Boleto: ${response.status} `
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en Boleto:", error);
    throw error;
  }
};

export const actualizarBoleto = async (User, id) => {
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
        `Error al actualizar Boleto: ${response.status} ${response.statusText
        } ${JSON.stringify(User)}`
      );
    }

    return true;
  } catch (error) {
    console.error("Error en Boleto:", error);
    throw error;
  }
};
export const eliminarBoleto = async (id) => {
  const url = UrlApi + '/' + id;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Error al eliminar Boleto: ${response.status} ${response.statusText
        } `
      );
    }
    return true;
  } catch (error) {
    console.error("Error en Boleto:", error);
    throw error;
  }
};
