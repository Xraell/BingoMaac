# 06 — Verificación final y cierre

**Fase:** Cierre · **Riesgo:** — · **Depende de:** [05](05-endurecer-cliente.md) ·
**Dispositivo:** **sí**

## Objetivo

Comprobar la app completa de punta a punta contra el backend blindado, y dejar por
escrito qué quedó cubierto y qué no.

## Por qué

Las tareas anteriores verificaron cada cambio por separado. Esta busca lo que solo
aparece al juntarlo todo: una sesión que caduca a mitad de partida, un invitado que
intenta comprar, dos dispositivos compitiendo por el mismo boleto.

## Pasos

### 1. Recorrido completo, con dos cuentas y dos dispositivos

Sobre una build de producción contra el servidor real.

**Sesión:**

- [ ] Registro de una cuenta nueva → se puede entrar con ella.
- [ ] Login, cerrar la app, reabrir → sigue dentro.
- [ ] Logout → fuera; reabrir → sigue fuera.
- [ ] Login en dos dispositivos con la misma cuenta → ambos funcionan (Sanctum permite
      varios tokens por usuario).
- [ ] Logout en uno → **el otro sigue dentro**. Confirma que se revoca solo el token de
      ese dispositivo, no todos.

**Autorización:**

- [ ] USER no ve el panel de administración.
- [ ] ADMIN sí, y sus operaciones funcionan.
- [ ] Un 403 forzado muestra mensaje y **no** cierra la sesión.

**Juego y dinero:**

- [ ] Partida completa: números, audio, ganadores, modo automático sin repetir.
- [ ] Compra normal: descuenta lo correcto.
- [ ] Compra sin saldo: 422 con mensaje.
- [ ] Compra simultánea del mismo boleto desde dos dispositivos: **uno solo** lo obtiene.
- [ ] Promoción con descuento y boletos de regalo: igual que antes del plan.
- [ ] Recarga de créditos por un administrador: se refleja en el dispositivo del usuario.
- [ ] Comisión de referido: sigue abonándose.

**Casos límite:**

- [ ] Modo avión durante la partida → mensaje claro, sin cierre inesperado.
- [ ] Token borrado a mano con la app abierta → la siguiente llamada lleva al login.
- [ ] Invitado: se comporta según lo decidido en la tarea 04.
- [ ] App en segundo plano 10 minutos y de vuelta → la sesión sigue viva.

### 2. Comprobación del artefacto distribuible

Sobre el bundle que se va a publicar, no sobre el código:

```bash
grep -r "10.0.2.2\|http://" <scratchpad>/exp-check/ || echo "OK"
```

- [ ] Sin URLs de desarrollo ni HTTP en claro.
- [ ] `adb logcat` durante un login completo: sin contraseña ni token.

### 3. Escribir `INFORME.md`

Cinco secciones, con el mismo criterio de honestidad que el informe del backend:

1. **Resumen** — de qué se partía, qué se cerró.
2. **Antes y después** — tabla:

   | | Antes | Después |
   |---|---|---|
   | Sesión | `idUsuario` en `AsyncStorage` sin cifrar | Token en Keystore/Keychain |
   | Identidad | La afirma el cliente | La confirma el servidor (`/me`) |
   | Rol | Decidido en el cliente | Del servidor; en el cliente, cosmético |
   | Logout | Olvida el id | Revoca el token en el servidor |
   | Transporte | HTTP en claro | HTTPS, sin tráfico en claro |
   | URL de la API | Repetida en 8 ficheros, IP de emulador | Un punto, por entorno |
   | Logs | Imprimían clave y usuario | Sin datos sensibles |

3. **Desviaciones** — de `ESTADO.md`, con su motivo. Incluir la decisión sobre el modo
   invitado (tarea 04) y la forma dual de la respuesta de login, que debe retirarse
   cuando la app antigua ya no circule.
4. **Riesgos aceptados** — lo que este plan **no** cubre:
   - Sin *certificate pinning*: un dispositivo con una CA falsa instalada puede
     interceptar el tráfico pese a HTTPS.
   - Sin detección de root ni de emulador.
   - Sin ofuscación del bundle: el JavaScript de un APK es legible.
   - El token no caduca (limitación del backend; sin rotación).
   - Sin recuperación de contraseña: quien la olvide necesita a un administrador.
   - Sin biometría para reabrir la sesión.
5. **Trabajo pendiente recomendado**, por valor/coste:
   1. Recuperación de contraseña (necesita SMS en el backend).
   2. Caducidad y renovación de tokens.
   3. Biometría para reabrir sesión.
   4. Certificate pinning.

### 4. Actualizar `CLAUDE.md`

No puede seguir describiendo la sesión como un `idUsuario` en `AsyncStorage`, ni la URL
como hardcodeada en `src/Utils/`. Es lo que leerá el siguiente agente.

## Verificación automática

- [ ] Compila.
- [ ] `INFORME.md` existe con las cinco secciones.
- [ ] Las desviaciones del informe coinciden en número con las de `ESTADO.md`.
- [ ] Las seis tareas figuran ✅ en `ESTADO.md` con su hash de commit.
- [ ] `CLAUDE.md` actualizado.
- [ ] El bundle no contiene URLs de desarrollo.

## Criterio de finalización

Todo el recorrido del paso 1 en verde, confirmado por el usuario, y el informe escrito.

Si algún punto queda sin probar, **decirlo en el informe**. Un recorrido con dos casos
sin cubrir y declarados es más útil que uno que afirma haberlo probado todo.

```
sec(06): verificacion final e informe de cierre de la etapa de seguridad
```
