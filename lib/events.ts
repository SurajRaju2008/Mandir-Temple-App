import { supabase } from '@/lib/supabase';
import type { EventDraft, TempleEvent } from '@/types';

function mapEvent(row: Record<string, unknown>): TempleEvent {
  return {
    id: String(row.id),
    title: String(row.title),
    event_type: row.event_type as TempleEvent['event_type'],
    price: Number(row.price) || 0,
    start_time: String(row.start_time),
    end_time: row.end_time ? String(row.end_time) : undefined,
    description: row.description ? String(row.description) : undefined,
    user_id: row.user_id ? String(row.user_id) : undefined,
    payment_status: row.payment_status ? String(row.payment_status) : undefined,
  };
}

export async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_time', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapEvent);
}

export async function createEvent(draft: EventDraft, userId: string) {
  const startTime = `${draft.date}T${draft.time.length === 5 ? `${draft.time}:00` : draft.time}`;

  const { data, error } = await supabase
    .from('events')
    .insert({
      title: draft.title,
      event_type: draft.eventType,
      price: draft.price,
      start_time: startTime,
      user_id: userId,
      payment_status: draft.price > 0 ? 'pending' : 'confirmed',
    })
    .select('*')
    .single();

  if (error) throw error;
  return mapEvent(data);
}

export async function confirmEventPayment(eventId: string) {
  const { error } = await supabase
    .from('events')
    .update({ payment_status: 'confirmed' })
    .eq('id', eventId);

  if (error) throw error;
}
