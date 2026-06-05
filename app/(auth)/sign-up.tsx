import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Button, Input } from '@/components/ui';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const [fullName, setFullName] = useState('');
  const [gotra, setGotra] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName.trim() || !gotra.trim()) {
      setError('Please enter your name and gotra.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await signUp({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      gotra: gotra.trim(),
    });

    setLoading(false);

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
          <Text style={styles.heading}>Create Account</Text>
          <Text style={[styles.subheading, { color: colors.textSecondary }]}>
            Join the temple community. Your gotra helps us personalize religious services.
          </Text>
        </View>

        <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Your name" />
        <Input label="Gotra" value={gotra} onChangeText={setGotra} placeholder="e.g. Bharadwaj" />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Min. 6 characters"
          secureTextEntry
          autoCapitalize="none"
        />

        {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}

        <Button title="Sign Up" onPress={handleSignUp} loading={loading} />

        <Link href="/(auth)/sign-in" style={styles.link}>
          <Text style={{ color: colors.tint, textAlign: 'center', marginTop: 20 }}>
            Already have an account? Sign in
          </Text>
        </Link>
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
  link: {
    marginTop: 8,
  },
});
