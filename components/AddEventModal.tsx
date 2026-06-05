import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';

import { Button, Input } from '@/components/ui';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { EVENT_TYPES, type EventTypeId } from '@/constants/temple';
import { useColorScheme } from '@/components/useColorScheme';
import type { EventDraft } from '@/types';

type AddEventModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (draft: EventDraft) => void;
};

export function AddEventModal({ visible, onClose, onSubmit }: AddEventModalProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventTypeId>('puja');
  const [price, setPrice] = useState('51');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');

  const selectedType = EVENT_TYPES.find((t) => t.id === eventType);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      eventType,
      price: Number(price) || selectedType?.basePrice || 0,
      date,
      time,
    });
    setTitle('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
          <ScrollView>
            <Text style={styles.title}>Add Event / Sponsorship</Text>

            <Input label="Event Name" value={title} onChangeText={setTitle} placeholder="e.g. Satyanarayan Puja" />

            <Text style={styles.label}>Sponsorship / Event Type</Text>
            <RNView style={styles.typeGrid}>
              {EVENT_TYPES.map((type) => (
                <Pressable
                  key={type.id}
                  onPress={() => {
                    setEventType(type.id);
                    setPrice(String(type.basePrice));
                  }}
                  style={[
                    styles.typeChip,
                    {
                      borderColor: eventType === type.id ? colors.tint : colors.border,
                      backgroundColor: eventType === type.id ? `${colors.tint}22` : colors.background,
                    },
                  ]}>
                  <Text style={{ fontWeight: eventType === type.id ? '700' : '400' }}>{type.label}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>${type.basePrice}+</Text>
                </Pressable>
              ))}
            </RNView>

            <Input
              label="Price ($)"
              value={price}
              onChangeText={setPrice}
              keyboardType="default"
              placeholder="51"
            />

            <Input label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} placeholder="2026-06-05" />
            <Input label="Time (HH:MM)" value={time} onChangeText={setTime} placeholder="09:00" />

            <Button title="Continue to Payment" onPress={handleSubmit} style={{ marginTop: 8 }} />
            <Button title="Cancel" onPress={onClose} variant="outline" style={{ marginTop: 8 }} />
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
    maxHeight: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeChip: {
    width: '47%',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
});
