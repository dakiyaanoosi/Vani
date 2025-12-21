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
import Icon from 'react-native-vector-icons/Feather';

const MAX = 3;
const isValidPhone = phone => /^[0-9]{7,15}$/.test(phone);

const SOSContactsModal = ({ visible, onClose, contacts, onSave }) => {
  const [local, setLocal] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLocal(contacts);
    setSubmitted(false);
  }, [contacts, visible]);

  const addContact = () => {
    if (local.length >= MAX) return;
    setLocal([...local, { name: '', phone: '' }]);
  };

  const update = (index, key, value) => {
    const copy = [...local];
    copy[index][key] = value;
    setLocal(copy);
  };

  const remove = index => {
    const copy = [...local];
    copy.splice(index, 1);
    setLocal(copy);
  };

  const hasErrors = () =>
    local.some(
      c =>
        c.name.trim() === '' || c.phone.trim() === '' || !isValidPhone(c.phone),
    );

  const handleSave = () => {
    setSubmitted(true);
    if (hasErrors()) return;

    onSave(local);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>Emergency Contacts</Text>
            {local.length < MAX && (
              <TouchableOpacity style={styles.title} onPress={addContact}>
                <Icon name="user-plus" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {local.map((c, i) => {
            const showNameError = submitted && c.name.trim() === '';
            const showPhoneError =
              submitted && (c.phone.trim() === '' || !isValidPhone(c.phone));

            return (
              <View key={i} style={styles.contactBlock}>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Name"
                      placeholderTextColor="#666"
                      style={styles.input}
                      value={c.name}
                      onChangeText={v => update(i, 'name', v)}
                    />

                    {showNameError && (
                      <Text style={styles.error}>Name is required</Text>
                    )}

                    <TextInput
                      placeholder="Phone"
                      placeholderTextColor="#666"
                      style={[styles.input, styles.phoneInput]}
                      keyboardType="number-pad"
                      value={c.phone}
                      onChangeText={v =>
                        update(i, 'phone', v.replace(/[^0-9]/g, ''))
                      }
                      maxLength={15}
                    />

                    {showPhoneError && (
                      <Text style={styles.error}>
                        Enter a valid phone number
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => remove(i)}
                    activeOpacity={0.6}
                  >
                    <Icon name="trash" size={16} color="#ff4d4d" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <TouchableOpacity style={styles.save} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SOSContactsModal;

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
    marginBottom: 12,
  },
  contactBlock: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#222',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    backgroundColor: '#000',
  },
  phoneInput: {
    marginTop: 8,
  },
  deleteBtn: {
    marginLeft: 10,
    padding: 8,
  },
  error: {
    color: '#ff4d4d',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  add: {
    color: '#fff',
    marginBottom: 14,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
