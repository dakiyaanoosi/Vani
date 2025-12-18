import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { useLanguage } from '../context/LanguageContext';
import { getAllEmergencies } from '../services/offlineDB';

const HomeScreen = () => {
  const { language } = useLanguage();
  const navigation = useNavigation();

  const emergencies = getAllEmergencies(language);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>How can I help?</Text>

      {/* SAME UI FOR ONLINE & OFFLINE */}
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
              })
            }
          >
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;

/* ================= STYLES ================= */

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
    paddingBottom: 120, // space for global chat / offline alert bar
  },

  card: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  cardText: {
    color: '#fff',
    fontSize: 16,
  },
});
