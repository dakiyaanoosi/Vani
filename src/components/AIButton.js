/*currently not in use */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function AIButton({ isOnline, onPress }) {
  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          !isOnline && { backgroundColor: '#E0E0E0' }
        ]}
        disabled={!isOnline}
        onPress={onPress}
        accessibilityLabel="AI medical symptom analysis"
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.text,
            !isOnline && { color: '#9E9E9E' }
          ]}
        >
          (gemini logo) AI Emergency
        </Text>
      </TouchableOpacity>  

      {!isOnline && (
        <Text style={styles.hint}>  
          Internet required for AI assistance  
        </Text>  /* disclamier symbol to be added */
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D47A1'
  },
  hint: {
    marginTop: 6,
    fontSize: 12,
    color: '#777',
    textAlign: 'center'
  }
});