import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.40.30.50:3000';

export default function RegisterScreen({ navigation }) {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!fullName || !username || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        try {
            await axios.post(`${API_URL}/register`, { fullName, username, password });
            Alert.alert('Succès', 'Compte créé avec succès ! Connectez-vous.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Erreur', error.response?.data?.error || 'Erreur lors de l\'inscription');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Créer un compte</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom complet"
                value={fullName}
                onChangeText={setFullName}
            />
            <TextInput
                style={styles.input}
                placeholder="Identifiant"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="S'inscrire" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});
