import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  AppState,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import SoundPlayer from 'react-native-sound-player';
import { useLanguage } from '../context/LanguageContext';
import { getEmergencyById } from '../services/offlineDB';
import Call112Button from '../components/Call112Button';
import { loadSavedAI, deleteSavedAI } from '../services/aiStorage';

const EmergencyFlowScreen = ({ route, navigation }) => {
  const { emergencyId, source } = route.params;
  const { language } = useLanguage();
  const [emergency, setEmergency] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (source === 'ai') {
        const ai = await loadSavedAI();
        const found = ai.find(e => e.id === emergencyId);

        if (found) {
          setEmergency({
            title: found.titles[language] || found.titles['en'],
            steps: found.steps[language] || found.steps['en'],
            red_flags: found.red_flags
              ? found.red_flags[language] || found.red_flags['en']
              : [],
          });
        }
      } else {
        const sys = getEmergencyById(emergencyId, language);
        setEmergency(sys);
      }
    };

    load();
  }, [language, emergencyId, source]);

  const audioKey = `${emergencyId}_${language}`;

  const playAudio = () => {
    if (source === 'ai') return;
    try {
      SoundPlayer.playSoundFile(audioKey, 'mp3');
      setIsPlaying(true);
    } catch (error) {
      console.log('Audio play error:', error);
    }
  };

  const stopAudio = () => {
    try {
      SoundPlayer.stop();
    } catch (e) {}
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) stopAudio();
    else playAudio();
  };

  useEffect(() => {
    const finishedListener = SoundPlayer.addEventListener(
      'FinishedPlaying',
      () => setIsPlaying(false),
    );
    return () => finishedListener.remove();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState.match(/inactive|background/)) stopAudio();
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (source !== 'ai') playAudio();
    return () => stopAudio();
  }, [language]);

  const handleDelete = () => {
    Alert.alert(
      'Delete saved response',
      'Are you sure you want to delete this saved AI response?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSavedAI(emergencyId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (!emergency) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="red" style={{ marginTop: 50 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            stopAudio();
            navigation.goBack();
          }}
        >
          <Icon name="keyboard-backspace" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>
          {emergency.title}
          {source === 'ai' ? (
            <Text style={{ fontWeight: 800 }}>
              <Text style={{ color: '#777' }}>&nbsp; ● </Text>
              <Text style={{ color: '#777' }}>AI</Text>
            </Text>
          ) : (
            ''
          )}
        </Text>

        <Call112Button />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          {source !== 'ai' && (
            <TouchableOpacity style={styles.audioButton} onPress={toggleAudio}>
              <Icon
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={20}
                color="#fff"
              />
              <Text style={styles.audioText}>
                {isPlaying ? 'Pause Audio' : 'Play Audio'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.hospitalButton}
            onPress={() => {
              Linking.openURL(
                'https://www.google.com/maps/search/?api=1&query=nearby+hospitals',
              );
            }}
          >
            <Icon2 name="external-link" size={20} color="#fff" />
            <Text style={styles.audioText}>Nearby Hospitals</Text>
          </TouchableOpacity>

          {source === 'ai' && (
            <TouchableOpacity
              style={styles.hospitalButton}
              onPress={handleDelete}
            >
              <Icon name="delete" size={20} color="#ff4d4d" />
              <Text style={[styles.audioText]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>

        {emergency.steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        {emergency.red_flags && emergency.red_flags.length > 0 && (
          <View style={styles.alertBox}>
            <View style={styles.alertHeader}>
              <Icon name="warning-amber" size={22} color="#ff4d4d" />
              <Text style={styles.alertTitle}>Emergency Warning</Text>
            </View>

            {emergency.red_flags.map((flag, index) => (
              <Text key={index} style={styles.alertText}>
                • {flag}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default EmergencyFlowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  content: {
    padding: 16,
    paddingBottom: 150,
  },

  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#777',
  },

  hospitalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#777',
  },

  audioText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },

  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff4d4d',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  stepNumberText: {
    color: '#fff',
    fontWeight: '600',
  },

  stepText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },

  alertBox: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1a0000',
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },

  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  alertTitle: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  alertText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
  },

  error: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
