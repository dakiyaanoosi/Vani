import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNetwork } from '../context/NetworkContext';

const GlobalChatBar = ({ onSend }) => {
  const { isOnline } = useNetwork();
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');

  if (!isOnline) {
    return (
      <View style={styles.container}>
        <View style={styles.offlineAlert}>
          <Text style={styles.offlineText}>
            You’re offline. Offline emergency help is available.
          </Text>
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
    <View style={styles.container}>
      <View style={styles.voiceInput}>
        {/* TEXT INPUT (replaces static placeholder) */}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={isListening ? 'Listening…' : 'Ask Vani'}
          placeholderTextColor="#888"
          style={styles.input}
          multiline
        />

        {/* MIC BUTTON */}
        <TouchableOpacity onPress={() => setIsListening(p => !p)}>
          <Icon
            name={isListening ? 'stop' : 'microphone'}
            size={18}
            color={isListening ? '#ff4d4d' : '#fff'}
          />
        </TouchableOpacity>

        {/* SEND BUTTON */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={!text.trim()}
          style={{ marginLeft: 14, opacity: text.trim() ? 1 : 0.4 }}
        >
          <Icon name="paper-plane" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GlobalChatBar;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#000',
  },

  voiceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#222',
    marginBottom: '2%',
  },

  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    marginRight: 12,
    maxHeight: 80,
  },

  offlineAlert: {
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
});
