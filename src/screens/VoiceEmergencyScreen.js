import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useSpeechToText from '../hooks/useSpeechToText'; 

const VoiceEmergencyScreen = () => {
  const {
    isListening,
    recognizedText,
    error,
    startListening,
    stopListening,
  } = useSpeechToText();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voice Recognition</Text>
      
      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={isListening ? stopListening : startListening}
      />

      {error && <Text style={styles.error}>Error: {error.message}</Text>}

      {recognizedText ? (
        <Text style={styles.results}>Heard: {recognizedText}</Text>
      ) : (
        <Text style={styles.hint}>{isListening ? 'Listening...' : 'Press start to speak'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  hint: {
    marginTop: 20,
    color: 'gray',
  },
  results: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    marginTop: 10,
    color: 'red',
  }
});

export default VoiceEmergencyScreen;

