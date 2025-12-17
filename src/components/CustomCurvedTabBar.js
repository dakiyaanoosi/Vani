import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';

import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/AntDesign';

const { width } = Dimensions.get('window');

const TAB_BAR_HEIGHT = 80;

const CustomCurvedTabBar = ({ navigation }) => {

  const customPath = `
    M0,20
    C0,20 20,0 70,0
    L${width - 70},0
    C${width - 20},0 ${width},20 ${width},20
    L${width},${TAB_BAR_HEIGHT}
    L0,${TAB_BAR_HEIGHT}
    Z
  `;

  return (
    <View style={styles.container}>


      <Svg
        width={width}
        height={TAB_BAR_HEIGHT}
        style={styles.svg}
      >
        <Path d={customPath} fill="#fff" />
      </Svg>

      
      <TouchableOpacity
        style={[styles.iconButton, styles.leftIcon]}
        onPress={() => navigation.navigate('EmergencyScreen')}
        accessibilityRole="button"
        accessibilityLabel="Emergency Help"
      >
        <Icon name="medicine-box" size={30} color="#D32F2F" />
        <Text style={styles.iconText}>Help</Text>
      </TouchableOpacity>

      
      <TouchableOpacity
        style={[styles.iconButton, styles.rightIcon]}
        onPress={() => navigation.navigate('AISymptomsScreen')}
        accessibilityRole="button"
        accessibilityLabel="AI Assistance"
      >
        <Icon name="open-ai" size={30} color="#0D47A1" /> 
        <Text style={styles.iconText}>AI</Text>
      </TouchableOpacity>

    </View>
  );
};

export default CustomCurvedTabBar;

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
    top: 0,
  },
  iconButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    left: '18%',
    top: 15,
  },
  rightIcon: {
    right: '18%',
    top: 15,
  },
  iconText: {
    fontSize: 12,
    marginTop: 4,
    color: '#555',
  },
});
