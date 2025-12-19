import React from 'react';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { View, StyleSheet, Keyboard } from 'react-native';

import { Alert, Linking } from 'react-native';
import {
  requestLocationPermission,
  hasLocationPermission,
} from '../services/locationService';
import { requestSMSPermission } from '../services/permissions';

import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import EmergencyFlowScreen from '../screens/EmergencyFlowScreen';
import AIResponseScreen from '../screens/AIResponseScreen';

import GlobalNavbar from '../components/GlobalNavbar';
import GlobalChatBar from '../components/GlobalChatBar';

// 1. Import the Brain and the Offline Search Service
import { useLanguage } from '../context/LanguageContext';
import { findEmergencyByKeyword } from '../services/offlineDB';
import { classifyEmergencyWithGemini } from '../services/geminiRouter';
import { useNetwork } from '../context/NetworkContext';
import SOSScreen from '../screens/SOSScreen';
import { useNavigationState } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export const navigationRef = createNavigationContainerRef();

const AppNavigator = () => {
  // 2. Get current language to search the correct DB
  const { language } = useLanguage();
  const { isOnline } = useNetwork();
  const isOnSOSScreen = currentRoute === 'SOS';
  const [currentRoute, setCurrentRoute] = useState(null);

  const handleSend = async prompt => {
    if (prompt === '__SOS__') {
      const smsAllowed = await requestSMSPermission();

      if (!smsAllowed) {
        Alert.alert(
          'SMS Permission Required',
          'SMS permission is required to send emergency alerts to your contacts.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Settings', onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      let locationAllowed = await hasLocationPermission();
      if (!locationAllowed) {
        locationAllowed = await requestLocationPermission();
      }

      if (!locationAllowed) {
        Alert.alert(
          'Location Permission Required',
          'Location permission is required to include your location in the SOS message.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Settings', onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      navigationRef.navigate('SOS');
      return;
    }

    if (!navigationRef.isReady()) return;

    Keyboard.dismiss();

    // 1️⃣ Offline HIGH-CONFIDENCE check
    const offlineMatch = findEmergencyByKeyword(prompt, language);

    if (offlineMatch) {
      navigationRef.navigate('EmergencyFlow', {
        emergencyId: offlineMatch.id,
      });
      return;
    }

    // 2️⃣ If offline, go straight to AI advice
    if (!isOnline) {
      navigationRef.navigate('AIResponse', { prompt });
      return;
    }

    // 3️⃣ Online → ask Gemini ROUTER
    const geminiResult = await classifyEmergencyWithGemini(prompt);

    if (geminiResult !== 'NONE') {
      navigationRef.navigate('EmergencyFlow', {
        emergencyId: geminiResult,
      });
    } else {
      navigationRef.navigate('AIResponse', { prompt });
    }
  };

  return (
    <View style={styles.root}>
      <GlobalNavbar />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.navigator}>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              setCurrentRoute(navigationRef.getCurrentRoute()?.name);
            }}
            onStateChange={() => {
              setCurrentRoute(navigationRef.getCurrentRoute()?.name);
            }}
          >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="EmergencyFlow"
                component={EmergencyFlowScreen}
              />
              <Stack.Screen name="AIResponse" component={AIResponseScreen} />
              <Stack.Screen name="SOS" component={SOSScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>

        <GlobalChatBar onSend={handleSend} disableSOS={isOnSOSScreen} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  navigator: {
    flex: 1,
  },
});
