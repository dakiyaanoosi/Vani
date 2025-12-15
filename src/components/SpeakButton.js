import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SpeakButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>🎤 Speak Emergency</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    color: '#D32F2F',
    fontSize: 18,
    fontWeight: '600',
  },
});