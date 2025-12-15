import { View, Text, StyleSheet } from 'react-native';

export default function NetworkBanner({ isOnline }) {
  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: isOnline ? '#4CAF50' : '#E53935' },
      ]}
    >
      <Text style={styles.text}>
        {isOnline
          ? 'AI Assistance Available'
          : 'Offline Mode Active – Emergency Help Available'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    position: 'absolute',
    zIndex: 30,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    color: '#ffffffff',
    
    fontWeight: '800',
    fontSize: 16,
  },
});