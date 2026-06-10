import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Button, Input } from '@/components/ui';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function CreateProfileScreen() {
  const { session, profile, loading, createProfile } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const [fullName, setFullName] = useState('');
  const [gotra, setGotra] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!loading && profile) {
    return <Redirect href="/(tabs)" />;
  }

  const handleCreateProfile = async () => {
    if (!fullName.trim() || !gotra.trim()) {
      setError('Please enter your name and gotra.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await createProfile({
      fullName: fullName.trim(),
      gotra: gotra.trim(),
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.hero} lightColor="transparent" darkColor="transparent">
          <Text style={styles.heading}>Create Your Profile</Text>
          <Text style={[styles.subheading, { color: colors.textSecondary }]}>
            Your account is ready. Add your details so we can personalize temple services.
          </Text>
        </View>

        <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Your name" />
        <Input label="Gotra" value={gotra} onChangeText={setGotra} placeholder="e.g. Bharadwaj" />

        {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}

        <Button title="Save Profile" onPress={handleCreateProfile} loading={submitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
  },
  hero: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subheading: {
    lineHeight: 22,
  },
  error: {
    marginBottom: 12,
    textAlign: 'center',
  },
});
