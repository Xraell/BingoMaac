// jest-expo@52 no provee el mock nativo de ExpoFontLoader que @expo/vector-icons
// necesita: Font.isLoaded() acaba llamando a getLoadedFonts(), que llega undefined
// y revienta en un .forEach. Se mockea el modulo nativo, no expo-font entero, para
// que el resto de la libreria siga siendo la real.
jest.mock("expo-font/build/ExpoFontLoader", () => ({
  __esModule: true,
  default: {
    getLoadedFonts: () => [],
    loadAsync: async () => {},
    isLoaded: () => true,
  },
}));
