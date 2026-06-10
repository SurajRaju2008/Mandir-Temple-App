import { supabase } from '@/lib/supabase';
import type { Notification } from '@/types';

function mapNotification(row: Record<string, unknown>): Notification {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    read: Boolean(row.read),
    created_at: String(row.created_at),
  };
}

export async function fetchNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapNotification);
}

export async function createNotification(params: {
  userId: string;
  title: string;
  body: string;
}) {
  const { error } = await supabase.from('notifications').insert({
    user_id: params.userId,
    title: params.title,
    body: params.body,
    read: false,
  });

  if (error) throw error;
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
}
