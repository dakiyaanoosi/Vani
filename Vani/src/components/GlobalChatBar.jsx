import { Keyboard, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNetwork } from '../context/NetworkContext';
import {
  startSTTRecording,
  stopSTTRecordingAndTranscribe,
} from '../services/sttLeopard';

import { Alert, Linking } from 'react-native';
import { requestMicPermission } from '../services/permissions';

const GlobalChatBar = ({ onSend, disableSOS = false }) => {
  const { isOnline } = useNetwork();

  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardOffset(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
      inputRef.current?.blur();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (text.trim().length > 0 && isListening && !isProcessing) {
      setIsListening(false);
    }
  }, [text, isListening, isProcessing]);

  if (!isOnline) {
    return (
      <View
        style={[
          styles.container,
          { bottom: keyboardOffset > 0 ? keyboardOffset : 0 },
        ]}
      >
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.sosButton, disableSOS]}
            onPress={() => !disableSOS && onSend?.('__SOS__')}
            activeOpacity={disableSOS ? 1 : 0.7}
          >
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>

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
    inputRef.current?.blur();
  };

  const micDisabled = text.trim().length > 0 || isProcessing;

  return (
    <View
      style={[
        styles.container,
        { bottom: keyboardOffset > 0 ? keyboardOffset : 0 },
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => onSend?.('__SOS__')}
        >
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        <View style={styles.voiceInput}>
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            placeholder={
              isProcessing
                ? 'Processing...'
                : isListening
                ? 'Listening...'
                : 'Ask Vani'
            }
            editable={!isListening && !isProcessing}
            placeholderTextColor="#888"
            style={styles.input}
            multiline
          />

          <TouchableOpacity
            style={[styles.iconHitSlop, micDisabled && { opacity: 0.3 }]}
            disabled={micDisabled}
            onPress={async () => {
              if (!isListening) {
                const allowed = await requestMicPermission();

                if (!allowed) {
                  Alert.alert(
                    'Microphone Permission Required',
                    'Microphone access is required to understand your voice.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Go to Settings',
                        onPress: () => Linking.openSettings(),
                      },
                    ],
                  );
                  return;
                }

                setIsListening(true);
                setIsProcessing(false);

                try {
                  await startSTTRecording();
                } catch (e) {
                  console.log('STT start error:', e);
                  setIsListening(false);
                }
              } else {
                setIsListening(false);
                setIsProcessing(true);

                try {
                  const transcript = await stopSTTRecordingAndTranscribe();
                  setText(transcript);
                } catch (e) {
                  console.log('STT error:', e);
                } finally {
                  setIsProcessing(false);
                }
              }
            }}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon
                name={isListening ? 'stop' : 'mic'}
                size={20}
                color={isListening ? '#ff4d4d' : '#fff'}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim()}
            style={[styles.iconHitSlop, { opacity: text.trim() ? 1 : 0.4 }]}
          >
            <Icon name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GlobalChatBar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 55,
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
    borderWidth: 1,
    borderColor: '#aaa',
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
    borderWidth: 1,
    borderColor: '#aaa',
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

  iconHitSlop: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
