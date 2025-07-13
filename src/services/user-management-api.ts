import type { ApiError, ApiResponse, UserDetails } from '@/types/user-management';
import api from './api';
import {
  USER_MANAGEMENT_API_ADMINS,
  USER_MANAGEMENT_API_BASE,
  USER_MANAGEMENT_API_CREATE,
  USER_MANAGEMENT_API_FORGOT,
  USER_MANAGEMENT_API_ID,
  USER_MANAGEMENT_PAGE_SIZE,
} from '@/constants/api';

const handleApiError = (error: any): never => {
  // You can customize error extraction based on your API error structure
  if (error.response && error.response.data) {
    throw error.response.data as ApiError;
  }
  throw { message: error.message || 'Unknown error' } as ApiError;
};

const userManagementServices = {
  getAllUsers: async (
    page = 1,
    take = USER_MANAGEMENT_PAGE_SIZE,
    orderBy = 'DESC',
  ): Promise<ApiResponse> => {
    try {
      const response = await api.get<ApiResponse>(
        `${USER_MANAGEMENT_API_ADMINS}?page=${page}&take=${take}&order=${orderBy}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

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

  createUser: async (userData: Partial<UserDetails>): Promise<UserDetails> => {
    try {
      const response = await api.post<UserDetails>(USER_MANAGEMENT_API_CREATE, userData);
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

  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(USER_MANAGEMENT_API_ID.replace(':id', id));
    } catch (error) {
      handleApiError(error);
    }
  },
  resendEmail: async (email: string): Promise<void> => {
    try {
      await api.post(USER_MANAGEMENT_API_FORGOT, { email });
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default userManagementServices;
