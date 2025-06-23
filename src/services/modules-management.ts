import { MODULES_API, MODULES_API_BASE, MODULES_API_LIST } from '@/constants/api';
import api from './api';
import type { ModulesApiResponse, AddModule, ModuleContentApiResponse } from '@/types/modules';

import type { ApiError } from '@/types/error';
import type { Module } from '@/types/modules';
import { handleApiError } from '@/utils';

const modulesManagementServices = {
  getModules: async (page: number = 1, take: number = 10, order: string = 'DESC') => {
    try {
      const response = await api.post<ModulesApiResponse>(MODULES_API_LIST, {
        page,
        take,
        order,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getModule: async (id: string) => {
    try {
      const response = await api.get<Module>(MODULES_API.replace(':id', id));
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  createModule: async (module: AddModule) => {
    try {
      const response = await api.post<Partial<ModulesApiResponse>>(MODULES_API_BASE, module);

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  updateModule: async (module: AddModule) => {
    try {
      const response = await api.put<Partial<ModulesApiResponse>>(MODULES_API_BASE, module);

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  deleteModule: async (id: string) => {
    try {
      const response = await api.delete(MODULES_API.replace(':id', id));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getModuleContents: async (
    payload: Record<string, any>,
  ): Promise<ModuleContentApiResponse | undefined> => {
    try {
      const response = await api.post<ModuleContentApiResponse>('/content/admin-list', payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteContent: async (id: string): Promise<void> => {
    try {
      await api.delete(`/content/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
  publishContent: async (id: string, status: string): Promise<{ id: string; status: string }> => {
    try {
      const response = await api.patch<{ id: string; status: string }>(`/categories/${id}/status`, {
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

export default modulesManagementServices;
