import * as SecureStore from "expo-secure-store";

const CLAVE_TOKEN = "auth_token";

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
