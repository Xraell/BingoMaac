const UrlApi = "http://10.0.2.2:8000/api/usuario";

export const VerificarUsuario = async (tel, clave) => {
  const url = UrlApi+"/authenticarte";
  const seendToBody ={
    "Clave":clave,
    "Telefono":tel,
  }
  console.log("seendToBody: ", seendToBody);
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(seendToBody),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al verificar usuario: ${response.status} ${
          response.statusText
        } `
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en usuario:", error+url);
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
    const response = await fetch(UrlApi );
    const data = await response.json();
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
    console.error("Error en VerificarUsuario:", error);
    return null;
  }
};
export const ObtenerTotalCreditos = async () => {
  try {
    const response = await fetch(UrlApi + "/total");
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
    console.error("Error en total:", error);
    return null;
  }
};
export const AgregarCreditosUsuario = async (id,nroCreditos) => {
  try {
    const response = await fetch(UrlApi + "/agregar-creditos/" + id+"/"+nroCreditos);
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
    console.error("Error en VerificarUsuario:", error);
    return null;
  }
};
export const RetirarCreditosUsuario = async (id,nroCreditos) => {
  try {
    const response = await fetch(UrlApi + "/retirar-creditos/" + id+"/"+nroCreditos);
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
    console.error("Error en VerificarUsuario:", error);
    return null;
  }
};


export const agregarUsuario = async (Usuario) => {
  const url = UrlApi;

  try {
    const response = await fetch(url+"/crear", {
      method: "POST",
      body: JSON.stringify(Usuario),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al agregar usuario: ${response.status} `
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en usuario:", error);
    throw error;
  }
};

export const actualizarUsuario = async (User, id) => {
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
        `Error al actualizar usuario: ${response.status} ${
          response.statusText
        } ${JSON.stringify(User)}`
      );
    }

    return true;
  } catch (error) {
    console.error("Error en usuario:", error);
    throw error;
  }
};
export const eliminarUsuario = async (id) => {
  const url = UrlApi + '/'+id;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Error al eliminar usuario: ${response.status} ${
          response.statusText
        } `
      );
    }
    return true;
  } catch (error) {
    console.error("Error en usuario:", error);
    throw error;
  }
};
