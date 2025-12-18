import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';


import emergencydetaileng from '../data/emergencydetaileng.json';
import emergencydetail from '../data/emergencydetail.json';
import emergencydetailbn from '../data/emergencydetailbn.json';

import NetworkStatus from '../hooks/NetworkStatus';
import LangSelectorModal from '../components/LangSelectorModal';

export default function EmergencyDetailScreen({ route }) {
  const isOnline = NetworkStatus();
  const { emergencyId } = route.params;

  const [language, setLanguage] = useState('en');
  const [modalVisible, setModalVisible] = useState(false);

  const emergencyDataMap = {
    en: emergencydetaileng,
    hi: emergencydetail,
    bn: emergencydetailbn,
  };

  const data = emergencyDataMap[language]?.[emergencyId];

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>Emergency data unavailable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{data.title}</Text>

          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.langBtnText}>
              🌐 LANG: {language.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.audioBadge}>
          <Text style={styles.audioText}>
            🔊 Audio guidance available offline
          </Text>
        </View>
        <View style={styles.illustrationContainer}>
          <Text style={styles.placeholderText}>
            Visual Guide for {data.title}
          </Text>
        </View>
        <Text style={styles.sectionTitle}>What to do now</Text>
        {data.steps.map((step, index) => (
          <View key={index} style={[styles.stepCard, { borderLeftColor: '#23d24fff' }]}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
        <Text style={[styles.sectionTitle, { color: '#B71C1C' },]}>
          Red Flags
        </Text>

        <View
          style={[
            styles.stepCard,
            { borderLeftColor: '#B71C1C'},
          ]}
        >
          <View style={[styles.stepNumber, { backgroundColor: '#B71C1C' }]}>
            <Text style={styles.stepNumberText}>!</Text>
          </View>

          <View style={{ flex: 1 }}>
            {data.redFlags.map((flag, i) => (
              <Text key={i} style={styles.redFlagText}>
                • {flag}
              </Text>
            ))}
          </View>
        </View>
        <Text style={[styles.sectionTitle, { color: '#D84315' }]}>
          Do Not
        </Text>

        <View
          style={[
            styles.stepCard,
            { borderLeftColor: '#cf501aff'},
          ]}
        >
          <View style={[styles.stepNumber, { backgroundColor: '#cf501aff' }]}>
            <Text style={styles.stepNumberText}>✕</Text>
          </View>

          <View style={{ flex: 1 }}>
            {data.doNot.map((item, i) => (
              <Text key={i} style={styles.doNotText}>
                • {item}
              </Text>
            ))}
          </View>
        </View>

      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#B71C1C' }]}
          onPress={() => Linking.openURL('tel:108')}
        >
          <Text style={styles.actionBtnText}>📞 Call 108</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#2a84deff' }]}
          onPress={() => {
            if (isOnline) {
              Linking.openURL('http://maps.google.com/maps?q=hospital');
            } else {
              alert('Offline: Call 108 for assistance');
            }
          }}
        >
          <Text style={styles.actionBtnText}>🏥 Find Hospital</Text>
        </TouchableOpacity>
      </View>
      <LangSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentLanguage={language}
        onSelectLanguage={setLanguage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdeee976' },
  content: { padding: 20, paddingBottom: 120 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },

  title: { fontSize: 30, letterSpacing: 1, fontWeight: '800', color: '#000' },

  langBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ebe9e9ff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },

  langBtnText: { fontSize: 14, fontWeight: '700' },

  audioBadge: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginVertical: 10,
    borderColor: '#d9e0e9ff',
    borderWidth: 2,
  },

  audioText: { color: '#1976D2', fontSize: 13, fontWeight: 'bold' },

  illustrationContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    height: 200,
    marginVertical: 15,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },

  placeholderText: { fontStyle: 'italic', color: '#888' },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#24b448ff',
    marginVertical: 15,
  },

  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    borderLeftWidth: 11,
  },

  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#24b448ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  stepNumberText: { color: '#FFF', fontWeight: 'bold' },

  stepText: {
    flex: 1,
    fontSize: 17,
    color: '#11782bff',
    fontWeight: '600',
    lineHeight: 22,
  },

  redFlagText: {
    color: '#B71C1C',
       fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },

  doNotText: {
    color: '#cf501aff',
    fontWeight: '600',
       fontSize: 17,
    marginBottom: 4,
  },

  actionBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#EEE',
    gap: 10,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },

  actionBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});