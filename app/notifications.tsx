import { ScrollView, StyleSheet } from 'react-native';

import { Card } from '@/components/ui';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { Notification } from '@/types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Hanuman Jayanti Tomorrow',
    body: 'Join us for special aarti at 6:30 PM. Prasad will be served after the ceremony.',
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Puja Sponsorship Confirmed',
    body: 'Your Satyanarayan Puja sponsorship for June 12 has been received. Thank you!',
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function NotificationsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {MOCK_NOTIFICATIONS.map((notification) => (
          <Card
            key={notification.id}
            style={!notification.read ? { borderColor: colors.tint, borderWidth: 1.5 } : undefined}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={{ color: colors.textSecondary, lineHeight: 20 }}>{notification.body}</Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {new Date(notification.created_at).toLocaleDateString()}
            </Text>
          </Card>
        ))}
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
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    marginTop: 8,
  },
});
