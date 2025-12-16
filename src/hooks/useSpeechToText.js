import { useEffect, useState } from 'react';
import Voice from '@react-native-voice/voice';

const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!Voice) return;

    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);

    Voice.onSpeechResults = (e) => {
      setRecognizedText(e?.value?.[0] ?? '');
    };

    Voice.onSpeechError = (e) => {
      console.log('Speech error:', e);
      setError(e);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      if (isListening) return; 
      await Voice.start('en-IN');
    } catch (e) {
      console.log('Start error:', e);
      setError(e);
    }
  };

  const stopListening = async () => {
    try {
      if (!isListening) return; 
      await Voice.stop();
    } catch (e) {
      console.log('Stop error:', e);
      setError(e);
    }
  };

  return {
    isListening,
    recognizedText,
    error,
    startListening,
    stopListening,
  };
};

export default useSpeechToText;
