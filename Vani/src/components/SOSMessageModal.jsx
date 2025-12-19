import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';

const DEFAULT_MESSAGE = 'I am in danger. Please help me immediately.';
const LIMIT = 200;

const SOSMessageModal = ({ visible, onClose, message, onSave }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(message || DEFAULT_MESSAGE);
  }, [message]);

  const handleSave = () => {
    const finalMessage =
      text.trim().length === 0 ? DEFAULT_MESSAGE : text.trim();

    onSave(finalMessage);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.box}>
          <Text style={styles.title}>SOS Message</Text>

          <TextInput
            value={text}
            onChangeText={setText}
            maxLength={LIMIT}
            multiline
            textAlignVertical="top"
            placeholder={DEFAULT_MESSAGE}
            placeholderTextColor="#666"
            style={styles.input}
          />

          <Text style={styles.count}>
            {text.length}/{LIMIT}
          </Text>

          <TouchableOpacity style={styles.save} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SOSMessageModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '92%',
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    minHeight: 120,
    borderWidth: 1.5,
    borderColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    backgroundColor: '#000',
  },
  count: {
    color: '#888',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 12,
    textAlign: 'right',
  },
  save: {
    borderWidth: 0.5,
    borderColor: '#fff',
    borderRadius: 30,
    paddingVertical: 12,
    backgroundColor: '#000',
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
});
