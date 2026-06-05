import { Modal, Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { TempleEvent } from '@/types';

type MiniCalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  events: TempleEvent[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function MiniCalendarModal({
  visible,
  onClose,
  events,
  selectedDate,
  onSelectDate,
}: MiniCalendarModalProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const markedDates = events.reduce<Record<string, { marked: boolean; dotColor: string }>>((acc, event) => {
    const dateKey = event.start_time.split('T')[0];
    acc[dateKey] = { marked: true, dotColor: colors.accent };
    return acc;
  }, {});

  const calendarMarkedDates = {
    ...markedDates,
    [selectedDate]: {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: colors.tint,
      marked: true,
      dotColor: colors.accent,
    },
  };

  const dayEvents = events.filter((e) => e.start_time.startsWith(selectedDate));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.sheetTitle}>Temple Calendar</Text>
          <Calendar
            onDayPress={(day) => onSelectDate(day.dateString)}
            markedDates={calendarMarkedDates}
            theme={{
              selectedDayBackgroundColor: colors.tint,
              todayTextColor: colors.accent,
              arrowColor: colors.tint,
            }}
          />
          <ScrollView style={styles.eventList}>
            {dayEvents.length === 0 ? (
              <Text style={{ color: colors.textSecondary }}>No events on this day.</Text>
            ) : (
              dayEvents.map((event) => (
                <RNView key={event.id} style={[styles.eventRow, { borderColor: colors.border }]}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={{ color: colors.textSecondary }}>
                    {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </RNView>
              ))
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  eventList: {
    marginTop: 12,
    maxHeight: 160,
  },
  eventRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  eventTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
});
