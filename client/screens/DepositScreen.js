import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.40.30.50:3000';

export default function DepositScreen({ route, navigation }) {
    const { user } = route.params;
    const [amount, setAmount] = useState('');

    const handleDeposit = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            Alert.alert('Erreur', 'Montant invalide');
            return;
        }

        try {
            await axios.post(`${API_URL}/transaction`, {
                userId: user.id,
                type: 'DEPOSIT',
                amount: parseFloat(amount),
                description: 'Versement espèces'
            });
            Alert.alert('Succès', 'Versement effectué');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors de la transaction');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Effectuer un Versement</Text>
            <TextInput
                style={styles.input}
                placeholder="Montant (MAD)"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <Button title="Valider" onPress={handleDeposit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});
