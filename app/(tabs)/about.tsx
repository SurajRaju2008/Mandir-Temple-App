import { Linking, Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';
import { router } from 'expo-router';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Button, Card } from '@/components/ui';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { TEMPLE } from '@/constants/temple';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/components/useColorScheme';

export default function AboutScreen() {
  const { signOut, profile } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const openWhatsApp = () => {
    Linking.openURL(`https://wa.me/${TEMPLE.whatsapp.replace(/\D/g, '')}`);
  };

  const callTemple = () => {
    Linking.openURL(`tel:${TEMPLE.phone}`);
  };

  const emailTemple = () => {
    Linking.openURL(`mailto:${TEMPLE.email}`);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="About & Support" />

      <ScrollView contentContainerStyle={styles.content}>
        {profile && (
          <Card>
            <Text style={styles.sectionTitle}>Your Profile</Text>
            <Text>{profile.full_name}</Text>
            <Text style={{ color: colors.textSecondary }}>Gotra: {profile.gotra}</Text>
            <Text style={{ color: colors.textSecondary }}>{profile.email}</Text>
          </Card>
        )}

        <Card>
          <Text style={styles.sectionTitle}>About {TEMPLE.name}</Text>
          <Text style={{ color: colors.textSecondary, lineHeight: 22 }}>
            Welcome to our temple community app. Stay connected with daily aarti times, festival events,
            puja sponsorships, and temple announcements — all in one place.
          </Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Temple Committee</Text>
          {TEMPLE.committee.map((member) => (
            <RNView key={member.name} style={styles.memberRow}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={{ color: colors.textSecondary }}>{member.role}</Text>
            </RNView>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>App Creators</Text>
          {TEMPLE.creators.map((creator) => (
            <RNView key={creator.name} style={styles.memberRow}>
              <Text style={styles.memberName}>{creator.name}</Text>
              <Text style={{ color: colors.textSecondary }}>{creator.role}</Text>
            </RNView>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Contact & Support</Text>
          <Pressable onPress={callTemple} style={styles.contactRow}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={{ color: colors.tint }}>{TEMPLE.phone}</Text>
          </Pressable>
          <Pressable onPress={openWhatsApp} style={styles.contactRow}>
            <Text style={styles.contactLabel}>WhatsApp</Text>
            <Text style={{ color: colors.tint }}>Message us</Text>
          </Pressable>
          <Pressable onPress={emailTemple} style={styles.contactRow}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={{ color: colors.tint }}>{TEMPLE.email}</Text>
          </Pressable>
          <Text style={[styles.address, { color: colors.textSecondary }]}>{TEMPLE.address}</Text>
        </Card>

        <Button
          title="Sign Out"
          variant="outline"
          onPress={async () => {
            await signOut();
            router.replace('/(auth)/sign-in');
          }}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  memberRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  memberName: {
    fontWeight: '600',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  contactLabel: {
    fontWeight: '500',
  },
  address: {
    marginTop: 12,
    lineHeight: 20,
  },
});
