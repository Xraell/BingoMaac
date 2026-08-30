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
    const data = await apiFetch("/usuario_promocion");
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
    const data = await apiFetch("/usuario_promocion/obtener-Numeros-usuario/"+idUsuario);
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
      const data = await apiFetch("/usuario_promocion/obtener-numeros-partida/"+idPartida);
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
  return pedirODevolverNull("/usuario_promocion/" + id, "VerificarNumero");
};
export const EscogerPromocion = async (idUser,idPromocion) => {
  return pedirOLanzar(
    "/usuario_promocion/designar-promocion/" + idUser + "/" + idPromocion,
    "designar promocion",
    {
      method: "POST",
    }
  );
};
export const ObtenerNumeroActual = async () => {
  return pedirODevolverNull("/usuario_promocion/obtener-Numero-actual", "obtener Numero actual");
};

export const agregarNumero = async (Numero) => {
  return pedirOLanzar("/usuario_promocion/crear", "Numero", {
    method: "POST",
    body: JSON.stringify(Numero),
  });
};

export const actualizarNumero = async (User, id) => {
  try {
    await apiFetch("/usuario_promocion/"+id, {
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
    await apiFetch("/usuario_promocion/"+id, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error en Numero:", error);
    throw error;
  }
};
