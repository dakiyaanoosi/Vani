import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import emergencies from '../data/Emergencies.json';
export default function EmergencyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={emergencies}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('EmergencyDetailScreen', { emergencyId: item.id })
            }
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: '#FDECEA'
    
  },
  
  icon: { fontSize: 28, marginRight: 14 },
  title: { fontSize: 18, fontWeight: '600' }
});