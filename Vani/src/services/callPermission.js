import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';

export const requestCallPermission = async () => {
  if (Platform.OS !== 'android') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    {
      title: 'Call Permission Required',
      message: 'Vani needs permission to make emergency calls.',
      buttonPositive: 'Allow',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const openCallPermissionSettings = () => {
  Alert.alert(
    'Permission Required',
    'Please allow call permission from settings to use this feature.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Go to Settings',
        onPress: () => Linking.openSettings(),
      },
    ],
  );
};
