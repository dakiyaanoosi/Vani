import { Linking, Platform } from 'react-native';

export const makeEmergencyCall = async phoneNumber => {
  const url =
    Platform.OS === 'android'
      ? `tel:${phoneNumber}`
      : `telprompt:${phoneNumber}`;

  await Linking.openURL(url);
};
