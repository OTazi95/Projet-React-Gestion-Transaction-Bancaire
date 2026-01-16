import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.40.30.50:3000';

export default function HistoryScreen({ route }) {
    const { user } = route.params;
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Utilisation de useEffect pour charger les données au montage du composant
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${API_URL}/history/${user.id}`);
                setTransactions(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user.id]);

    const getLabel = (type) => {
        switch (type) {
            case 'DEPOSIT': return 'Versement';
            case 'WITHDRAWAL': return 'Retrait';
            case 'TRANSFER': return 'Virement';
            default: return type;
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View>
                <Text style={styles.type}>{getLabel(item.type)}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                <Text style={styles.desc}>{item.description}</Text>
            </View>
            <Text style={[styles.amount, item.type === 'DEPOSIT' ? styles.plus : styles.minus]}>
                {item.type === 'DEPOSIT' ? '+' : '-'}{item.amount} MAD
            </Text>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>Aucune transaction</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    item: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: 'white' },
    type: { fontWeight: 'bold', fontSize: 16 },
    date: { color: 'gray', fontSize: 12 },
    desc: { fontStyle: 'italic', marginTop: 2 },
    amount: { fontSize: 16, fontWeight: 'bold' },
    plus: { color: 'green' },
    minus: { color: 'red' },
    empty: { textAlign: 'center', marginTop: 20, color: 'gray' }
});
