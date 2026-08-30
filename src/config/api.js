import Constants from "expo-constants";

const PRODUCCION = "https://<dominio-real>/api";
const DESARROLLO = "http://10.0.2.2:8000/api";

export const API_BASE = __DEV__
  ? (Constants.expoConfig?.extra?.apiUrl ?? DESARROLLO)
  : PRODUCCION;
