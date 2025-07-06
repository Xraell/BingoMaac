const UrlApi = "https://bingoservice.digitalrobert.digital/api/compra";

export const crearObjetocompra = (
  Monto,
  idUsuario,
  Descripcion,
  
) => {
  return {
    Monto,
    idUsuario,
    Descripcion,
  };
};
export const Obtenercompras = async () => {
  try {
    const response = await fetch(UrlApi );
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener compras:", error);
    return null;
  }
};

export const ObtenercomprasAleatorios = async (idPartida) => {
    try {
      const response = await fetch(UrlApi+"/obtener-compras-partida/"+idPartida );
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("La respuesta no es un arreglo de objetos JSON");
      }
      return data;
    } catch (error) {
      console.error("Error en Obtener compras:", error);
      return null;
    }
  };
export const Obtenercompra = async (id) => {
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
    console.error("Error en Verificarcompra:", error);
    return null;
  }
};
export const ObtenercompraActual = async () => {
  try {
    const response = await fetch(UrlApi + "/obtener-compra-actual") ;
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
    console.error("Error en obtener compra actual:", error);
    return null;
  }
};

export const agregarcompra = async (compra) => {
  const url = UrlApi;

  try {
    const response = await fetch(url+"/crear", {
      method: "POST",
      body: JSON.stringify(compra),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al agregar compra: ${response.status} ${JSON.stringify(compra)} `
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en compra:", error);
    throw error;
  }
};

export const actualizarcompra = async (User, id) => {
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
        `Error al actualizar compra: ${response.status} ${
          response.statusText
        } ${JSON.stringify(User)}`
      );
    }

    return true;
  } catch (error) {
    console.error("Error en compra:", error);
    throw error;
  }
};
export const eliminarcompra = async (id) => {
  const url = UrlApi + '/'+id;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Error al eliminar compra: ${response.status} ${
          response.statusText
        } `
      );
    }
    return true;
  } catch (error) {
    console.error("Error en compra:", error);
    throw error;
  }
};
