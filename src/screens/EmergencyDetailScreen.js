import { View, Text, Linking, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import emergencydetaileng from '../data/emergencydetaileng.json';
import NetworkStatus from '../hooks/NetworkStatus';
import emergencydetail from '../data/emergencydetail.json';
import LangSelectorModal from '../components/LangSelectorModal';



export default function EmergencyDetailScreen({ route }) {
  const isOnline = NetworkStatus();
  const { emergencyId } = route.params;
  const [language, setLanguage] = useState('en');
  const [modalVisible, setModalVisible] = useState(false);

  const emergencyDataMap = {
    en: emergencydetaileng,
    hi: emergencydetail,
    bn: emergencydetail
  };
  const data = emergencyDataMap[language][emergencyId];

  /*const data = emergencydetaileng[emergencyId]; */

  if (!data) {         /* handles case when data is missing or json file is corrupted (exceptional) */

    return (
      <View style={styles.container}>
        <Text>Emergency data unavailable. Please seek immediate help.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.audioBox}>
          <Text style={styles.audioText}>
            🔊 Audio guidance playing (offline)
          </Text>
        </View>
         {/*  Language Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Change language"
        style={{ alignSelf: 'flex-end', marginBottom: 10 }}
      >
        <Text style={{ fontSize: 14 }}>
          🌐 Language: {language.toUpperCase()}
        </Text>   
      </TouchableOpacity> 

      <LangSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentLanguage={language}
        onSelectLanguage={setLanguage}
      />



        <Text style={styles.sectionTitle}>What to do now</Text>
        {data.steps.map((step, index) => (
          <Text key={index} style={styles.step}>
            {index + 1}. {step}
          </Text>
        ))}

        <Text style={[styles.sectionTitle, { color: '#B71C1C' }]}>
          Red Flags
        </Text>
        {data.redFlags.map((flag, index) => (
          <Text key={index} style={styles.redFlag}>
            ❗ {flag}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Do NOT</Text>
        {data.doNot.map((item, index) => (
          <Text key={index} style={styles.doNot}>
            ✖ {item}
          </Text>
        ))}

      </ScrollView>

      <View style={styles.actionBar}>

        <TouchableOpacity onPress={() => Linking.openURL('tel:108')}
          accessibilityLabel="Call ambulance number 108" /* accessibility for screen readers */
          accessibilityRole="button"
          >
          <Text style={styles.action}>📞 Call 108</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          if (isOnline) {
            Linking.openURL('https://www.google.com/maps/search/hospitals+near+me');
          } else {
            alert('Offline numbers:\n108 – Ambulance\n112 – Emergency');
          }
        }}>
          <Text style={styles.action}>🏥 Find Hospital</Text>
        </TouchableOpacity>

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