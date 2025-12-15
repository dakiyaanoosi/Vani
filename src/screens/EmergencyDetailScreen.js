import { View, Text, StyleSheet, ScrollView } from 'react-native';
import emergencydetail from '../data/emergencydetail.json';

export default function EmergencyDetailScreen({ route }) {
  const { emergencyId } = route.params;
  const data = emergencydetail[emergencyId];

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>Emergency data not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* TITLE */}
        <Text style={styles.title}>{data.title}</Text>

        {/* AUDIO (STUB) */}
        <View style={styles.audioBox}>
          <Text style={styles.audioText}>
            🔊 Audio guidance playing (offline)
          </Text>
        </View>

        {/* STEPS */}
        <Text style={styles.sectionTitle}>What to do now</Text>
        {data.steps.map((step, index) => (
          <Text key={index} style={styles.step}>
            {index + 1}. {step}
          </Text>
        ))}

        {/* RED FLAGS */}
        <Text style={[styles.sectionTitle, { color: '#B71C1C' }]}>
          Red Flags
        </Text>
        {data.redFlags.map((flag, index) => (
          <Text key={index} style={styles.redFlag}>
            ❗ {flag}
          </Text>
        ))}

        {/* DO NOT */}
        <Text style={styles.sectionTitle}>Do NOT</Text>
        {data.doNot.map((item, index) => (
          <Text key={index} style={styles.doNot}>
            ✖ {item}
          </Text>
        ))}

      </ScrollView>

      {/* ACTION BAR */}
      <View style={styles.actionBar}>
        <Text style={styles.action}>📞 Call 108</Text>
        <Text style={styles.action}>🏥 Find Hospital</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 20, paddingBottom: 100 },

  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 16,
    color: '#B71C1C'
  },

  audioBox: {
    backgroundColor: '#FFF3E0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20
  },
  audioText: { fontWeight: '600' },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10
  },

  step: { fontSize: 16, marginBottom: 8 },
  redFlag: { color: '#B71C1C', marginBottom: 6 },
  doNot: { color: '#444', marginBottom: 6 },

  actionBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 16,
    backgroundColor: '#FDECEA'
  },
  action: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B71C1C'
  }
});