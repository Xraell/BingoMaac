import { apiFetch } from "./http";

export const VerificarUsuario = async (tel, clave) => {
  const ruta = "/usuario/authenticarte";
  const seendToBody ={
    "Clave":clave,
    "Telefono":tel,
  }
  console.log("seendToBody: ", seendToBody);
  try {
    const data = await apiFetch(ruta, {
      method: "POST",
      body: JSON.stringify(seendToBody),
    });
    return data;
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

export const ObtenerUsuario = async (id) => {
  try {
    const data = await apiFetch("/usuario/" + id);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en VerificarUsuario:", error);
    return null;
  }
};
export const ObtenerTotalCreditos = async () => {
  try {
    const data = await apiFetch("/usuario/total");
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en total:", error);
    return null;
  }
};
export const AgregarCreditosUsuario = async (id,nroCreditos) => {
  try {
    const data = await apiFetch("/usuario/agregar-creditos/" + id+"/"+nroCreditos);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en VerificarUsuario:", error);
    return null;
  }
};
export const RetirarCreditosUsuario = async (id,nroCreditos) => {
  try {
    const data = await apiFetch("/usuario/retirar-creditos/" + id+"/"+nroCreditos);
    if (!data) {
      throw new Error("No se pudo obtener datos de la API");
    }
    return data;
  } catch (error) {
    console.error("Error en VerificarUsuario:", error);
    return null;
  }
};


export const agregarUsuario = async (Usuario) => {
  try {
    const data = await apiFetch("/usuario/crear", {
      method: "POST",
      body: JSON.stringify(Usuario),
    });
    return data;
  } catch (error) {
    console.error("Error en usuario:", error);
    throw error;
  }
};

export const actualizarUsuario = async (User, id) => {
  try {
    await apiFetch("/usuario/"+id, {
      method: "PUT",
      body: JSON.stringify(User),
    });
    return true;
  } catch (error) {
    console.error("Error en usuario:", error);
    throw error;
  }
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
