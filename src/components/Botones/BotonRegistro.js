import React from "react";
import { Alert } from "react-native";
import { Button } from "react-native-paper";
import { useAppContext } from "../../context/AppProvider";
import { agregarUsuario, crearObjetoUsuario, VerificarUsuario } from "../../Utils/Usuario";
import { ROL_USER } from "../../constants/roles";

export default function BotonRegistro({ nombre, telefono, apellido, clave ,codigoInvitado}) {
  const { setUser } = useAppContext();

  const validar = async () => {
    // Validar si todos los campos están completos
    if (!nombre || !apellido || !telefono || !clave) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    // Validar longitud mínima del nombre y apellido (mínimo 3 caracteres)
    if (nombre.trim().length < 3) {
      Alert.alert("Error", "El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (apellido.trim().length < 3) {
      Alert.alert("Error", "El apellido debe tener al menos 3 caracteres.");
      return;
    }

    // Validar longitud mínima del número de teléfono (mínimo 8 caracteres)
    if (telefono.trim().length < 9) {
      Alert.alert("Error", "El número de teléfono debe tener al menos 9 caracteres.");
      return;
    }
    // Validar longitud mínima de la contraseña (mínimo 8 caracteres)
    if (telefono.trim().length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 9 caracteres.");
      return;
    }

    // Confirmación antes de enviar los datos
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas enviar estos datos?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Enviar", onPress: enviarDatos },
      ]
    );
  };

  const enviarDatos = async () => {
    let usuario = crearObjetoUsuario(
      nombre,
      apellido,
      telefono,
      0,
      ROL_USER,
      clave
    );
    if(codigoInvitado.length>6){
      usuario.codigoInvitado = codigoInvitado;
    }
    try {
      await agregarUsuario(usuario);
      const nuevousuario = await VerificarUsuario(telefono, clave);
      setUser(nuevousuario);
      Alert.alert("Éxito", "¡Cuenta creada exitosamente!");
    } catch (error) {
      if (error.toString().includes("422")) {
        Alert.alert(
          "Número ya registrado",
          "El número de celular está registrado en nuestre aplicación. Por favor, intente con otro número de celular."
        );
      } else {
        Alert.alert(
          "Error al registrar",
          "Se produjo un problema al intentar registrar la cuenta. Por favor, inténtelo de nuevo con otros datos."
        );
      }
    }
  };

  return (
    <Button mode="contained" onPress={validar}>
      REGISTRARME
    </Button>
  );
}
