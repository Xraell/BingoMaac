import React, { useState, useEffect } from 'react';
import { 
    View, 
    Modal, 
    StyleSheet, 
    ScrollView, 
    SafeAreaView, 
    Alert, 
    ActivityIndicator, 
    Dimensions 
} from 'react-native';
import { 
    Text, 
    Button, 
    RadioButton, 
    Divider, 
    IconButton, 
    Card 
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../../context/AppProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { BingoColors } from '../../Theme/Colors';
import { EscogerPromocion } from '../../Utils/UsuarioPromocion';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ModalInicioPartida() {
    const [visible, setVisible] = useState(false);
    const [selectedPromocion, setSelectedPromocion] = useState(null);
    const [loading, setLoading] = useState(false);

    const { partidaActual, premios, promociones, setPromocion, user } = useAppContext();

    useEffect(() => {
        verificarNuevaPartida();
    }, []);

    const verificarNuevaPartida = async () => {
        try {
            const valor = await AsyncStorage.getItem('idUltimaPartida');
            if (valor == null || (valor != partidaActual.id && selectedPromocion == null)) {
                setVisible(true);
            }
        } catch (error) {
            console.error("Error al obtener la nueva partida", error);
        }
    };

    const iniciarNuevaPartida = async () => {
        if (selectedPromocion) {
            setLoading(true);
            try {
                const response = await EscogerPromocion(user.id, selectedPromocion);
                setPromocion(response);
                await AsyncStorage.setItem('idUltimaPartida', partidaActual.id.toString());
                setVisible(false);
            } catch (error) {
                console.error("Error al iniciar la nueva partida", error);
                Alert.alert("Error", "No se pudo iniciar la partida. Intente nuevamente.");
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert("Aviso", "Por favor, selecciona una promoción para continuar.");
        }
    };

    const cerrarModal = () => {
        Alert.alert(
            "Confirmar",
            "¿Estás seguro/a de que quieres cerrar sin seleccionar una promoción?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Cerrar", onPress: async () => {
                        await AsyncStorage.setItem('idUltimaPartida', partidaActual.id.toString());
                        setVisible(false);
                    }
                }
            ]
        );
    };

    return (
        <Modal 
            animationType="fade" 
            transparent={true} 
            visible={visible}
            onRequestClose={cerrarModal}
        >
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient 
                    colors={[BingoColors.primary, BingoColors.tertiary]} 
                    style={styles.gradientBackground}
                >
                    <View style={styles.modalContainer}>
                        <Card style={styles.modalContent}>
                            <IconButton
                                icon="close"
                                size={24}
                                onPress={cerrarModal}
                                style={styles.closeButton}
                            />
                            <ScrollView 
                                contentContainerStyle={styles.scrollViewContent}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <Card.Content>
                                    <Text variant="headlineSmall" style={styles.title}>
                                        Nueva Partida de Bingo MAAC
                                    </Text>
                                    <Text variant="titleMedium" style={styles.subtitle}>
                                        Partida Nº {partidaActual.NroPartida}
                                    </Text>
                                    <Text variant="bodyMedium" style={styles.description}>
                                        "{partidaActual.Descripcion}"
                                    </Text>

                                    <Divider style={styles.divider} />

                                    <Text variant="titleMedium" style={styles.sectionTitle}>
                                        Elige tu Promoción:
                                    </Text>
                                    <RadioButton.Group 
                                        onValueChange={setSelectedPromocion} 
                                        value={selectedPromocion}
                                    >
                                        <View style={styles.promocionesList}>
                                            {promociones.map((promocion) => (
                                                <Card 
                                                    key={promocion.id} 
                                                    style={styles.promocionCard}
                                                >
                                                    <Card.Content style={styles.promocionContent}>
                                                        <View style={styles.promocionInfo}>
                                                            <RadioButton 
                                                                value={promocion.id.toString()} 
                                                            />
                                                            <Text 
                                                                variant="titleSmall" 
                                                                style={styles.promocionText}
                                                            >
                                                                {`${promocion.nroBoletos} Boleto${promocion.nroBoletos > 1 ? "s" : ""} por ${partidaActual.CostoBoleto * promocion.nroBoletos - promocion.valor} Bs`}
                                                            </Text>
                                                        </View>
                                                        {promocion.boletosRegalo > 0 && (
                                                            <View style={styles.boletosRegalo}>
                                                                <MaterialCommunityIcons 
                                                                    name="gift" 
                                                                    size={20} 
                                                                    color={BingoColors.primary} 
                                                                />
                                                                <Text style={styles.boletosRegaloText}>
                                                                    {`+${promocion.boletosRegalo} gratis`}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </Card.Content>
                                                </Card>
                                            ))}
                                        </View>
                                    </RadioButton.Group>

                                    <Divider style={styles.divider} />

                                    <Text variant="titleMedium" style={styles.sectionTitle}>
                                        Premios Disponibles:
                                    </Text>
                                    <View style={styles.premiosList}>
                                        {premios.map((premio) => (
                                            <Card 
                                                key={premio.id} 
                                                style={styles.premioCard}
                                            >
                                                <Card.Content>
                                                    <Text 
                                                        variant="titleMedium" 
                                                        style={styles.premioNombre}
                                                    >
                                                        {premio.premio.nombre}
                                                    </Text>
                                                    <Text 
                                                        variant="bodyMedium" 
                                                        style={styles.premioDescripcion}
                                                    >
                                                        {premio.premio.descripcion}
                                                    </Text>
                                                    {premio.monto > 0 && (
                                                        <Text 
                                                            variant="titleSmall" 
                                                            style={styles.premioMonto}
                                                        >
                                                            {premio.monto} Bs
                                                        </Text>
                                                    )}
                                                </Card.Content>
                                            </Card>
                                        ))}
                                    </View>
                                </Card.Content>
                            </ScrollView>

                            <Card.Actions style={styles.actionContainer}>
                                <Button
                                    mode="contained"
                                    onPress={iniciarNuevaPartida}
                                    style={styles.startButton}
                                    labelStyle={styles.startButtonLabel}
                                    disabled={loading}
                                >
                                    {loading ? <ActivityIndicator color="#fff" /> : "¡Empezar a Jugar!"}
                                </Button>
                            </Card.Actions>
                        </Card>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        elevation: 5,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        right: 5,
        top: 5,
        zIndex: 100,
    },
    title: {
        marginTop: '10%',
        marginBottom: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        color: BingoColors.primary,
    },
    subtitle: {
        marginBottom: 5,
        textAlign: 'center',
        color: BingoColors.secondary,
    },
    description: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 15,
    },
    divider: {
        marginVertical: 15,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        color: BingoColors.primary,
    },
    promocionesList: {
        paddingBottom: 10,
    },
    promocionCard: {
        marginBottom: 10,
        elevation: 2,
    },
    promocionContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    promocionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    promocionText: {
        marginLeft: 10,
        flexShrink: 1,
    },
    boletosRegalo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boletosRegaloText: {
        marginLeft: 5,
        fontWeight: 'bold',
        color: BingoColors.primary,
    },
    premiosList: {
        paddingBottom: 10,
    },
    premioCard: {
        marginBottom: 10,
        elevation: 2,
    },
    premioNombre: {
        fontWeight: 'bold',
        color: BingoColors.primary,
    },
    premioDescripcion: {
        fontStyle: 'italic',
        marginVertical: 5,
    },
    premioMonto: {
        fontWeight: 'bold',
        color: BingoColors.secondary,
    },
    actionContainer: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    startButton: {
        flex: 1,
        borderRadius: 25,
        backgroundColor: BingoColors.primary,
    },
    startButtonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});