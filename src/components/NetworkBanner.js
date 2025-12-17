import { View, Text, StyleSheet } from 'react-native';

export default function NetworkBanner({ isOnline }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.banner}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isOnline ? '#22C55E' : '#EF4444' },
          ]}
        />
        <Text style={styles.text}>
          {isOnline ? 'AI ONLINE' : 'OFFLINE MODE'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 30,
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(30, 41, 59, 0.85)', // frosted dark
    elevation: 8,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 8,
    
  },

  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E7EB',
    letterSpacing: 0.6,
  },
});
