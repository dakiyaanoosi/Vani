import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hinglish' },
  { code: 'bn', label: 'Bengali' }
];

export default function LanguageSelectorModal({
  visible,
  onClose,
  currentLanguage,
  onSelectLanguage
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Select Language</Text>

          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={styles.option}
              onPress={() => {
                onSelectLanguage(lang.code);
                onClose();
              }}
              accessibilityLabel={`Select ${lang.label} language`}
            >
              <Text
                style={[
                  styles.optionText,
                  currentLanguage === lang.code && styles.activeText
                ]}
              >
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  option: {
    paddingVertical: 12
  },
  optionText: {
    fontSize: 16
  },
  activeText: {
    fontWeight: 'bold'
  },
  cancel: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  cancelText: {
    color: '#d00',
    fontSize: 16
  }
});