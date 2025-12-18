import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';

import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const TAB_BAR_HEIGHT = 90;

const CustomCurvedTabBar = ({ navigation }) => {
  
  const fillPath = `
    M0,20
    C0,20 20,0 70,0
    L${width - 70},0
    C${width - 20},0 ${width},20 ${width},20
    L${width},${TAB_BAR_HEIGHT}
    L0,${TAB_BAR_HEIGHT}
    Z
  `;

  const borderPath = `
    M0,20
    C0,20 20,0 70,0
    L${width - 70},0
    C${width - 20},0 ${width},20 ${width},20
  `;

  return (
    <View style={styles.container}>
      <Svg
        width={width}
        height={TAB_BAR_HEIGHT}
        style={styles.svg}
      >
        <Path 
          d={fillPath} 
          fill="#ffffff" 
        />

        <Path 
          d={borderPath} 
          fill="none" 
          stroke="#dcdbdbff" 
          strokeWidth={1.5} 
        />
      </Svg>

      <TouchableOpacity
        style={[styles.iconButton, styles.leftIcon]}
        onPress={() => navigation.navigate('EmergencyScreen')}
      >
        <View style={styles.circleContainer}>
          <Icon name="medical-bag" size={29} color="#B22222" />
        </View>
        <Text style={styles.iconText}>Help</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.iconButton, styles.rightIcon]}
        onPress={() => navigation.navigate('AISymptomsScreen')}
      >
        <View style={[styles.circleContainer, styles.aiCircle]}>
          <Icon name="robot-outline" size={29} color="#2C3E50" />
        </View>
        <Text style={styles.iconText}>AI Assistant</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    backgroundColor: 'transparent',
  },
  svg: {
    position: 'absolute',
    top: -2, 
  },
  iconButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100, // Fixed width for easier centering
  },
  leftIcon: {
    left: '10%',
    top: 5,
  },
  rightIcon: {
    right: '10%',
    top: 5,
  },
  circleContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F9F9F9', 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, 
  },
  aiCircle: {
    backgroundColor: '#F0F4F8',
  },
  iconText: {
    fontSize: 13,
    marginTop: 6,
    color: '#4A4A4A',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default CustomCurvedTabBar;