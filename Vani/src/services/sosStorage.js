import AsyncStorage from '@react-native-async-storage/async-storage';

const CONTACTS_KEY = 'SOS_CONTACTS';
const MESSAGE_KEY = 'SOS_MESSAGE';

export const loadContacts = async () => {
  const data = await AsyncStorage.getItem(CONTACTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveContacts = async contacts => {
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
};

export const loadMessage = async () => {
  const data = await AsyncStorage.getItem(MESSAGE_KEY);
  return data || 'I am in danger. Please help me immediately.';
};

export const saveMessage = async message => {
  await AsyncStorage.setItem(MESSAGE_KEY, message);
};
