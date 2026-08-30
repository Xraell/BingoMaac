import * as SecureStore from "expo-secure-store";
import { DeviceEventEmitter } from "react-native";

const CLAVE_TOKEN = "auth_token";
const EVENTO_SESION_EXPIRADA = "sesionExpirada";

export async function guardarToken(token) {
  await SecureStore.setItemAsync(CLAVE_TOKEN, token);
}

export async function leerToken() {
  try {
    return await SecureStore.getItemAsync(CLAVE_TOKEN);
  } catch {
    // Keystore no disponible o dato corrupto: equivale a no tener sesion.
    return null;
  }
}

export async function borrarToken() {
  await SecureStore.deleteItemAsync(CLAVE_TOKEN);
}

export function emitirSesionExpirada() {
  DeviceEventEmitter.emit(EVENTO_SESION_EXPIRADA);
}

export function suscribirSesionExpirada(callback) {
  const subscripcion = DeviceEventEmitter.addListener(EVENTO_SESION_EXPIRADA, callback);
  return () => subscripcion.remove();
}
