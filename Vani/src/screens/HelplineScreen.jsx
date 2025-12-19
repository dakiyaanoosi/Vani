import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { HELPLINES } from '../data/helplines';
import {
  requestCallPermission,
  openCallPermissionSettings,
} from '../services/callPermission';
import { makeEmergencyCall } from '../services/callService';

const HelplineScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconHit}
        >
          <Icon name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
        <View style={{ width: 18 }} />
      </View>

      {/* List */}
      <FlatList
        data={HELPLINES}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>{item.label}</Text>

            <View style={styles.divider} />

            <Text style={styles.number}>{item.number}</Text>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.callBtn, styles.iconHitSlop]}
              onPress={async () => {
                const granted = await requestCallPermission();

                if (!granted) {
                  openCallPermissionSettings();
                  return;
                }

                await makeEmergencyCall(item.number);
              }}
            >
              <Icon name="phone" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default HelplineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  iconHit: {
    padding: 12,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  label: {
    flex: 1.2,
    color: '#fff',
    fontSize: 15,
  },

  number: {
    flex: 0.8,
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#333',
    marginHorizontal: 12,
  },

  callBtn: {
    padding: 10,
    borderRadius: 20,
  },

  iconHitSlop: {
    width: 35,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
