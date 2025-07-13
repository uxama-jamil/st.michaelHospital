import type {
  PlaylistApiResponse,
  PlaylistServiceResponse,
  PlaylistPayload,
  PlaylistCreateResponse,
} from '@/types/playlist';
import api from './api';
import { handleApiError } from '@/utils';
import {
  PLAYLIST_API_BASE,
  PLAYLIST_API_CONTENT,
  PLAYLIST_API_ID,
  PLAYLIST_API_STATUS,
  PLAYLIST_PAGE_SIZE,
} from '@/constants/api';

const playListServices = {
  getPlaylist: async (
    page = 1,
    take = PLAYLIST_PAGE_SIZE,
    orderBy = 'DESC',
  ): Promise<PlaylistServiceResponse> => {
    try {
      const response = await api.get<PlaylistApiResponse>(
        `${PLAYLIST_API_BASE}?page=${page}&take=${take}&order=${orderBy}`,
      );
      const { data, meta } = response.data.data;
      return { data, meta };
    } catch (error) {
      handleApiError(error);
    }
  },

  getPlayListById: async (id: string): Promise<any> => {
    try {
      const response = await api.get<any>(PLAYLIST_API_ID.replace(':id', id));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  createPlaylist: async (payload: PlaylistPayload) => {
    try {
      const response = await api.post<PlaylistCreateResponse>(PLAYLIST_API_BASE, payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updatePlayList: async (id: string, payload: Partial<any>): Promise<any> => {
    try {
      const response = await api.patch<any>(PLAYLIST_API_ID.replace(':id', id), payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getPlayListContents: async (
    payload: Record<string, any>,
  ): Promise<PlaylistApiResponse | undefined> => {
    try {
      const response = await api.get<PlaylistApiResponse>(
        PLAYLIST_API_CONTENT.replace(':id', payload.id),
        {
          params: {
            page: payload.page,
            take: payload.take,
          },
        },
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deletePlayList: async (id: string): Promise<void> => {
    try {
      await api.delete(PLAYLIST_API_ID.replace(':id', id));
    } catch (error) {
      handleApiError(error);
    }
  },
  publishContent: async (id: string, status: string): Promise<{ id: string; status: string }> => {
    try {
      const response = await api.patch<{ id: string; status: string }>(
        PLAYLIST_API_STATUS.replace(':id', id),
        {
          id,
          status,
        },
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

export default playListServices;
