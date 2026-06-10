import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Button, Card, Input } from '@/components/ui';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { EVENT_TYPES } from '@/constants/temple';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/components/useColorScheme';
import { confirmEventPayment } from '@/lib/events';
import { createNotification } from '@/lib/notifications';

export default function PaymentScreen() {
  const params = useLocalSearchParams<{
    eventId?: string;
    title?: string;
    eventType?: string;
    price?: string;
    date?: string;
    time?: string;
  }>();

  const { user } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);

  const eventTypeLabel =
    EVENT_TYPES.find((t) => t.id === params.eventType)?.label ?? params.eventType ?? 'Event';
  const price = Number(params.price) || 0;

  const handlePay = async () => {
    if (!cardName || !cardNumber || !expiry || !cvc) {
      Alert.alert('Missing info', 'Please fill in all payment fields.');
      return;
    }

    if (!params.eventId) {
      Alert.alert('Missing event', 'This payment is not linked to a saved event.');
      return;
    }

    setLoading(true);

    try {
      // Temporary placeholder until Stripe PaymentSheet is wired up.
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await confirmEventPayment(params.eventId);

      if (user) {
        await createNotification({
          userId: user.id,
          title: 'Sponsorship confirmed',
          body: `Your sponsorship "${params.title}" for ${params.date} has been received. Thank you!`,
        });
      }

      Alert.alert('Payment submitted', `Your sponsorship "${params.title}" ($${price}) has been recorded.`, [
        { text: 'OK', onPress: () => router.replace('/(tabs)/calendar') },
      ]);
    } catch (error) {
      Alert.alert('Payment failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <Text style={styles.eventName}>{params.title}</Text>
          <Text style={{ color: colors.textSecondary }}>{eventTypeLabel}</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            {params.date} at {params.time}
          </Text>
          <Text style={[styles.total, { color: colors.tint }]}>Total: ${price.toFixed(2)}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Credit Card</Text>
        <Input label="Name on Card" value={cardName} onChangeText={setCardName} placeholder="Full name" />
        <Input
          label="Card Number"
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="4242 4242 4242 4242"
          keyboardType="default"
        />
        <Input label="Expiry (MM/YY)" value={expiry} onChangeText={setExpiry} placeholder="12/28" />
        <Input label="CVC" value={cvc} onChangeText={setCvc} placeholder="123" secureTextEntry />

        <Text style={[styles.note, { color: colors.textSecondary }]}>
          Payments will use Stripe PaymentSheet next. For now this screen marks the saved event as confirmed after
          payment.
        </Text>

        <Button title={`Pay $${price.toFixed(2)}`} onPress={handlePay} loading={loading} />
        <Button title="Cancel" variant="outline" onPress={() => router.back()} style={{ marginTop: 10 }} />
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
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
});
