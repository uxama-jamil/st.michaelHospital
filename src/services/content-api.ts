import api from './api';
import {
  CONTENT_API_BASE,
  CONTENT_API,
  CONTENT_API_UPDATE,
  S3_API_BASE,
  CONTENT_API_ALL,
} from '@/constants/api';
import type {
  AddOrUpdateContent,
  ContentApiResponse,
  ContentResponse,
  FileInfo,
} from '@/types/content';

import { handleApiError } from '@/utils';
import axios from 'axios';

// Error handling

// Service
const contentService = {
  createContent: async (payload: AddOrUpdateContent) => {
    try {
      const response = await api.post<ContentApiResponse>(CONTENT_API_BASE, payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getContent: async (id: string) => {
    try {
      const response = await api.get<{ status: boolean; data: ContentResponse }>(
        CONTENT_API.replace(':id', id),
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateContent: async (payload: AddOrUpdateContent) => {
    try {
      const response = await api.put<ContentApiResponse>(CONTENT_API_UPDATE, payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteContent: async (id: string) => {
    try {
      const response = await api.delete<ContentApiResponse>(CONTENT_API.replace(':id', id));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getAllContent: async (page = 1, take = 50, orderBy = 'ASC', searchString = '') => {
    try {
      const response = await api.get<ContentApiResponse>(
        `${CONTENT_API_ALL}?page=${page}&take=${take}&order=${orderBy} ${searchString ? `&searchString=${searchString}` : ''}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getUploadUrl: async (fileInfo: FileInfo) => {
    try {
      const response = await api.get(`${S3_API_BASE}`, {
        params: {
          filename: fileInfo?.filename,
          type: fileInfo?.type,
          mimetype: fileInfo?.mimetype,
        },
      });

      return response.data; // must contain a 'url' field
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  uploadFile: async (file: File, fileInfo) => {
    try {
      const response = await axios.put(`${fileInfo.signedUrl}`, file, {
        headers: { 'Content-Type': fileInfo.mimetype },
      });

      return response.data; // must contain a 'url' field
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

export default contentService;
