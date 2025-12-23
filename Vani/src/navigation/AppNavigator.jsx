import React,{ useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { View, StyleSheet, Keyboard } from 'react-native';
import WelcomePage from '../screens/WelcomePage';
import { Alert, Linking } from 'react-native';
import AboutDevelopers from '../screens/AboutDevelopers';
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

import { useLanguage } from '../context/LanguageContext';
import { findEmergencyByKeyword } from '../services/offlineDB';
import { classifyEmergencyWithGemini } from '../services/geminiRouter';
import { useNetwork } from '../context/NetworkContext';
import SOSScreen from '../screens/SOSScreen';
import { useNavigationState } from '@react-navigation/native';

import SideBar from '../components/SideBar';
import SOSContactsModal from '../components/SOSContactsModal';
import SOSMessageModal from '../components/SOSMessageModal';

import HelplineScreen from '../screens/HelplineScreen';

import {
  loadContacts,
  saveContacts,
  loadMessage,
  saveMessage,
} from '../services/sosStorage';

const Stack = createNativeStackNavigator();

export const navigationRef = createNavigationContainerRef();

const AppNavigator = () => {
  const { language } = useLanguage();
  const { isOnline } = useNetwork();
  const [currentRoute, setCurrentRoute] = useState(null);
  const isOnSOSScreen = currentRoute === 'SOS';

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [contactsVisible, setContactsVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      setContacts(await loadContacts());
      setMessage(await loadMessage());
    })();
  }, []);

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

    const offlineMatch = findEmergencyByKeyword(prompt, language);

    if (offlineMatch) {
      navigationRef.navigate('EmergencyFlow', {
        emergencyId: offlineMatch.id,
      });
      return;
    }

    if (!isOnline) {
      navigationRef.navigate('AIResponse', { prompt });
      return;
    }

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
      {currentRoute !== 'Welcome' && (
        <GlobalNavbar onMenuPress={() => setSidebarOpen(true)} />
      )}

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
              <Stack.Screen name="Welcome" component={WelcomePage} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="EmergencyFlow"
                component={EmergencyFlowScreen}
              />
              <Stack.Screen name="AIResponse" component={AIResponseScreen} />
              <Stack.Screen name="SOS" component={SOSScreen} />
              <Stack.Screen name="Helplines" component={HelplineScreen} />
              <Stack.Screen name="AboutDevelopers" component={AboutDevelopers} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>

        <SideBar
          visible={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onEditContacts={() => setContactsVisible(true)}
          onEditMessage={() => setMessageVisible(true)}
          navigation={navigationRef}
        />

        <SOSContactsModal
          visible={contactsVisible}
          contacts={contacts}
          onClose={() => setContactsVisible(false)}
          onSave={async c => {
            setContacts(c);
            await saveContacts(c);
          }}
        />

        <SOSMessageModal
          visible={messageVisible}
          message={message}
          onClose={() => setMessageVisible(false)}
          onSave={async m => {
            setMessage(m);
            await saveMessage(m);
          }}
        />

        {currentRoute !== 'Welcome' && (
          <GlobalChatBar onSend={handleSend} disableSOS={isOnSOSScreen} />
        )}
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