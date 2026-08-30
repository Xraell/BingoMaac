import { pedirODevolverNull, pedirOLanzar } from "../http";

jest.mock("../sesion", () => ({
  leerToken: jest.fn().mockResolvedValue(null),
  borrarToken: jest.fn(),
  emitirSesionExpirada: jest.fn(),
}));

describe("pedirODevolverNull", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("devuelve los datos cuando la respuesta es exitosa", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, nombre: "Partida" }),
    });

    const resultado = await pedirODevolverNull("/partida/1", "prueba");

    expect(resultado).toEqual({ id: 1, nombre: "Partida" });
  });

  it("devuelve null y loguea con la etiqueta cuando la API falla", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const resultado = await pedirODevolverNull("/partida/1", "mi etiqueta");

    expect(resultado).toBeNull();
    expect(console.error).toHaveBeenCalledWith("Error en mi etiqueta:", expect.any(Error));
  });

  it("devuelve null cuando la respuesta es un 204 sin contenido", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 204,
    });

    const resultado = await pedirODevolverNull("/partida/1", "mi etiqueta");

    expect(resultado).toBeNull();
  });
});

describe("pedirOLanzar", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("devuelve los datos cuando la respuesta es exitosa", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 5 }),
    });

    const resultado = await pedirOLanzar("/partida/crear", "prueba", { method: "POST" });

    expect(resultado).toEqual({ id: 5 });
  });

  it("relanza el error y loguea con la etiqueta cuando la API falla", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 422,
    });

    await expect(pedirOLanzar("/partida/crear", "mi etiqueta")).rejects.toThrow(
      "Los datos enviados no son válidos."
    );
    expect(console.error).toHaveBeenCalledWith("Error en mi etiqueta:", expect.any(Error));
  });
});
