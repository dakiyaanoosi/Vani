
import { View, Vibration, StyleSheet } from 'react-native';
import NetworkStatus from '../hooks/NetworkStatus';
import NetworkBanner from '../components/NetworkBanner';
import SpeakButton from '../components/SpeakButton';
import VoiceEmergencyScreen from './VoiceEmergencyScreen';

import SOSButton from '../components/SOSButton';
import CustomCurvedTabBar from '../components/CustomCurvedTabBar'; 

export default function HomeScreen({ navigation }) {
  const isOnline = NetworkStatus();

  return (
    <View style={styles.container}>
      <NetworkBanner isOnline={isOnline} />

      
      <View style={styles.content}>
       
        
      </View>
      <View style ={styles.speakButton}>
        <SpeakButton
          onPress={() => navigation.navigate('VoiceEmergencyScreen')} />
        </View>
        

     
      <View style={styles.sosButtonContainer}>
        <SOSButton />
      </View>

      
      <CustomCurvedTabBar navigation={navigation} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8', 
  },
  content: {
    flex: 1,
    justifyContent: 'center', 
    paddingHorizontal: 24,
    paddingBottom: 120, 
  },
  sosButtonContainer: {
    position: 'absolute',
    top: 250, 
    alignSelf: 'center', 
    zIndex: 10, 
  },
  speakButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    zIndex: 10,
  },
});
