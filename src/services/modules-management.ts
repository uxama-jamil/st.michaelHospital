import {
  CONTENT_API_ADMIN_LIST,
  MODULES_API,
  MODULES_API_BASE,
  MODULES_API_LIST,
  MODULES_API_STATUS,
  MODULES_PAGE_SIZE,
} from '@/constants/api';
import api from './api';
import type {
  ModulesApiResponse,
  AddModule,
  ModuleContentApiResponse,
  CreateModuleResponse,
  ModuleResponse,
} from '@/types/modules';
import { handleApiError } from '@/utils';

const modulesManagementServices = {
  getModules: async (
    page: number = 1,
    take: number = MODULES_PAGE_SIZE,
    order: string = 'DESC',
  ) => {
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
      const response = await api.get<ModuleResponse>(MODULES_API.replace(':id', id));
      return response?.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  createModule: async (module: AddModule) => {
    try {
      const response = await api.post<CreateModuleResponse>(MODULES_API_BASE, module);

      return response?.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  updateModule: async (module: AddModule) => {
    try {
      const response = await api.put<CreateModuleResponse>(MODULES_API_BASE, module);

      return response?.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  deleteModule: async (id: string) => {
    try {
      const response = await api.delete(MODULES_API.replace(':id', id));
      return response?.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getModuleContents: async (
    payload: Record<string, any>,
  ): Promise<ModuleContentApiResponse | undefined> => {
    try {
      const response = await api.post<ModuleContentApiResponse>(CONTENT_API_ADMIN_LIST, payload);
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
      const response = await api.patch<{ id: string; status: string }>(
        MODULES_API_STATUS.replace(':id', id),
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

export default modulesManagementServices;
