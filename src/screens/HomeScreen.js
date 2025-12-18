import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import NetworkStatus from '../hooks/NetworkStatus';
import NetworkBanner from '../components/NetworkBanner';
import SpeakButton from '../components/SpeakButton';
import SOSButton from '../components/SOSButton';
import CustomCurvedTabBar from '../components/CustomCurvedTabBar';

export default function HomeScreen({ navigation }) {
  const isOnline = NetworkStatus();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#211f1fff" barStyle="light-content" />

      <NetworkBanner isOnline={isOnline} />

     
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Emergency AI</Text>
      </View>

      <View style={styles.content} />

     
      <View style={styles.speakButton}>
        <SpeakButton
          onPress={() => navigation.navigate('VoiceEmergencyScreen')}
        />
      </View>

     
      <View style={styles.sosButtonContainer}>
        <SOSButton />
        <Text style={styles.text}>STAY CALM!</Text>
        <Text style={styles.subtext}>
          Your emergency alert has been sent. Please stay calm, help is on the way.
        </Text>
      </View>

      <CustomCurvedTabBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', 
  },


  headerContainer: {
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E53935',
    elevation: 4,              
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },

  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },

  content: {
    flex: 1,
    paddingBottom: 120,
  },

  sosButtonContainer: {
    position: 'absolute',
    top: 230,
    alignSelf: 'center',
    zIndex: 10,
    alignItems: 'center',
  },

  text: {
    color: '#C62828',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 18,
  },

  subtext: {
    width: 300,
    textAlign: 'center',
    fontSize: 18,
    color: '#757575',
    marginTop: 6,
  },

  speakButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    zIndex: 10,
  },
});
