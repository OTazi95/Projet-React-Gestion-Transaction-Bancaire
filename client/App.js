import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import DepositScreen from './screens/DepositScreen';
import WithdrawScreen from './screens/WithdrawScreen';
import TransferScreen from './screens/TransferScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Inscription' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mon Compte', headerLeft: null }} />
        <Stack.Screen name="Deposit" component={DepositScreen} options={{ title: 'Versement' }} />
        <Stack.Screen name="Withdraw" component={WithdrawScreen} options={{ title: 'Retrait' }} />
        <Stack.Screen name="Transfer" component={TransferScreen} options={{ title: 'Virement' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Historique' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
