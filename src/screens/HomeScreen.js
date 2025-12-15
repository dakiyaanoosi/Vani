import { View, StyleSheet } from 'react-native';
import NetworkStatus from '../hooks/NetworkStatus';
import NetworkBanner from '../components/NetworkBanner';
import HelpButton from '../components/HelpButton';
import SpeakButton from '../components/SpeakButton';

export default function HomeScreen({ navigation }) {
  const isOnline = NetworkStatus();

  return (
    <View style={styles.container}>
      <NetworkBanner isOnline={isOnline} />

      <View style={styles.content}>
        <HelpButton
          onPress={() => navigation.navigate('EmergencyScreen')}
        />

        <SpeakButton
          onPress={() => navigation.navigate('VoiceEmergency')}
        />
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