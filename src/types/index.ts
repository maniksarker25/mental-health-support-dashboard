export type ToneKey = 'sky' | 'lavender' | 'sand' | 'blush' | 'mist';

export type PublishStatus = 'published' | 'draft';

export interface PacketItem {
  id: string;
  label: string;
}

export * from './resource';

// Forward Topic as alias to IResource / TopicAndResource
import type { IResource } from './resource';
export type Topic = IResource;

export type Channel = 'sms' | 'email';

export type DeliveryStatus = 'delivered' | 'queued' | 'failed';

export interface Transmission {
  id: string;
  recipient: string;
  channel: Channel;
  topicTitle: string;
  tone: ToneKey;
  status: DeliveryStatus;
  sentAt: string;
}

export type LegalDocId = 'privacy' | 'terms' | 'faq';

export interface LegalDoc {
  id: LegalDocId;
  label: string;
  description: string;
  html: string;
  updatedAt: string;
}

export interface Hotline {
  id: string;
  name: string;
  number: string;
  description: string;
  availability: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
  timezone: string;
  initials: string;
}

export interface ServiceHealth {
  id: string;
  name: string;
  detail: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: string;
  latencyMs: number;
}

export interface TrendPoint {
  label: string;
  sms: number;
  email: number;
}

export type TrendRange = '7d' | '30d' | '90d' | '1y';

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  direction: 'up' | 'down' | 'flat';
  caption: string;
  icon: string;
}