import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { Card } from '@/components/ui';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/components/useColorScheme';
import { fetchNotifications, markNotificationRead } from '@/lib/notifications';
import type { Notification } from '@/types';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const nextNotifications = await fetchNotifications(user.id);
      setNotifications(nextNotifications);
    } catch (error) {
      Alert.alert(
        'Could not load notifications',
        error instanceof Error ? error.message : 'Unknown error'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const handlePress = async (notification: Notification) => {
    if (notification.read) return;

    try {
      await markNotificationRead(notification.id);
      setNotifications((current) =>
        current.map((item) => (item.id === notification.id ? { ...item, read: true } : item))
      );
    } catch (error) {
      Alert.alert(
        'Could not update notification',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={{ color: colors.textSecondary }}>Loading notifications...</Text>
        ) : notifications.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>
            No notifications yet. You will see payment confirmations and temple updates here.
          </Text>
        ) : (
          notifications.map((notification) => (
            <Pressable key={notification.id} onPress={() => handlePress(notification)}>
              <Card
                style={
                  !notification.read ? { borderColor: colors.tint, borderWidth: 1.5 } : undefined
                }>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={{ color: colors.textSecondary, lineHeight: 20 }}>{notification.body}</Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>
                  {new Date(notification.created_at).toLocaleDateString()}
                </Text>
              </Card>
            </Pressable>
          ))
        )}
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
