import { ContentType } from '@/constants/content';

export interface Option {
  optionValue: string;
  isCorrect: boolean;
  optionOrder: number;
}
export interface Question {
  id?: number;
  questionText: string;
  options: Option[];
}

export interface ContentOption {
  optionValue: string;
  optionOrder: number;
  isCorrect: boolean;
}

export interface ContentQuestion {
  questionText: string;
  options: ContentOption[];
}

export interface AddOrUpdateContent {
  id?: string; // optional for POST, required for PUT
  title: string;
  description: string;
  sessionNo: number;
  length: number | null;
  thumbnail: string;
  contentType: ContentType;
  url: string;
  categoryId: string;
  questions: ContentQuestion[];
}

export interface ContentCategory {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: string;
}

export interface ContentResponse {
  id: string;
  title: string;
  description: string;
  sessionNo: number;
  length: number | null;
  thumbnail: string;
  contentType: string;
  url: string;
  questionnaireStatus: boolean;
  isExternal: boolean;
  category: ContentCategory;
  questions: Array<{
    id: string;
    questionText: string;
    options: Array<{
      id: string;
      optionValue: string;
      optionOrder: number;
      isCorrect: boolean;
    }>;
  }>;
}

export interface ContentApiResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: ContentResponse;
}

export interface FileInfo {
  type: string;
  filename: string;
  mimetype: string;
}

export interface FileUploadResponse {
  key: string;
  signedUrl: string;
}
