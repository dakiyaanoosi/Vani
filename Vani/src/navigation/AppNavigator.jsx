import React from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
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

const Stack = createNativeStackNavigator();

export const navigationRef = createNavigationContainerRef();

const AppNavigator = () => {
  // 2. Get current language to search the correct DB
  const { language } = useLanguage();
  const { isOnline } = useNetwork();

  const handleSend = async prompt => {
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

      <View style={styles.navigator}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="EmergencyFlow"
              component={EmergencyFlowScreen}
            />
            <Stack.Screen name="AIResponse" component={AIResponseScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>

      <GlobalChatBar onSend={handleSend} />
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
