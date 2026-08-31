import { apiFetch, pedirODevolverNull, pedirOLanzar } from "./http";
import { guardarToken } from "./sesion";

export const VerificarUsuario = async (tel, clave) => {
  const ruta = "/usuario/authenticarte";
  try {
    const datos = await apiFetch(ruta, {
      method: "POST",
      body: JSON.stringify({ Telefono: tel, Clave: clave }),
    });
    if (datos.token) {
      await guardarToken(datos.token);
    }
    return datos.usuario ?? datos;
  } catch (error) {
    console.error("Error en usuario:", error+ruta);
    throw error;
  }
};
export const crearObjetoUsuario = (
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
export const ObtenerUsuarios = async () => {
  try {
    const data = await apiFetch("/usuario");
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo de objetos JSON");
    }
    return data;
  } catch (error) {
    console.error("Error en Obtener Usuarios:", error);
    return null;
  }
};

export const ObtenerTotalCreditos = async () => {
  return pedirODevolverNull("/usuario/total", "total");
};
export const AgregarCreditosUsuario = async (id,nroCreditos) => {
  return pedirOLanzar("/usuario/agregar-creditos/" + id, "VerificarUsuario", {
    method: "POST",
    body: JSON.stringify({ puntos: parseInt(nroCreditos, 10) }),
  });
};
export const RetirarCreditosUsuario = async (id,nroCreditos) => {
  return pedirOLanzar("/usuario/retirar-creditos/" + id, "VerificarUsuario", {
    method: "POST",
    body: JSON.stringify({ puntos: parseInt(nroCreditos, 10) }),
  });
};

export const agregarUsuario = async (Usuario) => {
  return pedirOLanzar("/usuario/crear", "usuario", {
    method: "POST",
    body: JSON.stringify(Usuario),
  });
};

export const eliminarUsuario = async (id) => {
  try {
    await apiFetch("/usuario/"+id, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error en usuario:", error);
    throw error;
  }
};
