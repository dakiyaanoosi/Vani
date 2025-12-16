import { View, Vibration, StyleSheet } from 'react-native';
import NetworkStatus from '../hooks/NetworkStatus';
import NetworkBanner from '../components/NetworkBanner';
import HelpButton from '../components/HelpButton';
import SpeakButton from '../components/SpeakButton';
import AIButton from '../components/AIButton';
import SOSButton from '../components/SOSButton';

export default function HomeScreen({ navigation }) {
  const isOnline = NetworkStatus();

  return (
    <View style={styles.container}>
      <NetworkBanner isOnline={isOnline} />

      <View style={styles.content}>
        <HelpButton
          onPress={() => {
            navigation.navigate('EmergencyScreen');
            /*Vibration.vibrate(200);*/
          }}
        />

        <SpeakButton
          onPress={() => navigation.navigate('VoiceEmergency')}
        />
        <AIButton
          isOnline={isOnline}
          onPress={() => navigation.navigate('AISymptomsScreen')}
        />
      </View>
      <View style={{ flex: 1 }}>

        <View style={{ position: 'absolute', bottom: 40, right: 20 }}>
          <SOSButton />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});