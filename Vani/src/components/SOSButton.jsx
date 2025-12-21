import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SOSButton = ({ onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.wrapper}>
        <View style={styles.ring4} />
        <View style={styles.ring3} />
        <View style={styles.ring2} />
        <View style={styles.ring1}>
          <Text style={styles.text}>SOS</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SOSButton;

const baseRing = {
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
};

const styles = StyleSheet.create({
  wrapper: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring4: {
    ...baseRing,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,0,0,0.10)',
  },
  ring3: {
    ...baseRing,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255,0,0,0.15)',
  },
  ring2: {
    ...baseRing,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,0,0,0.20)',
  },
  ring1: {
    ...baseRing,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#ff0000',
  },
  text: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
  },
});
