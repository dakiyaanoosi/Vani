import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getAllEmergencies } from '../services/offlineDB';
import Icon from 'react-native-vector-icons/Ionicons';
import { loadSavedAI } from '../services/aiStorage';

const HomeScreen = () => {
  const { language } = useLanguage();
  const navigation = useNavigation();
  const [aiEmergencies, setAiEmergencies] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      (async () => {
        const ai = await loadSavedAI();
        if (active) setAiEmergencies(ai);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const systemEmergencies = getAllEmergencies(language);
  const emergencies = [...systemEmergencies, ...aiEmergencies];

  const getTitle = item => {
    if (item.type === 'ai' && item.titles) {
      return item.titles[language] || item.titles['en'] || 'Saved Guide';
    }
    return item.title;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>How can I help?</Text>

      <FlatList
        data={emergencies}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('EmergencyFlow', {
                emergencyId: item.id,
                source: item.type || 'system',
              })
            }
          >
            <Text style={styles.cardText}>
              {getTitle(item)}
              {item.type === 'ai' ? (
                <Text style={{ fontWeight: 800 }}>
                  <Text style={{ color: '#777' }}>&nbsp; ● </Text>
                  <Text style={{ color: '#777' }}>AI</Text>
                </Text>
              ) : (
                ''
              )}
            </Text>

            <Icon name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    paddingBottom: 120,
  },
  card: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
});
