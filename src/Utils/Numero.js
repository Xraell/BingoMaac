const UrlApi = "http://10.0.0.2:8000/api/numero";

export const crearObjetoNumero = (
  idPartida,
  Nro
) => {
  return {
    idPartida,
    Nro:Number(Nro)
  };
};
export const ObtenerNumeros = async () => {
  try {
    const response = await fetch(UrlApi );
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Numeros:", error);
    return null;
  }
};
export const ObtenerNumerosUsuario = async (idUsuario) => {
  try {
    const response = await fetch(UrlApi+"/obtener-Numeros-usuario/"+idUsuario );
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Numeros:", error);
    return null;
  }
};

export const ObtenerNumerosPartida = async (idPartida) => {
    try {
      const response = await fetch(UrlApi+"/obtener-numeros-partida/"+idPartida );
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("La respuesta no es un arreglo de objetos JSON");
      }
      return data;
    } catch (error) {
      console.error("Error en Obtener Numeros:", error);
      return null;
    }
  };
export const ObtenerNumero = async (id) => {
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
    console.error("Error en VerificarNumero:", error);
    return null;
  }
};
export const ObtenerNumeroActual = async () => {
  try {
    const response = await fetch(UrlApi + "/obtener-Numero-actual") ;
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
    console.error("Error en obtener Numero actual:", error);
    return null;
  }
};

export const agregarNumero = async (Numero) => {
  const url = UrlApi;

  try {
    const response = await fetch(url+"/crear", {
      method: "POST",
      body: JSON.stringify(Numero),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al agregar Numero: ${response.status} `
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en Numero:", error);
    throw error;
  }
};

export const actualizarNumero = async (User, id) => {
  const url = UrlApi+"/"+id;

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
        `Error al actualizar Numero: ${response.status} ${
          response.statusText
        } ${JSON.stringify(User)}`
      );
    }

    return true;
  } catch (error) {
    console.error("Error en Numero:", error);
    throw error;
  }
};
export const eliminarNumero = async (id) => {
  const url = UrlApi + '/'+id;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Error al eliminar Numero: ${response.status} ${
          response.statusText
        } `
      );
    }
    return true;
  } catch (error) {
    console.error("Error en Numero:", error);
    throw error;
  }
};
