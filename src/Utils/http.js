import { API_BASE } from "../config/api";
import { leerToken } from "./sesion";

export async function apiFetch(ruta, opciones = {}) {
  const token = await leerToken();

  const respuesta = await fetch(`${API_BASE}${ruta}`, {
    ...opciones,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    },
  });

  if (!respuesta.ok) {
    const error = new Error(`HTTP ${respuesta.status}`);
    error.status = respuesta.status;   // lo usaran las tareas 03 y 04
    throw error;
  }

  return respuesta.status === 204 ? null : respuesta.json();
}
