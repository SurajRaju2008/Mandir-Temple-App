import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { router, useFocusEffect } from 'expo-router';

import { AddEventModal } from '@/components/AddEventModal';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/ui';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { EVENT_TYPES } from '@/constants/temple';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/components/useColorScheme';
import { createEvent, fetchEvents } from '@/lib/events';
import type { EventDraft, TempleEvent } from '@/types';

export default function CalendarScreen() {
  const { user } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const [events, setEvents] = useState<TempleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const loadEvents = useCallback(async () => {
    try {
      const nextEvents = await fetchEvents();
      setEvents(nextEvents);
    } catch (error) {
      Alert.alert('Could not load events', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  const markedDates = events.reduce<Record<string, { marked: boolean; dotColor: string }>>((acc, event) => {
    const dateKey = event.start_time.split('T')[0];
    acc[dateKey] = { marked: true, dotColor: colors.accent };
    return acc;
  }, {});

  const selectedDayEvents = events
    .filter((e) => e.start_time.startsWith(selectedDate))
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const handleAddEvent = async (draft: EventDraft) => {
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to add an event.');
      return;
    }

    try {
      const event = await createEvent(draft, user.id);

      if (event.price > 0) {
        router.push({
          pathname: '/payment',
          params: {
            eventId: event.id,
            title: event.title,
            eventType: event.event_type,
            price: String(event.price),
            date: draft.date,
            time: draft.time,
          },
        });
        return;
      }

      await loadEvents();
      Alert.alert('Event saved', `"${event.title}" has been added to the calendar.`);
    } catch (error) {
      Alert.alert('Could not save event', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Events & Calendar"
        rightAction={
          <Pressable onPress={() => setModalVisible(true)} style={styles.addLink}>
            <Text style={styles.addLinkText}>+ Add Event</Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={{ padding: 8 }}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                selected: true,
                selectedColor: colors.tint,
                marked: markedDates[selectedDate]?.marked,
                dotColor: colors.accent,
              },
            }}
            theme={{
              selectedDayBackgroundColor: colors.tint,
              todayTextColor: colors.accent,
              arrowColor: colors.tint,
            }}
          />
        </Card>

        <Text style={styles.sectionTitle}>
          Events on{' '}
          {new Date(selectedDate + 'T12:00:00').toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        {loading ? (
          <Text style={{ color: colors.textSecondary }}>Loading events...</Text>
        ) : selectedDayEvents.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>No events scheduled.</Text>
        ) : (
          selectedDayEvents.map((event) => {
            const typeLabel = EVENT_TYPES.find((t) => t.id === event.event_type)?.label ?? event.event_type;
            return (
              <Card key={event.id}>
                <RNView style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.price > 0 && (
                    <Text style={[styles.price, { color: colors.tint }]}>${event.price}</Text>
                  )}
                </RNView>
                <Text style={{ color: colors.textSecondary }}>{typeLabel}</Text>
                <Text style={{ marginTop: 4, fontWeight: '600' }}>
                  {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {event.payment_status === 'pending' && (
                  <Text style={{ color: colors.accent, marginTop: 6, fontWeight: '600' }}>
                    Payment pending
                  </Text>
                )}
              </Card>
            );
          })
        )}

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>All Upcoming Events</Text>
        {events
          .filter((e) => new Date(e.start_time) >= new Date())
          .sort((a, b) => a.start_time.localeCompare(b.start_time))
          .map((event) => (
            <Card key={`all-${event.id}`}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={{ color: colors.textSecondary }}>
                {new Date(event.start_time).toLocaleString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </Card>
          ))}
      </ScrollView>

      <AddEventModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleAddEvent} />
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
  addLink: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  addLinkText: {
    color: '#fff',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginVertical: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  price: {
    fontWeight: '700',
    fontSize: 16,
  },
});
