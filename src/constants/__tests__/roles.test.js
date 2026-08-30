import { ROL_ADMIN, ROL_USER, ROL_GUEST } from "../roles";

describe("constantes de rol", () => {
  it("tienen los valores literales exactos que usa la API", () => {
    expect(ROL_ADMIN).toBe("ADMIN");
    expect(ROL_USER).toBe("USER");
    expect(ROL_GUEST).toBe("GUEST");
  });
});
