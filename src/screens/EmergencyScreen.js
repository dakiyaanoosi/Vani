import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Linking,
  Platform, // Added for device-specific map links
} from 'react-native';
import useSOS from '../hooks/useSOS';
import Icon from 'react-native-vector-icons/Feather';
import emergencies from '../data/Emergencies.json';

const { width } = Dimensions.get('window');

export default function EmergencyScreen({ navigation }) {
  const { startSOS, cancelSOS, showConfirm } = useSOS();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('First Aids');
  const [filteredCritical, setFilteredCritical] = useState([]);
  const [filteredCommon, setFilteredCommon] = useState([]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const crit = emergencies.filter(
      item => item.priority === 'critical' && item.title.toLowerCase().includes(query)
    );
    const comm = emergencies.filter(
      item => item.priority === 'common' && item.title.toLowerCase().includes(query)
    );
    setFilteredCritical(crit);
    setFilteredCommon(comm);
  }, [searchQuery]);


  const makeCall = (number) => Linking.openURL(`tel:${number}`);

  const openInMaps = (query) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });
    Linking.openURL(url);
  };

  const renderFirstAid = () => (
    <>
      {filteredCritical.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Critical Response</Text>
          </View>
          <FlatList
            horizontal
            data={filteredCritical}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.criticalCard}>
                <View style={styles.cardTop}>
                  <View style={styles.imgIcon}>
                    <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <TouchableOpacity
                  style={styles.detailsBtn}
                  onPress={() => navigation.navigate('EmergencyDetailScreen', { emergencyId: item.id })}
                >
                  <Text style={styles.detailsText}>Action Steps</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Common Injuries</Text>
      </View>
      <View style={styles.gridContainer}>
        {filteredCommon.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.gridCard}
            onPress={() => navigation.navigate('EmergencyDetailScreen', { emergencyId: item.id })}
          >
            <View style={styles.gridIconCircle}>
              <Text style={styles.gridEmoji}>{item.icon}</Text>
            </View>
            <Text style={styles.gridText} numberOfLines={1}>{item.title}</Text>
          </TouchableOpacity>
        ))}
        {filteredCommon.length === 0 && filteredCritical.length === 0 && (
          <Text style={styles.noResultText}>No emergencies found for "{searchQuery}"</Text>
        )}
      </View>
    </>
  );

  const renderAmbulance = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, {marginBottom: 15}]}>Emergency Services</Text>
      <TouchableOpacity style={styles.serviceCard} onPress={() => makeCall('108')}>
        <View style={styles.serviceIcon}><Icon name="phone-call" size={24} color="#FFF" /></View>
        <View>
          <Text style={styles.serviceName}>Public Ambulance</Text>
          <Text style={styles.serviceSub}>Universal Emergency Number</Text>
        </View>
        <Text style={styles.callText}>108</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHospitals = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, {marginBottom: 15}]}>Nearby Help</Text>
      
      <TouchableOpacity 
        style={styles.serviceCard} 
        onPress={() => openInMaps('hospitals')}
      >
        <View style={[styles.serviceIcon, { backgroundColor: '#3498db' }]}>
          <Icon name="map-pin" size={24} color="#FFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.serviceName}>Find Nearest Hospital</Text>
          <Text style={styles.serviceSub}>Locate based on current GPS</Text>
        </View>
        <Icon name="external-link" size={20} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, {marginBottom: 15}]}>Quick Navigation</Text>
      
      <TouchableOpacity 
        style={styles.serviceCard} 
        onPress={() => openInMaps('City General Hospital')}
      >
        <View style={[styles.serviceIcon, { backgroundColor: '#2ecc71' }]}>
          <Icon name="navigation" size={24} color="#FFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.serviceName}>City General Hospital</Text>
          <Text style={styles.serviceSub}>Standard Emergency Route</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome Back,</Text>
              <Text style={styles.userName}>Anxious...</Text>
            </View>
            <Image source={{ uri: 'https://i.pravatar.cc/130' }} style={styles.profilePic} />
          </View>

          <View style={styles.tabRow}>
            {['First Aids', 'Ambulance', 'Nearby Hospital'].map((tab) => (
              <TouchableOpacity 
                key={tab}
                style={activeTab === tab ? styles.activePill : styles.inactivePill}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={activeTab === tab ? styles.activePillText : styles.inactivePillText}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="rgba(255,255,255,0.7)" />
            <TextInput
              placeholder="Search (e.g. Burn, Snake...)"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="x" size={18} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {activeTab === 'First Aids' && renderFirstAid()}
        {activeTab === 'Ambulance' && renderAmbulance()}
        {activeTab === 'Nearby Hospital' && renderHospitals()}

        <View style={{ height: 120 }} />
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.alertBar, showConfirm && styles.alertBarActive]}
        onPress={() => showConfirm ? cancelSOS() : startSOS()}
      >
        <View style={[styles.alertCircle, showConfirm && { backgroundColor: '#FF4444' }]}>
          <Text style={{ color: showConfirm ? '#FFF' : '#E65C41', fontWeight: 'bold' }}>
            {showConfirm ? 'X' : 'SOS'}
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={[styles.alertText, showConfirm && { color: '#FFF' }]}>
            {showConfirm ? 'Starting in 3s...' : 'Emergency SOS'}
          </Text>
          <Text style={[styles.alertSubtext, showConfirm && { color: 'rgba(255,255,255,0.7)' }]}>
            {showConfirm ? 'Tap to Cancel' : 'Tap to send emergency alert!'}
          </Text>
        </View>
        {showConfirm && <Icon name="loader" size={20} color="#FFF" />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f45a3bff' },
  header: { padding: 20, paddingTop: 25 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { color: '#FFDAB9', fontSize: 18 },
  userName: { color: '#FFF', fontSize: 25, fontWeight: 'bold' },
  profilePic: { width: 45, height: 45, borderRadius: 12 },
  tabRow: { flexDirection: 'row', marginTop: 20, gap: 10 },
  activePill: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  activePillText: { color: '#E65C41', fontWeight: 'bold', fontSize: 15 },
  inactivePill: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  inactivePillText: { color: '#FFF', fontSize: 15 },
  searchBar: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 15, paddingHorizontal: 15, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  searchInput: { height: 45, color: '#FFF', marginLeft: 10, flex: 1 },
  sectionHeader: { paddingHorizontal: 20, marginVertical: 15 },
  sectionTitle: { color: '#FFF', fontSize: 23, fontWeight: 'bold' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  gridCard: { backgroundColor: 'rgba(255, 255, 255, 0.23)', width: '48%', marginBottom: 12, marginTop:2, padding: 12, borderRadius: 18, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.47)' },
  gridIconCircle: { width: 35, height: 35, backgroundColor: 'rgba(239, 237, 237, 0.2)', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: 'rgba(251, 245, 245, 0.52)' },
  gridEmoji: { fontSize: 18},
  gridText: { color: '#f2f0f0ff', fontWeight: '700', fontSize: 15, flex: 1 },
  criticalCard: { backgroundColor: '#ffffffe6', width: width * 0.55, marginRight: 15, borderRadius: 25, padding: 18, height: 160, justifyContent: 'space-between', elevation: 5 },
  cardTop: { gap: 8 },
  imgIcon: { width: 45, height: 45, backgroundColor: '#f8c0b2ff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderColor: '#f2a899ff', borderWidth: 1 },
  cardTitle: { fontWeight: 'bold', fontSize: 19, color: '#1c1c1cff' },
  detailsBtn: { alignSelf: 'flex-end', backgroundColor: '#F39C12', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  detailsText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  noResultText: { color: '#FFDAB9', textAlign: 'center', width: '100%', marginTop: 20, fontStyle: 'italic' },
  alertBar: { position: 'absolute', bottom: 34, left: 25, right: 18, backgroundColor: '#FFF', height: 75, borderRadius: 38, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, elevation: 10 },
  alertBarActive: { backgroundColor: '#222', borderColor: '#FF4444', borderWidth: 1 },
  alertCircle: { width: 55, height: 55, backgroundColor: '#FDECEA', borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  alertText: { color: '#E65C41', fontWeight: 'bold', fontSize: 16 },
  alertSubtext: { color: '#666', fontSize: 12 },
  tabContent: { paddingHorizontal: 20 },
  serviceCard: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  serviceIcon: { width: 50, height: 50, backgroundColor: '#e74c3c', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  serviceName: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  serviceSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  callText: { color: '#FFF', fontWeight: 'bold', fontSize: 18, marginLeft: 'auto' },
});