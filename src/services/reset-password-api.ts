import type { ResetPassword } from '@/types/reset-password';
import api, { handleApiError } from './api';

const resetPasswordService = {
  resetPassword: async (payload: ResetPassword) => {
    try {
      const res = await api.post('/auth/update/password', payload);
      return res?.data; // Return the response data
    } catch (error) {
      handleApiError(error);
      return undefined;
    }
  },
};

export default resetPasswordService;
