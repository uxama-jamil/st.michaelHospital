import type { ApiError, ApiResponse, UserDetails } from '@/types/user-management';
import api from './api';

const handleApiError = (error: any): never => {
  // You can customize error extraction based on your API error structure
  if (error.response && error.response.data) {
    throw error.response.data as ApiError;
  }
  throw { message: error.message || 'Unknown error' } as ApiError;
};

const userManagementServices = {
  getAllUsers: async (page = 1, take = 10, orderBy = 'DESC'): Promise<ApiResponse> => {
    try {
      const response = await api.get<ApiResponse>(`/users/admins?page=${page}&take=${take}&order=${orderBy}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getUserById: async (id: string): Promise<UserDetails> => {
    try {
      const response = await api.get<UserDetails>(`/users/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createUser: async (userData: Partial<UserDetails>): Promise<UserDetails> => {
    try {
      const response = await api.post<UserDetails>('/auth/register', userData);
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

  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
  resendEmail: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/forgot', { email });
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default userManagementServices;
