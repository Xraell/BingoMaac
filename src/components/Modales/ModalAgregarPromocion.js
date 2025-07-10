import React, { useState } from "react";
import { View, Modal, Pressable, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import { BingoColors } from "../../Theme/Colors";

const ModalAgregarPromocion = ({ promociones, setPromociones }) => {
    const [visible, setVisible] = useState(false);

    const agregarPromocion = () => {
        setPromociones([...promociones, { nroBoletos: "", valor: "", boletosRegalo: "" }]);
    };

    const actualizarPromocion = (index, field, value) => {
        console.log('index, field, value: ', index, field, value);
        const nuevasPromociones = [...promociones];
        nuevasPromociones[index][field] = value;
        setPromociones(nuevasPromociones);
    };

    const eliminarPromocion = (index) => {
        const nuevasPromociones = promociones.filter((_, i) => i !== index);
        setPromociones(nuevasPromociones);
    };

    return (
        <View style={styles.centeredView}>
            <Modal animationType="slide" transparent={true} visible={visible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={styles.textStyle}>X</Text>
                        </Pressable>
                        <Text variant="titleLarge" style={styles.title}>
                            AGREGAR PROMOCIONES
                        </Text>

                        <ScrollView style={styles.scrollContainer}>
                            {promociones.map((promocion, index) => (
                                <View key={index}>
                                    <Text style={{ marginLeft: 15 ,color:BingoColors.primary,fontWeight:'bold'}} variant="bodyMedium">
                                        Promoción {index + 1}
                                    </Text>
                                    <View style={styles.promocionContainer}>
                                        <TextInput
                                            mode="outlined"
                                            value={promocion.nroBoletos}
                                            style={styles.input}
                                            label={"Boletos"}
                                            keyboardType="numeric"
                                            onChangeText={(value) =>
                                                actualizarPromocion(index, "nroBoletos", value)
                                            }
                                        />
                                        <TextInput
                                            mode="outlined"
                                            value={promocion.valor}
                                            style={styles.input}
                                            label={"Valor"}
                                            keyboardType="numeric"
                                            onChangeText={(value) =>
                                                actualizarPromocion(index, "valor", value)
                                            }
                                        />
                                        <TextInput
                                            mode="outlined"
                                            value={promocion.boletosRegalo}
                                            style={styles.input}
                                            label={"Regalo"}
                                            keyboardType="numeric"
                                            onChangeText={(value) =>
                                                actualizarPromocion(index, "boletosRegalo", value)
                                            }
                                        />
                                        <IconButton
                                            icon="delete"
                                            color={BingoColors.tertiary}
                                            mode="contained"
                                            iconColor={BingoColors.tertiary}
                                            size={25}
                                            onPress={() => eliminarPromocion(index)}
                                            style={styles.deleteButton}
                                        />
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        <Button
                            mode="contained"
                            style={styles.buttonAgregar}
                            onPress={agregarPromocion}
                        >
                            Agregar Promoción
                        </Button>
                    </View>
                </View>
            </Modal>
            <Button
                mode="outlined"
                style={styles.openButton}
                onPress={() => setVisible(true)}
            >
                Abrir Promociones
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    modalView: {
        backgroundColor: BingoColors.white,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minHeight: "60%",
        marginTop: "30%",
        width: "95%",
    },
    buttonClose: {
        backgroundColor: BingoColors.primary,
        position: "absolute",
        top: 10,
        right: 10,
        borderRadius: 100,
        paddingHorizontal: 10,
    },
    textStyle: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20,
    },
    title: {
        marginTop: 10,
        marginBottom: 20,
        fontWeight: "900",
        color: BingoColors.black,
    },
    scrollContainer: {
        maxHeight: "70%",
        marginBottom: 20, width: '100%'
    },
    promocionContainer: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: BingoColors.lightGray,
        marginRight: 10,
    },
    input: {
        width: 100,
        marginHorizontal: 5,
    },
    deleteButton: {
        marginLeft: 10,
        backgroundColor: BingoColors.primary,
        color: BingoColors.tertiary
    },
    buttonAgregar: {
        marginTop: 10,
        backgroundColor: BingoColors.primary,
    },
    openButton: {
        paddingHorizontal: 10,
        margin: 10,
    },
});

export default ModalAgregarPromocion;
