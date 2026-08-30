import React from "react";
import renderer from "react-test-renderer";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { BingoColors } from "../Theme/Colors";
import { AppProvider } from "../context/AppProvider";

// Replica del tema que App.js pasa a PaperProvider.
//
// Pasarlo explicitamente no es cosmetico: PaperProvider solo se suscribe a
// AccessibilityInfo y Appearance cuando NO recibe un tema (`if (!props.theme)`),
// y esos dos modulos no estan mockeados en jest-expo@52. Con el tema puesto,
// ambos efectos se saltan y el Provider monta sin tocarlos.
//
// OJO: esto duplica el tema de App.js. Si alguien lo cambia alli y no aqui, los
// snapshots seguirian pasando con un tema viejo. Para lo que esta etapa necesita
// -comparar el mismo componente antes y despues de mover un estilo- da igual,
// porque ambos lados usan este mismo tema. Ver ESTADO.md.
export const temaDePrueba = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: BingoColors.primary,
    secondary: BingoColors.secondary,
  },
};

/**
 * Renderiza un elemento con los mismos providers que la app real y devuelve el
 * arbol serializado, desmontando despues.
 *
 * El unmount() no es opcional: sin el, los efectos pendientes de un modal se
 * ejecutan durante el test siguiente y react-native-paper acaba leyendo
 * `Animated` como undefined. Los componentes pasan sueltos y fallan en grupo.
 */
export function renderizarArbol(elemento, { conContexto = false } = {}) {
  const envuelto = conContexto ? (
    <AppProvider>
      <PaperProvider theme={temaDePrueba}>{elemento}</PaperProvider>
    </AppProvider>
  ) : (
    <PaperProvider theme={temaDePrueba}>{elemento}</PaperProvider>
  );

  let arbol;
  renderer.act(() => {
    arbol = renderer.create(envuelto);
  });
  const json = arbol.toJSON();
  renderer.act(() => {
    arbol.unmount();
  });
  return json;
}
