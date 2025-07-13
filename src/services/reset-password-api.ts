import type { ResetPassword } from '@/types/reset-password';
import api, { handleApiError } from './api';
import { RESET_PASSWORD_API } from '@/constants/api';

const resetPasswordService = {
  resetPassword: async (payload: ResetPassword) => {
    try {
      const res = await api.post(RESET_PASSWORD_API, payload);
      return res?.data; // Return the response data
    } catch (error) {
      handleApiError(error);
      return undefined;
    }
  },
};

export default resetPasswordService;
