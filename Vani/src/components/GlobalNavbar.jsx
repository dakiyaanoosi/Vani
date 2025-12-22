import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'bn', label: 'বাংলা' },
];

const GlobalNavbar = ({ onMenuPress }) => {
  const { language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const selectLanguage = lang => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconHitSlop}>
          <Icon name="bars" size={18} color="#fff" />
        </TouchableOpacity>

        <Image
          source={require('../assets/images/vani_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.iconHitSlop}
          onPress={() => setShowLangMenu(true)}
        >
          <Icon name="language" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showLangMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLangMenu(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLangMenu(false)}
        >
          <View style={styles.langMenu}>
            {LANGUAGES.map(item => (
              <TouchableOpacity
                key={item.code}
                style={styles.langItem}
                onPress={() => selectLanguage(item.code)}
              >
                <Text style={styles.langItemText}>{item.label}</Text>
                {language === item.code && (
                  <Icon name="check" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default GlobalNavbar;

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: '#220000bb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: '9%',
    borderBottomWidth: 1,
    borderBottomColor: '#330000',
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingRight: 16,
  },

  langMenu: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 8,
    width: 160,
  },

  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  langItemText: {
    color: '#fff',
    fontSize: 14,
  },

  iconHitSlop: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    height: 24,
    width: 90,
  },
});
