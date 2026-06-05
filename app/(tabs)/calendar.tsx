import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { router } from 'expo-router';

import { AddEventModal } from '@/components/AddEventModal';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/ui';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { EVENT_TYPES } from '@/constants/temple';
import { useColorScheme } from '@/components/useColorScheme';
import type { EventDraft, TempleEvent } from '@/types';

const INITIAL_EVENTS: TempleEvent[] = [
  {
    id: '1',
    title: 'Hanuman Jayanti',
    event_type: 'festival',
    price: 0,
    start_time: '2026-06-05T18:00:00',
  },
  {
    id: '2',
    title: 'Satyanarayan Puja',
    event_type: 'puja',
    price: 51,
    start_time: '2026-06-12T09:00:00',
  },
  {
    id: '3',
    title: 'Weekly Satsang',
    event_type: 'festival',
    price: 0,
    start_time: '2026-06-08T10:00:00',
  },
];

export default function CalendarScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const [events, setEvents] = useState<TempleEvent[]>(INITIAL_EVENTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const markedDates = useMemo(() => {
    return events.reduce<Record<string, { marked: boolean; dotColor: string }>>((acc, event) => {
      const dateKey = event.start_time.split('T')[0];
      acc[dateKey] = { marked: true, dotColor: colors.accent };
      return acc;
    }, {});
  }, [events, colors.accent]);

  const selectedDayEvents = events
    .filter((e) => e.start_time.startsWith(selectedDate))
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const handleAddEvent = (draft: EventDraft) => {
    router.push({
      pathname: '/payment',
      params: {
        title: draft.title,
        eventType: draft.eventType,
        price: String(draft.price),
        date: draft.date,
        time: draft.time,
      },
    });
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
          Events on {new Date(selectedDate + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>

        {selectedDayEvents.length === 0 ? (
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
