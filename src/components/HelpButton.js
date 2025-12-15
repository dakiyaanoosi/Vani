import { TouchableOpacity, Vibration, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function HelpButton({ onPress }) {
  return (

    <TouchableOpacity style={styles.button} onPress={onPress}
      accessibilityLabel="Emergency help button"  /*accessibility*/
      accessibilityHint="Opens emergency categories"
      accessibilityRole="button"
      >
      <Text style={styles.text}>HELP</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#D32F2F',
    paddingVertical: 44,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
  },
  text: {
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});