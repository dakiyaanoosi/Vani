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
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

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
    linkedin: 'https://www.linkedin.com/in/mahmoodul-hassan',
    github: 'https://github.com/hazforu',
  }
];

const SocialRow = ({ icon, label, value, url }) => {
  const handlePress = () => {
    if (!url || url === '#') return;

    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
      Alert.alert(
        "Link Error",
        "Could not open this link. Make sure the relevant app is installed."
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
        <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
      </View>
      <Icon name="arrow-up-right" size={14} color="#444" />
    </TouchableOpacity>
  );
};

const AboutDevelopers = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>About Developers</Text>
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

        <Text style={styles.versionText}>
          {`Vani v${version}`}
        </Text>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: Platform.OS === 'ios' ? 20 : 10,
  },
  backButton: {
    paddingRight: 10,
    paddingVertical: 5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  section: {
    marginBottom: 30,
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
});

export default AboutDevelopers;