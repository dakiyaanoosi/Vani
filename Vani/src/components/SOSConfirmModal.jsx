import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const DURATION = 3; // 4 seconds

const SOSConfirmModal = ({ visible, onCancel, onConfirm }) => {
  const [count, setCount] = useState(DURATION);

  useEffect(() => {
    if (!visible) return;

    setCount(DURATION);

    const timer = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          clearInterval(timer);
          active = false;

          // 🔑 defer parent update to next tick
          setTimeout(() => {
            onConfirm();
          }, 0);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Text style={styles.title}>Sending SOS Alert in</Text>
        <Text style={styles.count}>{count}</Text>

        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SOSConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
  },
  count: {
    color: 'red',
    fontSize: 96,
    fontWeight: '700',
    marginBottom: 40,
  },
  cancelBtn: {
    width: '70%',
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: '#444',
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
