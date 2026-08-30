import { apiFetch } from "./http";

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
    const data = await apiFetch("/compra");
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
      const data = await apiFetch("/compra/obtener-compras-partida/"+idPartida);
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
    const data = await apiFetch("/compra/" + id);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en Verificarcompra:", error);
    return null;
  }
};
export const ObtenercompraActual = async () => {
  try {
    const data = await apiFetch("/compra/obtener-compra-actual");
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en obtener compra actual:", error);
    return null;
  }
};

export const agregarcompra = async (compra) => {
  try {
    const data = await apiFetch("/compra/crear", {
      method: "POST",
      body: JSON.stringify(compra),
    });
    return data;
  } catch (error) {
    console.error("Error en compra:", error);
    throw error;
  }
};

export const actualizarcompra = async (User, id) => {
  try {
    await apiFetch("/compra/"+id, {
      method: "PUT",
      body: JSON.stringify(User),
    });
    return true;
  } catch (error) {
    console.error("Error en compra:", error);
    throw error;
  }
};
export const eliminarcompra = async (id) => {
  try {
    await apiFetch("/compra/"+id, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error en compra:", error);
    throw error;
  }
};
