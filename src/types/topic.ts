import type { ApiResponse } from './api';

export type ToneKey = 'sky' | 'lavender' | 'sand' | 'blush' | 'mist';

export interface TopicRecord {
  _id: string;
  slug: string;
  name: string;
  shortDescription: string;
  tone: ToneKey;
  icon: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TopicPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TopicListResponse extends ApiResponse<TopicRecord[]> {
  meta: TopicPagination;
}

export interface TopicListResult {
  data: TopicRecord[];
  meta: TopicPagination;
}

export interface TopicListParams {
  page: number;
  limit: number;
  searchTerm?: string;
  tone?: ToneKey;
}

export interface TopicPayload {
  name: string;
  shortDescription: string;
  tone: ToneKey;
  icon: string;
}
