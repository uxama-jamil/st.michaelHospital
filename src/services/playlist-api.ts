import type {
  PlaylistApiResponse,
  PlaylistServiceResponse,
  ApiError,
  PlaylistPayload,
} from '@/types/playlist';
import api from './api';
import { handleApiError } from '@/utils';

const playListServices = {
  getPlaylist: async (page = 1, take = 10, orderBy = 'DESC'): Promise<PlaylistServiceResponse> => {
    try {
      const response = await api.get<PlaylistApiResponse>(
        `/playlists?page=${page}&take=${take}&order=${orderBy}`,
      );
      const { data, meta } = response.data.data;
      return { data, meta };
    } catch (error) {
      handleApiError(error);
    }
  },

  getPlayListById: async (id: string): Promise<any> => {
    try {
      const response = await api.get<any>(`/playlists/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  createPlaylist: async (payload: PlaylistPayload) => {
    try {
      const response = await api.post<PlaylistPayload>('/playlists', payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updatePlayList: async (id: string, payload: Partial<any>): Promise<any> => {
    try {
      const response = await api.patch<any>(`/playlists/${id}`, payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getPlayListContents: async (
    payload: Record<string, any>,
  ): Promise<PlaylistApiResponse | undefined> => {
    try {
      const response = await api.get<PlaylistApiResponse>(`/playlists/${payload.id}/content`, {
        params: {
          page: payload.page,
          take: payload.take,
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deletePlayList: async (id: string): Promise<void> => {
    try {
      await api.delete(`/playlist/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
  publishContent: async (id: string, status: string): Promise<{ id: string; status: string }> => {
    try {
      const response = await api.patch<{ id: string; status: string }>(`/playlists/${id}/status`, {
        id,
        status,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

export default playListServices;
