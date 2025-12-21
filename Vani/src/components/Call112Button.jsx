import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';

const Call112Button = () => {
  const handleCall = () => {
    const url = Platform.OS === 'android' ? 'tel:112' : 'telprompt:112';

    Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleCall}>
      <Text style={styles.text}>Call 112</Text>
    </TouchableOpacity>
  );
};

export default Call112Button;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#ff4d4d',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});
