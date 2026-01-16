import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://10.40.30.50:3000';

export default function HomeScreen({ route, navigation }) {
    const { user } = route.params;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/${user.id}`);
            setUserData(response.data);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de récupérer les données utilisateur');
        } finally {
            setLoading(false);
        }
    };

    // Recharger les données à chaque fois que l'écran devient focus (après une transaction par exemple)
    useFocusEffect(
        React.useCallback(() => {
            fetchUserData();
        }, [])
    );

    if (loading) return <ActivityIndicator size="large" />;

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Bienvenue, {userData?.fullName}</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Votre Solde :</Text>
                <Text style={styles.balance}>{userData?.balance} MAD</Text>
            </View>

            <View style={styles.actions}>
                <View style={styles.buttonContainer}>
                    <Button title="Virement" onPress={() => navigation.navigate('Transfer', { user: userData })} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Versement" onPress={() => navigation.navigate('Deposit', { user: userData })} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Retrait" onPress={() => navigation.navigate('Withdraw', { user: userData })} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Historique" color="gray" onPress={() => navigation.navigate('History', { user: userData })} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Se Déconnecter" color="red" onPress={() => navigation.replace('Login')} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center' },
    welcome: { fontSize: 20, marginBottom: 20 },
    card: { backgroundColor: '#f0f0f0', padding: 20, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 30 },
    label: { fontSize: 16, color: '#555' },
    balance: { fontSize: 32, fontWeight: 'bold', color: '#333' },
    actions: { width: '100%' },
    buttonContainer: { marginBottom: 10 }
});
