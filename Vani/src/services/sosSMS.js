import { PermissionsAndroid, Platform } from 'react-native';
import SendSMS from 'react-native-sms';

export const sendSOSViaSMS = async (contacts, message, location) => {
  const numbers = contacts.map(c => c.phone);

  const mapsLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  const finalMessage = `${message}\n\nLocation:\n${mapsLink}`;

  return new Promise((resolve, reject) => {
    SendSMS.send(
      {
        body: finalMessage,
        recipients: numbers,
        successTypes: ['sent'],
      },
      (completed, cancelled, error) => {
        if (completed) resolve();
        else reject(error || 'SMS failed');
      },
    );
  });
};
