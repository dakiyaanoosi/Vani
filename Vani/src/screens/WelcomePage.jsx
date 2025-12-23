import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Image,
  Easing,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import {
  ChevronLeft,
  PhoneCall,
  HeartPulse,
  Users,
  UserPlus,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import logo from '../assets/images/logo.jpg';
import SOSContactsModal from '../components/SOSContactsModal';
import { saveContacts } from '../services/sosStorage';

const { width } = Dimensions.get('window');

export default function WelcomeFlow({ navigation }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const pagerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const finished = await AsyncStorage.getItem('HAS_FINISHED_ONBOARDING');

        if (finished === 'true') {
          navigation.replace('Home');
          return;
        }

        const lastPage = await AsyncStorage.getItem('ONBOARDING_LAST_PAGE');
        setIsLoading(false);

        if (lastPage !== null) {
          requestAnimationFrame(() => {
            pagerRef.current?.setPage(Number(lastPage));
          });
        }
      } catch (e) {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const ringScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  const ringOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.3, 0],
  });

  const handleNext = () => {
    if (currentPage < 5) {
      pagerRef.current?.setPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      pagerRef.current?.setPage(currentPage - 1);
    }
  };

  const handleSkipToContacts = async () => {
    try {
      await AsyncStorage.setItem('HAS_FINISHED_ONBOARDING', 'true');
      pagerRef.current?.setPage(5);
    } catch (e) {
      pagerRef.current?.setPage(5);
    }
  };

  const finalizeOnboarding = async (contacts = null) => {
    try {
      if (contacts) {
        await saveContacts(contacts);
        await AsyncStorage.setItem('HAS_ADDED_CONTACTS', 'true');
      }

      await AsyncStorage.setItem('HAS_FINISHED_ONBOARDING', 'true');
      await AsyncStorage.removeItem('ONBOARDING_LAST_PAGE');

      navigation.replace('Home');
    } catch {
      navigation.replace('Home');
    }
  };

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerNav}>
        <View style={styles.navSide}>
          {currentPage > 0 && currentPage < 5 && (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButtonCircle}
            >
              <ChevronLeft color="#FFF" size={16} strokeWidth={3} />
            </TouchableOpacity>
          )}
        </View>

        {currentPage < 5 && (
          <TouchableOpacity onPress={handleSkipToContacts}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <PagerView
        style={styles.pagerView}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={e => {
          const pos = e.nativeEvent.position;
          setCurrentPage(pos);
          if (pos === 5) {
            AsyncStorage.setItem('HAS_FINISHED_ONBOARDING', 'true');
          }
        }}
      >
        {/* Slide 1 */}
        <View key="1" style={styles.slide}>
          <Image source={logo} style={styles.logoImage} resizeMode="contain" />
          <View style={styles.textContainer}>
            <Text style={styles.headline}>Welcome to VANI</Text>
            <Text style={styles.tagline}>Smart help, when seconds count.</Text>
            <View style={styles.separator} />
            <Text style={styles.subtext}>
              Your ultimate safety net for emergencies and real-time first-aid
              guidance.
            </Text>
          </View>
        </View>
        <View key="2" style={styles.slide}>
          <View style={styles.sosContainer}>
            <Animated.View
              style={[
                styles.pulseRing,
                { transform: [{ scale: ringScale }], opacity: ringOpacity },
              ]}
            />
            <View style={styles.sosOuterCircle}>
              <View style={styles.sosButton}>
                <Text style={styles.sosInnerBtnText}>SOS</Text>
              </View>
            </View>
          </View>
          <Text style={styles.headline}>Instant SOS Alert</Text>
          <Text style={styles.subtext}>
            One tap to notify your trusted contacts and emergency services
            immediately.
          </Text>
        </View>

        <View key="3" style={styles.slide}>
          <View style={styles.iconCircle}>
            <HeartPulse color="#FF0000" size={50} strokeWidth={2.5} />
          </View>
          <Text style={styles.headline}>Smart First-Aid</Text>
          <Text style={styles.subtext}>
            Get step-by-step AI guidance for CPR, choking, or bleeding while
            help is on the way.
          </Text>
        </View>

        <View key="4" style={styles.slide}>
          <View style={styles.iconCircle}>
            <PhoneCall color="#FF0000" size={45} strokeWidth={2.5} />
          </View>
          <Text style={styles.headline}>Direct Helplines</Text>
          <Text style={styles.subtext}>
            Quick access to Police, Ambulance, and Fire services based on your
            current location.
          </Text>
        </View>

        <View key="5" style={styles.slide}>
          <View style={styles.iconCircle}>
            <Users color="#FF0000" size={50} strokeWidth={2.5} />
          </View>
          <Text style={styles.headline}>Trusted Contacts</Text>
          <Text style={styles.subtext}>
            Add family and friends. We'll send them your live location if you're
            ever in danger.
          </Text>
        </View>

        <View key="6" style={styles.slide}>
          <View style={styles.iconCircleLarge}>
            <UserPlus color="#FF0000" size={40} />
          </View>
          <Text style={styles.headline}>Secure Your Circle</Text>
          <Text style={styles.subtext}>
            Choose up to 3 people who will be notified during an emergency.
          </Text>

          <TouchableOpacity
            style={[styles.mainBtn, { marginTop: 20 }]}
            onPress={() => setShowModal(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Add Emergency Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerLink}
            onPress={() => finalizeOnboarding()}
            activeOpacity={0.7}
          >
            <Text style={styles.footerText}>I’ll do this later</Text>
          </TouchableOpacity>
        </View>
      </PagerView>

      {currentPage < 5 && (
        <View style={styles.footer}>
          <View style={styles.dotContainer}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: currentPage === i ? '#FF0000' : '#333',
                    width: currentPage === i ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.mainBtn} onPress={handleNext}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      <SOSContactsModal
        visible={showModal}
        contacts={[]}
        onClose={() => setShowModal(false)}
        onSave={contacts => finalizeOnboarding(contacts)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerNav: {
    position: 'absolute',
    top: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 25,
    zIndex: 20,
  },
  backButtonCircle: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    width: 45,
    height: 45,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navSide: { width: 50 },
  skipText: { color: '#666', fontSize: 16, fontWeight: '600' },
  pagerView: { flex: 1 },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logoImage: { width: width * 0.65, height: width * 0.45 },
  textContainer: { alignItems: 'center' },
  headline: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
  },
  tagline: { color: '#FF3B30', fontSize: 15, fontWeight: '500' },
  separator: {
    height: 2,
    width: 30,
    backgroundColor: '#333',
    marginVertical: 12,
  },
  subtext: { color: '#999', fontSize: 15, textAlign: 'center', lineHeight: 25 },
  footer: { paddingBottom: 50, alignItems: 'center' },
  dotContainer: { flexDirection: 'row', marginBottom: 30 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 4 },
  mainBtn: {
    backgroundColor: '#FF0000',
    width: width * 0.8,
    height: 48,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  sosContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FF0000',
  },
  sosButton: {
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosInnerBtnText: { color: '#FFF', fontSize: 36, fontWeight: '900' },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,0,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  footerLink: { marginTop: 12.5 },
  footerText: { color: '#666', fontSize: 16, fontWeight: '600' },
});
