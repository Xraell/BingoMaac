import { pedirOLanzar } from "./http";

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
  return pedirOLanzar("/compra/crear", "compra", {
    method: "POST",
    body: JSON.stringify(compra),
  });
};

