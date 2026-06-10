import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Button, Input } from '@/components/ui';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function SignInScreen() {
  const { continueWithEmail } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const result = await continueWithEmail(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setSuccessMessage('Account created. Check your email to confirm, then sign in again.');
      return;
    }

    if (result.needsProfile) {
      router.replace('/(auth)/create-profile');
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
          <Text style={[styles.om, { color: colors.tint }]}>🙏</Text>
          <Text style={styles.heading}>Welcome</Text>
          <Text style={[styles.subheading, { color: colors.textSecondary }]}>
            Enter your email and password to sign in, or create a new account.
          </Text>
        </View>

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
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
        />

        {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
        {successMessage && (
          <Text style={[styles.success, { color: colors.tint }]}>{successMessage}</Text>
        )}

        <Button title="Continue" onPress={handleContinue} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  om: {
    fontSize: 48,
    marginBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subheading: {
    textAlign: 'center',
    lineHeight: 22,
  },
  error: {
    marginBottom: 12,
    textAlign: 'center',
  },
  success: {
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
});
