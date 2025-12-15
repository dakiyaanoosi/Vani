import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import EmergencyDetailScreen from '../screens/EmergencyDetailScreen';
import AISymptomsScreen from '../screens/AISymptomsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
                name="EmergencyScreen"
                component={EmergencyScreen}
            />
            <Stack.Screen 
                name="AISymptomsScreen"
                component={AISymptomsScreen}
            />
            <Stack.Screen
                name="EmergencyDetailScreen"
                component={EmergencyDetailScreen}
            />
        </Stack.Navigator>
    );
}
