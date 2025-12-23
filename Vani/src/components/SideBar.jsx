import React, { useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  Linking,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const SideBar = ({
  visible,
  onClose,
  onEditContacts,
  onEditMessage,
  navigation,
}) => {
  const slideX = useRef(new Animated.Value(-260)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideX, {
        toValue: -260,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX: slideX }] }]}
        >
          <Text style={styles.title}>Menu</Text>

          <TouchableOpacity style={styles.item} onPress={onEditContacts}>
            <Icon name="user-plus" size={18} color="#fff" />
            <Text style={styles.itemText}>Emergency Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={onEditMessage}>
            <Icon name="edit" size={18} color="#fff" />
            <Text style={styles.itemText}>SOS Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              onClose();
              navigation.navigate('Helplines');
            }}
          >
            <Icon name="phone" size={18} color="#fff" />
            <Text style={styles.itemText}>Helplines</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              onClose();
              Linking.openURL(
                'https://www.google.com/maps/search/?api=1&query=nearby+hospitals',
              );
            }}
          >
            <Icon name="external-link" size={18} color="#fff" />
            <Text style={styles.itemText}>Nearby Hospitals</Text>
          </TouchableOpacity>

          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.aboutItem}
              onPress={() => {
                onClose();
                navigation.navigate('AboutDevelopers');
              }}
            >
              <Icon name="info" size={16} color="#999" />
              <Text style={styles.aboutText}>About Developers</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default SideBar;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
  },

  drawer: {
    width: 260,
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 20,
    borderRightWidth: 1,
    borderRightColor: '#333',
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingLeft: '40%',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 14,
    gap: 14,
  },

  itemText: {
    color: '#fff',
    fontSize: 15,
  },

  /* ✅ NEW STYLES BELOW */
  bottomSection: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 8,
    paddingBottom: 10,
  },

  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },

  aboutText: {
    color: '#999',
    fontSize: 12,
  },
});