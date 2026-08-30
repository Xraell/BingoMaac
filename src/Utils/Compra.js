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

