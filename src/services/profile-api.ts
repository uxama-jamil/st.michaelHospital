import type { ApiError, UserDetails } from '@/types/user-management';
import api from './api';

const handleApiError = (error: any): never => {
  // You can customize error extraction based on your API error structure
  if (error.response && error.response.data) {
    throw error.response.data as ApiError;
  }
  throw { message: error.message || 'Unknown error' } as ApiError;
};

const profileServices = {

  getUserById: async (id: string): Promise<UserDetails> => {
    try {
      const response = await api.get<UserDetails>(`/users/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  updateUser: async (id: string, userData: Partial<UserDetails>): Promise<UserDetails> => {
    try {
      const response = await api.put<UserDetails>(`/users`, userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

};

export default profileServices;
