import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    PermissionsAndroid,
    Alert,
    Linking,
    Vibration,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const EMERGENCY_CONTACT = '+91XXXXXXXXXX';

export default function SOSButton() {
    const [showConfirm, setShowConfirm] = useState(false);
    const countdownRef = useRef(null);

    const requestPermissions = async () => {
        try {
            const permissions = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                PermissionsAndroid.PERMISSIONS.SEND_SMS,
            ]);
            return Object.values(permissions).every(
                p => p === PermissionsAndroid.RESULTS.GRANTED
            );
        } catch {
            return false;
        }
    };

    const startSOS = async () => {
        const granted = await requestPermissions();
        if (!granted) {
            Alert.alert(
                'Permission required',
                'SOS needs location, call and SMS permissions.'
            );
            return;
        }

        setShowConfirm(true);

        countdownRef.current = setTimeout(() => {
            setShowConfirm(false);
            triggerSOS();
        }, 3000);
    };

    const cancelSOS = () => {
        clearTimeout(countdownRef.current);
        setShowConfirm(false);
    };

    const triggerSOS = () => {
        Vibration.vibrate([0, 500, 200, 500]);

        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
                const message = `🚨 EMERGENCY 🚨
I need immediate help.
Location:
${mapUrl}`;

                // Call emergency number
                Linking.openURL('tel:112');

                // Send SMS after call
                setTimeout(() => {
                    Linking.openURL(
                        `sms:${EMERGENCY_CONTACT}?body=${encodeURIComponent(message)}`
                    );
                }, 3000);
            },
            () => {
                Alert.alert('Location error', 'Calling emergency services.');
                Linking.openURL('tel:112');
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    };

    return (
        <>
            <View style={styles.buttonWrapper}>
                <View style={styles.backgroundCircleExtra} />
                <View style={styles.backgroundCircleOuter} />
                <View style={styles.backgroundCircleInner} />

                <TouchableOpacity
                    style={styles.sosButton}
                    activeOpacity={0.8}
                    onLongPress={startSOS}
                    delayLongPress={2000}
                    accessibilityLabel="Emergency SOS Button"
                >
                    <Text style={styles.sosText}>SOS</Text>
                    <Text style={styles.subText}>PRESS & HOLD
</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showConfirm} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Emergency SOS</Text>
                        <Text style={styles.modalText}>
                            SOS will trigger in 3 seconds
                        </Text>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={cancelSOS}
                        >
                            <Text style={styles.cancelText}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    buttonWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    backgroundCircleInner: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#E53935',
        opacity: 0.3,
    },
    backgroundCircleOuter: {
        position: 'absolute',
        width: 340,
        height: 340,
        borderRadius: 170,
        backgroundColor: '#E53935',
        opacity: 0.15,
    },
    backgroundCircleExtra: {
        position: 'absolute',
        width: 380,
        height: 380,
        borderRadius: 190,
        backgroundColor: '#E53935',
        opacity: 0.08,
    },
    sosButton: {
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: '#E53935',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 15,
        zIndex: 1,
    },
    sosText: {
        color: '#fff',
        fontSize: 68,
        fontWeight: 'bold',
    },
    subText: {
        color: '#fff',
        fontSize: 20,
        marginTop: 2,
    },
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 16,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E53935',
    },
    modalText: {
        marginVertical: 12,
        fontSize: 14,
        textAlign: 'center',
    },
    cancelBtn: {
        backgroundColor: '#E53935',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    cancelText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
