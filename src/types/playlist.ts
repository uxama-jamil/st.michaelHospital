import type { ModuleContentStatus } from '@/constants/module';

// Error structure returned from backend
export interface ApiError {
  message: string;
  status?: number;
  [key: string]: any;
}

// Used only when receiving full API response
export interface PlaylistApiResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: PlaylistDataPayload;
}

// Data payload from the API
export interface PlaylistDataPayload {
  data: Playlist[];
  meta: Meta;
}

// Flattened return used by the service
export interface PlaylistServiceResponse {
  data: Playlist[];
  meta: Meta;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  status: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  keywords: Keyword[];
  content: Content[];
}

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  role: string;
  designation: string;
  email: string;
  password: string;
  phone: string;
  termsAgreed: boolean | null;
  notificationToken: string | null;
  researchNotification: boolean | null;
  code: string;
  codeExpire: string;
  lastLogin: string;
}

export interface Keyword {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface Content {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  sessionNo: number;
  length: number | null;
  thumbnail: string;
  uploadDate: string | null;
  views: number | null;
  contentType: string;
  url: string;
  isExternal: boolean;
  vimeoId: string | null;
}

export interface Meta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Used for creating/updating playlist via form

export interface PlaylistPayload {
  name: string;
  description: string;
  thumbnail: string;
  status?: ModuleContentStatus;
  keywordIds: string[];
  content: PlaylistContent[];
}
export interface PlaylistCreateResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    id: string;
  };
}
export type PlaylistForm = PlaylistPayload;

export interface PlaylistResponse {
  id: string;
  name: string;
  description: string;
  status: ModuleContentStatus;
  thumbnail: string;
  thumbnailAccessUrl: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  keywords: Keyword[];
  content: PlaylistContent[];
}

export interface Keyword {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface PlaylistContent {
  sortOrder: number;
  title?: string;
  contentType?: string;
  thumbnail?: string;
  thumbnailAccessUrl?: string;
  contentId: string;
}
