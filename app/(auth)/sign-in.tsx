import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Button, Input } from '@/components/ui';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const result = await signIn(email.trim(), password);
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
          <Text style={[styles.om, { color: colors.tint }]}>🙏</Text>
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={[styles.subheading, { color: colors.textSecondary }]}>
            Sign in to access temple events, sponsorships, and notifications.
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

        <Button title="Sign In" onPress={handleSignIn} loading={loading} />

        <Link href="/(auth)/sign-up" style={styles.link}>
          <Text style={{ color: colors.tint, textAlign: 'center', marginTop: 20 }}>
            New here? Create an account
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
  link: {
    marginTop: 8,
  },
});
