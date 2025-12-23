import React from 'react';
import { version } from '../../app.json';

import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

const DEVELOPERS = [
  {
    name: 'Avinish Kumar Tripathi',
    email: 'avinishkumartripathi@gmail.com',
    linkedin: 'https://www.linkedin.com/in/avinishkumartripathi',
    github: 'https://github.com/dakiyaanoosi',
  },
  {
    name: 'Mahmoodul Hassan',
    email: 'mahmoodulh722@gmail.com',
    linkedin: 'https://www.linkedin.com/in/mahmoodul-hassan-68672832b',
    github: 'https://github.com/hazforu',
  },
];

const SocialRow = ({ icon, label, value, url }) => {
  const handlePress = () => {
    if (!url || url === '#') return;

    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
      Alert.alert(
        'Link Error',
        'Could not open this link. Make sure the relevant app is installed.',
      );
    });
  };

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={handlePress}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.iconWrapper}>
        <Icon name={icon} size={18} color="#888" />
      </View>
      <View style={styles.contentWrapper}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <Icon name="arrow-up-right" size={16} color="#444" />
    </TouchableOpacity>
  );
};

const AboutDevelopers = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconHit}
          >
            <Icon2 name="keyboard-backspace" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Developers</Text>
          <View style={{ width: 50 }} />
        </View>

        {DEVELOPERS.map((dev, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.devName}>{dev.name}</Text>
            <View style={styles.card}>
              <SocialRow
                icon="mail"
                label="Email"
                value={dev.email}
                url={`mailto:${dev.email}`}
              />
              <View style={styles.innerDivider} />
              <SocialRow
                icon="linkedin"
                label="LinkedIn"
                value="View Profile"
                url={dev.linkedin}
              />
              <View style={styles.innerDivider} />
              <SocialRow
                icon="github"
                label="GitHub"
                value="View Profile"
                url={dev.github}
              />
            </View>
          </View>
        ))}

        <Text style={styles.versionText}>{`Vani v${version}`}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
    marginHorizontal: 20,
  },
  devName: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  iconWrapper: {
    width: 38,
    alignItems: 'flex-start',
  },
  contentWrapper: {
    flex: 1,
  },
  rowLabel: {
    color: '#666',
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 2,
  },
  rowValue: {
    color: '#efefef',
    fontSize: 15,
    fontWeight: '500',
  },
  innerDivider: {
    height: 1,
    backgroundColor: '#222',
    marginLeft: 56,
  },
  versionText: {
    color: '#444',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 12,
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },

  iconHit: {
    padding: 12,
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AboutDevelopers;
