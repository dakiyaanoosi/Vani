import AsyncStorage from '@react-native-async-storage/async-storage';

const AI_KEY = 'SAVED_AI_EMERGENCIES';

export const loadSavedAI = async () => {
  const data = await AsyncStorage.getItem(AI_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAIResponse = async aiResponse => {
  const existing = await loadSavedAI();

  const updated = [...existing, aiResponse];
  await AsyncStorage.setItem(AI_KEY, JSON.stringify(updated));
};

export const isAISaved = async id => {
  const existing = await loadSavedAI();
  return existing.some(item => item.id === id);
};

export const deleteSavedAI = async id => {
  const data = await AsyncStorage.getItem(AI_KEY);
  const list = data ? JSON.parse(data) : [];

  const updated = list.filter(item => item.id !== id);
  await AsyncStorage.setItem(AI_KEY, JSON.stringify(updated));
};
