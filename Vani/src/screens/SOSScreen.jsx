import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  Pressable,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome';

import SOSButton from '../components/SOSButton';
import SOSConfirmModal from '../components/SOSConfirmModal';
import SOSContactsModal from '../components/SOSContactsModal';
import SOSMessageModal from '../components/SOSMessageModal';

import { getCurrentLocation } from '../services/locationService';
import { sendSOSViaSMS } from '../services/sosSMS';

import {
  loadContacts,
  saveContacts,
  loadMessage,
  saveMessage,
} from '../services/sosStorage';

const SOSScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');
  const [sosStatus, setSOSStatus] = useState('idle');

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [contactsVisible, setContactsVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    (async () => {
      setContacts(await loadContacts());
      setMessage(await loadMessage());
    })();
  }, []);

  const handlePressIn = () => {
    if (sosStatus !== 'idle') return;

    if (contacts.length === 0) {
      Alert.alert('Add emergency contacts first');
      return;
    }
    setConfirmVisible(true);
  };

  const handleConfirm = async () => {
    setConfirmVisible(false);
    setSOSStatus('preparing');

    try {
      const location = await getCurrentLocation();
      setSOSStatus('sending');

      await sendSOSViaSMS(contacts, message, location);

      setSOSStatus('sent');
      Alert.alert('SOS Sent', 'Your emergency message has been sent.');

      setTimeout(() => {
        setSOSStatus('idle');
      }, 3000);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to send SOS.');
      setSOSStatus('idle');
    }
  };

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconHitSlop}
            onPress={() => navigation.goBack()}
          >
            <Icon2 name="keyboard-backspace" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconHitSlop}
              onPress={() => setContactsVisible(true)}
            >
              <Icon name="user-plus" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconHitSlop}
              onPress={() => setMessageVisible(true)}
            >
              <Icon name="edit" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Helplines')}
              style={styles.iconHitSlop}
            >
              <Icon name="phone" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconHitSlop}
              onPress={() => {
                Linking.openURL(
                  'https://www.google.com/maps/search/?api=1&query=nearby+hospital',
                );
              }}
            >
              <Icon3 name="hospital-o" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.center}>
          <SOSButton onPress={handlePressIn} disabled={sosStatus !== 'idle'} />
          <Text style={styles.hint}>
            {sosStatus === 'idle' && 'Tap to send SOS'}
            {sosStatus === 'preparing' && 'Preparing emergency message…'}
            {sosStatus === 'sending' && 'Sending SOS…'}
            {sosStatus === 'sent' && 'SOS sent successfully'}
          </Text>
        </View>

        <SOSConfirmModal
          visible={confirmVisible}
          onCancel={() => setConfirmVisible(false)}
          onConfirm={handleConfirm}
        />

        <SOSContactsModal
          visible={contactsVisible}
          contacts={contacts}
          onClose={() => setContactsVisible(false)}
          onSave={async c => {
            setContacts(c);
            await saveContacts(c);
          }}
        />

        <SOSMessageModal
          visible={messageVisible}
          message={message}
          onClose={() => setMessageVisible(false)}
          onSave={async m => {
            setMessage(m);
            await saveMessage(m);
          }}
        />
      </View>
    </Pressable>
  );
};

export default SOSScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerIcons: { flexDirection: 'row', gap: 16 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '50%',
  },
  hint: { marginTop: 20, color: '#aaa' },
  iconHitSlop: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
