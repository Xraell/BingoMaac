import { apiFetch, pedirODevolverNull, pedirOLanzar } from "./http";

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
    const data = await apiFetch("/numero");
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
    const data = await apiFetch("/numero/obtener-Numeros-usuario/"+idUsuario);
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
      const data = await apiFetch("/numero/obtener-numeros-partida/"+idPartida);
      if (!Array.isArray(data)) {
        throw new Error("La respuesta no es un arreglo de objetos JSON");
      }
      return data;
    } catch (error) {
      console.error("Error en Obtener Numeros:", error);
      return [];
    }
  };
export const ObtenerNumero = async (id) => {
  return pedirODevolverNull("/numero/" + id, "VerificarNumero");
};
export const ObtenerNumeroActual = async () => {
  return pedirODevolverNull("/numero/obtener-Numero-actual", "obtener Numero actual");
};

export const agregarNumero = async (Numero) => {
  return pedirOLanzar("/numero/crear", "Numero", {
    method: "POST",
    body: JSON.stringify(Numero),
  });
};

export const actualizarNumero = async (User, id) => {
  try {
    await apiFetch("/numero/"+id, {
      method: "PUT",
      body: JSON.stringify(User),
    });
    return true;
  } catch (error) {
    console.error("Error en Numero:", error);
    throw error;
  }
};
export const eliminarNumero = async (id) => {
  try {
    await apiFetch("/numero/"+id, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error en Numero:", error);
    throw error;
  }
};
