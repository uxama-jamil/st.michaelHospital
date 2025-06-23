import api from './api';
import { CONTENT_API_BASE, CONTENT_API, CONTENT_API_UPDATE } from '@/constants/api';
import type { AddOrUpdateContent, ContentApiResponse } from '@/types/content';
import type { ApiError } from '@/types/error';
import { handleApiError } from '@/utils';

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
      const response = await api.get<ContentApiResponse>(CONTENT_API.replace(':id', id));
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

  uploadFile: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`${CONTENT_API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data; // must contain a 'url' field
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

export default contentService;
