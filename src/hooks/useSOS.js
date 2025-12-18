import { useRef, useState } from 'react';
import {
  PermissionsAndroid,
  Alert,
  Linking,
  Vibration,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const EMERGENCY_CONTACT = '+91XXXXXXXXXX';

export default function useSOS() {
  const [showConfirm, setShowConfirm] = useState(false);
  const countdownRef = useRef(null);

  const requestPermissions = async () => {
    try {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      ]);

      return Object.values(permissions).every(
        p => p === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch {
      return false;
    }
  };

  const triggerSOS = () => {
    Vibration.vibrate([0, 500, 200, 500]);

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        const message = `🚨 EMERGENCY 🚨
I need immediate help.
Location:
${mapUrl}`;

        Linking.openURL('tel:112');

        setTimeout(() => {
          Linking.openURL(
            `sms:${EMERGENCY_CONTACT}?body=${encodeURIComponent(message)}`
          );
        }, 3000);
      },
      () => {
        Alert.alert('Location error', 'Calling emergency services.');
        Linking.openURL('tel:112');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const startSOS = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert(
        'Permission required',
        'SOS needs location, call and SMS permissions.'
      );
      return;
    }

    setShowConfirm(true);
    countdownRef.current = setTimeout(() => {
      setShowConfirm(false);
      triggerSOS();
    }, 3000);
  };

  const cancelSOS = () => {
    clearTimeout(countdownRef.current);
    setShowConfirm(false);
  };

  return {
    startSOS,   
    showConfirm,
    cancelSOS,
  };
}