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
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const { language } = useLanguage();
  const navigation = useNavigation();

  const emergencies = getAllEmergencies(language);

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
              })
            }
          >
            <Text style={styles.cardText}>{item.title}</Text>
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
  },
});
