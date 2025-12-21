import { NativeModules } from 'react-native';

const { SendSms } = NativeModules;

export const sendSOSViaSMS = async (contacts, message, location) => {
  const mapsLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  const finalMessage = `${message}\n\nLocation:\n${mapsLink}`;

  for (const c of contacts) {
    await SendSms.sendSms(c.phone, finalMessage);
  }
};
