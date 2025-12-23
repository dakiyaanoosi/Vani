import { PermissionsAndroid, Platform } from 'react-native';

export const requestMicPermission = async () => {
  if (Platform.OS !== 'android') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: 'Microphone Permission',
      message: 'Vani needs microphone access to understand your voice.',
      buttonPositive: 'Allow',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const requestSMSPermission = async () => {
  if (Platform.OS !== 'android') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.SEND_SMS,
    {
      title: 'SMS Permission',
      message: 'Vani needs permission to send SOS messages.',
      buttonPositive: 'Allow',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

/* --------- CONTACTS (ONLY ADDITION) --------- */
export const requestContactsPermission = async () => {
  if (Platform.OS !== 'android') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    {
      title: 'Contacts Permission',
      message: 'Vani needs access to your contacts for SOS alerts.',
      buttonPositive: 'Allow',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};
