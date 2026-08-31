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

// -------------------------------------------------------------
// User Management Types
// -------------------------------------------------------------
export type UserStatus = 'active' | 'blocked' | 'suspended';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  initials: string;
  role: 'member' | 'verified_sender' | 'clinician' | 'caregiver';
  status: UserStatus;
  joinedAt: string;
  lastActiveAt: string;
  messagesSentCount: number;
  reportsReceivedCount: number;
  blockedAt?: string;
  blockedReason?: string;
  notes?: string;
}

// -------------------------------------------------------------
// Message Approval & Moderation Types
// -------------------------------------------------------------
export type MessageApprovalStatus = 'pending' | 'approved' | 'rejected' | 'delivered';

export interface AdminMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  recipientContact: string; // phone number or email address
  recipientName?: string;
  recipientRelationship?: string;
  channel: Channel;
  topicId: string;
  topicTitle: string;
  tone: ToneKey;
  customNote: string;
  submittedAt: string;
  scheduledFor?: string;
  status: MessageApprovalStatus;
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
}

// -------------------------------------------------------------
// Report Management Types
// -------------------------------------------------------------
export type ReportStatus = 'new' | 'resolved';


export type ReportReasonCategory =
  | 'harassment'
  | 'unsolicited'
  | 'distressing'
  | 'wrong_number'
  | 'spam'
  | 'other';

export interface MessageReport {
  id: string;
  messageId?: string;
  reportedPersonId: string;
  reportedPersonName: string;
  reportedPersonContact: string; // email or phone
  reportedByContact: string; // receiver phone or email
  reportedByChannel: Channel;
  topicTitle: string;
  tone?: ToneKey;
  reasonCategory: ReportReasonCategory;
  reasonText: string;
  reportedAt: string;
  status: ReportStatus;
  resolutionNotes?: string;
  resolvedAt?: string;
}

// -------------------------------------------------------------
// Topic & Resource Management Types
// -------------------------------------------------------------
export interface IAdminTopic {
  id: string;
  name: string;
  tone: ToneKey;
  icon: string;
  description: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface IArticleResource {
  id: string;
  topicId: string;
  topicName?: string;
  title: string;
  shortDescription: string;
  contentHtml: string;
  readingTime?: number;
  featuredImage?: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// Community Post Moderation Types
// -------------------------------------------------------------
export type CommunityPostApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs_update';

export interface IAdminCommunityPost {
  id: string;
  author: string;
  title: string;
  content: string;
  topicTag: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  repliesCount: number;
  status: CommunityPostApprovalStatus;
  feedback?: string;
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}