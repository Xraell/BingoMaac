import React, { createContext, useContext, useState, useEffect } from "react";
import { useWindowDimensions, AppState } from "react-native";
import { usuarioInvitado } from "../components/Data/usuarioInvitado";
import { suscribirSesionExpirada, leerToken } from "../Utils/sesion";
import { apiFetch } from "../Utils/http";

const ContextApp = createContext();

export function AppProvider({ children }) {
  const { height } = useWindowDimensions();
  const [heightWindow, setHeighWindow] = useState(height);
  const [tick, setTick] = useState(false);
  const [opc, setOpc] = useState(0);
  const [partidaActual, setPartidaActual] = useState({
    NroPartida: 0,
    Descripcion: "",
    Activo: "",
    CostoBoleto: 0
  });
  const [partidas, setPartidas] = useState([]);
  const [misBoletos, setMisBoletos] = useState([]);
  const [user, setUser] = useState(usuarioInvitado);
  const [listUsers, setListUsers] = useState([]);
  const [premios, setPremios] = useState([])
  const [promociones, setPromociones] = useState([])
  const [promocion, setPromocion] = useState({

  })

  useEffect(() => {
    const cancelar = suscribirSesionExpirada(() => {
      setUser(usuarioInvitado);
      setOpc(0);
    });
    return cancelar;
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", async (estado) => {
      if (estado === "active" && (await leerToken())) {
        try {
          setUser(await apiFetch("/usuario/me"));
        } catch { /* el 401 ya lo trata apiFetch */ }
      }
    });
    return () => sub.remove();
  }, []);

  const contextValues = {
    heightWindow,
    opc,
    setOpc,
    user,
    setUser,
    partidaActual,
    setPartidaActual,
    misBoletos,
    setMisBoletos,
    setPartidas,
    partidas,
    setListUsers,
    listUsers,
    setTick,
    tick,
    premios,
    setPremios, promociones, setPromociones,promocion,setPromocion
  };
  return (
    <ContextApp.Provider value={contextValues}>{children}</ContextApp.Provider>
  );
}

export function useAppContext() {
  return useContext(ContextApp);
}
