import { AgregarCreditosUsuario, RetirarCreditosUsuario } from "../Usuario";

jest.mock("../sesion", () => ({
  leerToken: jest.fn().mockResolvedValue(null),
  borrarToken: jest.fn(),
  emitirSesionExpirada: jest.fn(),
  guardarToken: jest.fn(),
}));

describe("AgregarCreditosUsuario / RetirarCreditosUsuario", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 7 }),
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("AgregarCreditosUsuario envia POST sin la cantidad en la URL", async () => {
    await AgregarCreditosUsuario(7, 50);

    const [url, opciones] = global.fetch.mock.calls[0];
    expect(url).toContain("/usuario/agregar-creditos/7");
    expect(url).not.toContain("/usuario/agregar-creditos/7/50");
    expect(opciones.method).toBe("POST");
  });

  it("AgregarCreditosUsuario envia puntos numerico en el body", async () => {
    await AgregarCreditosUsuario(7, 50);

    const [, opciones] = global.fetch.mock.calls[0];
    expect(JSON.parse(opciones.body)).toEqual({ puntos: 50 });
  });

  it("AgregarCreditosUsuario convierte a numero aunque llegue como string", async () => {
    await AgregarCreditosUsuario(7, "50");

    const [, opciones] = global.fetch.mock.calls[0];
    const body = JSON.parse(opciones.body);
    expect(body.puntos).toBe(50);
    expect(typeof body.puntos).toBe("number");
  });

  it("RetirarCreditosUsuario envia POST sin la cantidad en la URL y puntos numerico", async () => {
    await RetirarCreditosUsuario(9, "30");

    const [url, opciones] = global.fetch.mock.calls[0];
    expect(url).toContain("/usuario/retirar-creditos/9");
    expect(url).not.toContain("/usuario/retirar-creditos/9/30");
    expect(opciones.method).toBe("POST");
    expect(JSON.parse(opciones.body)).toEqual({ puntos: 30 });
  });
});
