import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

// IMPORTANT : Remplacez par l'IP de votre machine si vous testez sur un appareil physique ou Android Emulator (10.0.2.2)
const API_URL = 'http://10.40.30.50:3000';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            // On passe l'utilisateur à l'écran suivant via les paramètres de navigation
            navigation.replace('Home', { user: response.data.user });
        } catch (error) {
            Alert.alert('Erreur', error.response?.data?.message || 'Une erreur est survenue');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Banque Mobile</Text>
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
            <Button title="Se connecter" onPress={handleLogin} />

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
                <Text style={styles.linkText}>Pas de compte ? S'inscrire</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
    link: { marginTop: 15, alignItems: 'center' },
    linkText: { color: 'blue' }
});
