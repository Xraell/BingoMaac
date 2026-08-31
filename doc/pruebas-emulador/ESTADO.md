# Estado — pruebas en emulador

Leyenda: ⬜ pendiente · 🔄 en curso · ✅ hecha · ⏭ saltada

| # | Tarea | Estado | Notas |
|---|---|---|---|
| 01 | Preparación del entorno | ✅ | Backend :8080, emulador y app OK. Metro en :8090 (8081 ocupado por proceso previo) |
| 02 | Datos de prueba | ✅ | Cuentas 35 (ADMIN) y 36 (USER), partida 87/Nº2564, 500 boletos |
| 03 | Humo y sesión | ✅ | 6/7 ✅. 3.5 ❌: LogBox del 401 de invitado sin capturar (hallazgo H1) |
| 04 | Flujo del jugador | ✅ | 2/7 ✅, 1 ⏭ (500 boletos libres), 3 ⏭ en cascada. **H2 crítico**: compra bloqueada por condición invertida en ModalBoleto.js |
| 05 | Panel de administración | ✅ | 8/8 ✅. H3 menor: buscador de Usuarios no filtra por teléfono/apellido |
| 06 | Partida en curso | ✅ | 4/7 ✅ (incl. 6.2, la prueba más valiosa: 14 números, 0 repetidos). 6.5/6.6 ⏭ cascada H2. 6.7 ⏭ no se pudo automatizar |
| 07 | Informe | ✅ | INFORME.md escrito, PENDIENTE.md actualizado con H2 como prioridad |

## Contexto de la sesión

| Dato | Valor |
|---|---|
| Fecha | 2026-08-30 |
| Commit APP | 8635420 (docs(pruebas): la regresion de ItemBoleto ya esta arreglada) — árbol limpio |
| Commit BACKEND | ab79e4f (docs(04): registrar el commit del informe de cierre en ESTADO.md) — árbol limpio |
| Árboles limpios | Sí, ambos |
| Bug 1 (créditos GET) | Arreglado — `agregar-creditos/{id}` como path param, no concatenado |
| Bug 2 (boletos en admin) | Arreglado — `obtener-boletos-partida` fuera del grupo `admin`, con nota explícita en el código |
| Bug 3 (login 500) | Arreglado — `authenticate()` comprueba `Hash::info()['algoName'] === 'bcrypt'` antes de `Hash::check()` |
| Regresión ItemBoleto | No reapareció — `idUsuario != null` no se encontró en el código |

## Cuentas de prueba

| Rol | Teléfono | id | Notas |
|---|---|---|---|
| ADMIN | +591 69990002 | 35 | `PruebaEmulador SesionUno`, clave `Prueba1234`, promovida desde USER, 300 créditos |
| USER | +591 69990003 | 36 | `PruebaEmulador SesionDos`, clave `Prueba1234`, 300 créditos |

Partida de prueba: `NroPartida = 2564`, `id = 87`, Costo boleto = 30, Cartón lleno = 100,
500 boletos generados.
