import { useEffect, useState, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Voice from '@react-native-voice/voice';

const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsListening(true);
      setError(null);
    };

    Voice.onSpeechEnd = () => setIsListening(false);

    Voice.onSpeechError = (e) => {
      console.error('Speech Error:', e);
      setError(e.error?.message || 'Speech recognition error');
      setIsListening(false);
    };

    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        setRecognizedText(e.value[0]);
      }
    };


    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to transcribe speech.',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true; 
  };

  const startListening = useCallback(async (locale = 'en-IN') => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      setError('Microphone permission denied');
      return;
    }

    try {
      setRecognizedText('');
      setError(null);
      await Voice.start(locale);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  return {
    isListening,
    recognizedText,
    error,
    startListening,
    stopListening,
  };
};

export default useSpeechToText;