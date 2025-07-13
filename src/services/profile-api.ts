import type { ApiError, UserDetails } from '@/types/user-management';
import api from './api';
import { USER_MANAGEMENT_API_BASE, USER_MANAGEMENT_API_ID } from '@/constants/api';

const handleApiError = (error: any): never => {
  // You can customize error extraction based on your API error structure
  if (error.response && error.response.data) {
    throw error.response.data as ApiError;
  }
  throw { message: error.message || 'Unknown error' } as ApiError;
};

const profileServices = {
  getUserById: async (id: string): Promise<{ status: boolean; data: UserDetails }> => {
    try {
      const response = await api.get<{ status: boolean; data: UserDetails }>(
        USER_MANAGEMENT_API_ID.replace(':id', id),
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  updateUser: async (id: string, userData: Partial<UserDetails>): Promise<UserDetails> => {
    try {
      const response = await api.put<UserDetails>(USER_MANAGEMENT_API_BASE, userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default profileServices;
