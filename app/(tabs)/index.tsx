import { useCallback, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from 'expo-router';

import { MiniCalendarModal } from '@/components/MiniCalendarModal';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/ui';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { getDailyQuote, TEMPLE } from '@/constants/temple';
import { useColorScheme } from '@/components/useColorScheme';
import { fetchEvents } from '@/lib/events';
import type { TempleEvent } from '@/types';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const today = new Date().toISOString().split('T')[0];

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState<TempleEvent[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents()
        .then(setEvents)
        .catch(() => setEvents([]));
    }, [])
  );

  const upcomingEvents = events
    .filter((event) => new Date(event.start_time) >= new Date())
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const openMaps = () => {
    const query = encodeURIComponent(TEMPLE.address);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={TEMPLE.name} showNotifications />

      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.sectionTitle}>Daily Quote</Text>
          <Text style={[styles.quote, { color: colors.textSecondary }]}>"{getDailyQuote()}"</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={{ marginBottom: 12 }}>{TEMPLE.address}</Text>
          <Pressable onPress={openMaps}>
            <RNView style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  ...TEMPLE.coordinates,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}>
                <Marker coordinate={TEMPLE.coordinates} title={TEMPLE.name} />
              </MapView>
            </RNView>
            <Text style={[styles.mapLink, { color: colors.tint }]}>Open in Google Maps →</Text>
          </Pressable>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Working Hours</Text>
          {TEMPLE.workingHours.map((row) => (
            <RNView key={row.day} style={styles.row}>
              <Text style={styles.rowLabel}>{row.day}</Text>
              <Text style={{ color: colors.textSecondary }}>{row.hours}</Text>
            </RNView>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Aarti Times</Text>
          {TEMPLE.aartiTimes.map((aarti) => (
            <RNView key={aarti.name} style={styles.row}>
              <Text style={styles.rowLabel}>{aarti.name}</Text>
              <Text style={{ color: colors.tint, fontWeight: '600' }}>{aarti.time}</Text>
            </RNView>
          ))}
        </Card>

        <Pressable onPress={() => setCalendarVisible(true)}>
          <Card style={styles.calendarPreview}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
              Tap to open calendar — {upcomingEvents.length} upcoming event
              {upcomingEvents.length === 1 ? '' : 's'}
            </Text>
            {upcomingEvents.slice(0, 2).map((event) => (
              <RNView key={event.id} style={[styles.eventChip, { backgroundColor: `${colors.tint}18` }]}>
                <Text style={{ fontWeight: '600' }}>{event.title}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {new Date(event.start_time).toLocaleDateString()}
                </Text>
              </RNView>
            ))}
          </Card>
        </Pressable>
      </ScrollView>

      <MiniCalendarModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        events={upcomingEvents}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
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
  quote: {
    fontStyle: 'italic',
    lineHeight: 24,
    fontSize: 15,
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapLink: {
    marginTop: 8,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: {
    fontWeight: '500',
  },
  calendarPreview: {
    marginBottom: 0,
  },
  eventChip: {
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
});
