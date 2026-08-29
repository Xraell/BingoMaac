# Seguridad para producción — BingoMaac (app)

Plan por fases para que la app deje de confiar en un identificador guardado en claro y
pase a autenticarse con tokens contra el backend blindado. Estado de partida: la
«sesión» es un `idUsuario` en `AsyncStorage`, la URL de la API está repetida y
hardcodeada en 8 ficheros apuntando al emulador, y las contraseñas viajan por HTTP.

Cada tarea está pensada para que **el agente la ejecute y se verifique a sí mismo**,
salvo las que exigen dispositivo real, que no se pueden cerrar sin el usuario.

## Cómo se ejecuta

```bash
/blindar-app 01
```

El argumento es el número de tarea (`01`–`06`), o `estado` para ver por dónde va.
Sin argumento, continúa por la primera tarea no completada.

## Orden de las tareas

| # | Tarea | Fase | Riesgo | ¿Dispositivo? |
|---|---|---|---|---|
| [01](01-centralizar-api.md) | Centralizar la URL y el cliente HTTP | 0 | Bajo | No |
| [02](02-almacenamiento-seguro.md) | Guardar el token en SecureStore | 1 | Medio | **Sí** |
| [03](03-flujo-de-sesion.md) | Login, `/me`, logout y expiración | 1 | **Alto** | **Sí** |
| [04](04-autorizacion-cliente.md) | Rol del servidor y pantallas de admin | 2 | Medio | **Sí** |
| [05](05-endurecer-cliente.md) | HTTPS, quitar logs y adaptar contratos | 3 | Medio | **Sí** |
| [06](06-verificacion-final.md) | Verificación final y cierre | Cierre | — | **Sí** |

## Contexto que condiciona el plan

Seis hechos de este proyecto que explican por qué el plan es así (arquitectura completa
en [CLAUDE.md](../../CLAUDE.md)):

1. **La sesión actual no es una sesión.** `BotonesLogin.js` guarda
   `AsyncStorage.setItem("idUsuario", response.id)` y al reabrir llama a
   `ObtenerUsuario(id)`. No hay token ni verificación: quien edite ese valor entra como
   cualquier usuario. `AsyncStorage` **no está cifrado** — en Android es un fichero del
   sandbox, legible en un dispositivo rooteado o desde un respaldo.

2. **El rol se decide en el cliente.** `response.Rol == "ADMIN"` en `BotonesLogin.js`
   abre el panel de administración. Hoy es la única barrera, y el backend no revalida
   nada. Tras la tarea 05 del backend el rol del cliente pasa a ser **cosmético**: sirve
   para no mostrar botones que van a dar 403.

3. **La URL de la API está repetida en 8 ficheros** de `src/Utils/`, todos apuntando a
   `http://10.0.2.2:8000` — la IP del emulador de Android. Tal cual, **la app no funciona
   en un dispositivo real**. Centralizarla es el paso 1 porque además es donde vivirá el
   inyector del token.

4. **No hay tests ni linter.** JavaScript plano. La verificación es `expo export` más
   prueba manual en dispositivo, igual que en la etapa de migración de SDK.

5. **Hay un modo invitado.** `usuarioInvitado` con `Rol == "GUEST"` es el estado inicial
   de `AppProvider`, y varias pantallas (`Boletos.js`, `Perfil.js`, `MisBoletos.js`)
   dependen de él. **El invitado no tiene token**, así que toda pantalla que llame a la
   API debe seguir funcionando —o degradar con elegancia— sin él. Es el punto más fácil
   de romper en toda la etapa.

6. **`PartidaEnCurso.js` es el componente más frágil** del proyecto: espeja estado en
   refs porque los callbacks de `setTimeout` viven fuera del ciclo de render. Este plan
   **no lo toca**, salvo por el cliente HTTP que use. Si una tarea propone modificarlo,
   es señal de que se está saliendo del alcance.

## Coordinación con el backend

Plan hermano: `BACKEND/doc/seguridad-produccion/`. Son **repositorios git distintos**.

| App | Backend requerido | Nota |
|---|---|---|
| 01 | ninguno | Puramente interna |
| 02–03 | 04 (tokens emitidos) | El backend debe responder `token` en el login |
| 04 | 05 (rutas cerradas) | Antes de eso, los 403 no existen y no se pueden probar |
| 05 | 07 (HTTPS y CORS) | Despliegue conjunto |

Regla: **la app puede adelantarse hasta la tarea 03** si el backend ya publicó su tarea
04. Nunca al revés — una app que exige token contra un backend que no los emite no
arranca.

## Convenciones

- **Un commit por tarea**, con el prefijo `sec(NN):`.
- **Nunca `git add -A` ni `git add .`**: hay otros agentes operando sobre el repositorio.
- **Verde antes de avanzar**. Las tareas marcadas «Sí» en dispositivo **no se commitean
  sin confirmación explícita del usuario**.
- Punto de retorno: tag `pre-seguridad`, creado en la tarea 01.
- El progreso se anota en [ESTADO.md](ESTADO.md).
