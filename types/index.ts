import type { EventTypeId } from '@/constants/temple';

export type Profile = {
  id: string;
  full_name: string;
  gotra: string;
  email: string;
  created_at?: string;
};

export type TempleEvent = {
  id: string;
  title: string;
  event_type: EventTypeId;
  price: number;
  start_time: string;
  end_time?: string;
  description?: string;
  user_id?: string;
  payment_status?: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export type EventDraft = {
  title: string;
  eventType: EventTypeId;
  price: number;
  date: string;
  time: string;
};
