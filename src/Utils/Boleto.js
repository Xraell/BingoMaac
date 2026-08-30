import { apiFetch } from "./http";

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
    const data = await apiFetch("/boleto/obtener-reportes/" + idPartida);
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
    const data = await apiFetch("/boleto/obtener-reportes/nuevo/" + idPartida);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Reporte", error);
    return null;
  }
};
export const ObtenerBoletos = async () => {
  try {
    const data = await apiFetch("/boleto");
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
    const data = await apiFetch("/boleto/obtener-boletos-usuario/" + idUsuario);
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
  try {
    const data = await apiFetch("/boleto/obtener-boletos-partida/" + idPartida);
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Boletos:", error);
    return null;
  }
};
export const ObtenerBoleto = async (id) => {
  try {
    const data = await apiFetch("/boleto/" + id);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en VerificarBoleto:", error);
    return null;
  }
};
export const ReiniciarBoletos = async (idPartida, Precio) => {
  try {
    const data = await apiFetch("/boleto/reiniciar-boletos/" + idPartida + "/" + Precio);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en reiniciar:", error);
    return null;
  }
};
export const ObtenerBoletosGanadores = async (idPartida) => {
  try {
    const data = await apiFetch("/boleto/obtener-ganadores-fila/" + idPartida);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en VerificarBoleto:", error);
    return null;
  }
};
export const ObtenerBoletoActual = async () => {
  try {
    const data = await apiFetch("/boleto/obtener-Boleto-actual");
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en obtener Boleto actual:", error);
    return null;
  }
};

export const agregarBoleto = async (Boleto) => {
  try {
    const data = await apiFetch("/boleto/crear", {
      method: "POST",
      body: JSON.stringify(Boleto),
    });
    return data;
  } catch (error) {
    console.error("Error en Boleto:", error);
    throw error;
  }
};

export const actualizarBoleto = async (User, id) => {
  try {
    await apiFetch("/boleto/" + id, {
      method: "PUT",
      body: JSON.stringify(User),
    });
    return true;
  } catch (error) {
    console.error("Error en Boleto:", error);
    throw error;
  }
};
export const eliminarBoleto = async (id) => {
  try {
    await apiFetch("/boleto/" + id, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error en Boleto:", error);
    throw error;
  }
};
