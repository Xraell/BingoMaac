import { View, Text, StyleSheet } from 'react-native';
import { useAppContext } from "../../context/AppProvider";
import { BingoColors } from "../../Theme/Colors";
import { useEffect, useState } from 'react';

const MetaPromocion = () => {
    const { misBoletos, promocion } = useAppContext();
    const [boletosActuales, setBoletosActuales] = useState(0);  // Inicializamos con 0
    const [boletosRequeridos, setBoletosRequeridos] = useState(1);  // Inicializamos con 1 para evitar división por 0
    const [progreso, setProgreso] = useState(0);

    useEffect(() => {
        if (promocion) {
            const actualBoletos = misBoletos.length;
            const requeridosBoletos = promocion.nroBoletos;

            setBoletosActuales(actualBoletos);
            setBoletosRequeridos(requeridosBoletos);

            // Calcular el progreso basado en los valores más recientes
            const nuevoProgreso = Math.min(actualBoletos / requeridosBoletos, 1);
            setProgreso(nuevoProgreso);

        }
    }, [promocion, misBoletos]);  // Agregamos misBoletos para actualizar cuando cambie

    return (
        <>
            <View style={styles.container}>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progreso * 100}%` }]} />
                    {progreso >= 1 && (
                        <Text style={styles.completedText}>¡Promoción completada!</Text>
                    )}
                </View>
            </View>
            {progreso < 1 && (
                <Text style={styles.progressText}>
                    {boletosActuales}/{boletosRequeridos}
                </Text>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingHorizontal: 15,
        width: 200,
        position: 'relative'
    },
    progressBarContainer: {
        height: 40,
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
        overflow: 'hidden',
        justifyContent: 'center'
    },
    progressBar: {
        height: '100%',
        backgroundColor: BingoColors.primary,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 15,
        borderRadius: 20,
    },
    progressText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
        zIndex: 1000,
        position: 'absolute',
        right: 30,
        top: 16
    },
    completedText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default MetaPromocion;
