import { Keyboard, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNetwork } from '../context/NetworkContext';

const GlobalChatBar = ({ onSend, disableSOS = false }) => {
  const { isOnline } = useNetwork();
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardOffset(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (!isOnline) {
    return (
      <View
        style={[
          styles.container,
          { bottom: keyboardOffset > 0 ? keyboardOffset : 0 },
        ]}
      >
        <View style={styles.row}>
          {/* SOS BUTTON */}
          <TouchableOpacity
            style={[styles.sosButton, disableSOS && styles.sosButtonDisabled]}
            onPress={() => !disableSOS && onSend?.('__SOS__')}
            activeOpacity={disableSOS ? 1 : 0.7}
          >
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>

          {/* OFFLINE ALERT */}
          <View style={styles.offlineAlert}>
            <Text style={styles.offlineText}>
              Offline emergency help is available.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText('');
  };

  return (
    <View
      style={[
        styles.container,
        {
          bottom: keyboardOffset > 0 ? keyboardOffset : 0,
        },
      ]}
    >
      <View style={styles.row}>
        {/* SOS BUTTON */}
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => onSend?.('__SOS__')}
        >
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        {/* CHAT INPUT */}
        <View style={styles.voiceInput}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={isListening ? 'Listening…' : 'Ask Vani'}
            placeholderTextColor="#888"
            style={styles.input}
            multiline
          />

          <TouchableOpacity
            style={styles.iconHitSlop}
            onPress={() => setIsListening(p => !p)}
          >
            <Icon
              name={isListening ? 'stop' : 'microphone'}
              size={18}
              color={isListening ? '#ff4d4d' : '#fff'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim()}
            style={[styles.iconHitSlop, { opacity: text.trim() ? 1 : 0.4 }]}
          >
            <Icon name="paper-plane" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GlobalChatBar;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  // container: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   padding: 16,
  //   paddingBottom: 55,
  //   backgroundColor: '#000',
  // },

  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 55, // 👈 fixed safe value
    backgroundColor: '#000',
  },

  voiceInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 30,
    paddingHorizontal: 14,
    gap: 4,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#222',
  },

  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    marginRight: 12,
    maxHeight: 80,
  },

  offlineAlert: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: '#333',
  },

  offlineText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sosButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: 'red',
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sosText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
  },

  sosButtonDisabled: {
    opacity: 0.4,
  },

  iconHitSlop: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
