import { validatePassword } from '@/utils';

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const forgotPasswordRules = {
  email: {
    required: { value: true, message: 'Email is required.' },
    pattern: emailRegex,
  },
};

export const loginRules = {
  email: {
    required: { value: true, message: 'Email is required.' },
    pattern: emailRegex,
  },
  password: {
    required: { value: true, message: 'Password is required.' },
    min: { value: 8, message: 'Password must be at least 8 characters.' },
    custom: {
      isValid: (value: string) => validatePassword(value) === undefined,
      message: 'Password must contain uppercase, lowercase, number, and special character.',
    },
  },
};

export const setPasswordRules = {
  password: {
    required: { value: true, message: 'Password is required.' },
    min: { value: 8, message: 'Password must be at least 8 characters.' },
    custom: {
      isValid: (value: string) => validatePassword(value) === undefined,
      message: 'Password must contain uppercase, lowercase, number, and special character.',
    },
  },
  confirmPassword: {
    required: { value: true, message: 'Please confirm your password.' },
    match: { field: 'password', message: 'Passwords do not match.' },
  },
};

export const addModuleRules = {
  title: {
    required: { value: true, message: 'Module name is required.' },
    min: { value: 3, message: 'Module name must be between 3 and 50 characters.' },
    max: { value: 50, message: 'Module name must be between 3 and 50 characters.' },
  },
  keywordIds: {
    required: false,
  },
  description: {
    required: { value: true, message: 'Description is required.' },
    min: { value: 3, message: 'Description must be at least 3 characters.' },
    max: { value: 500, message: 'Description must not exceed 500 characters.' },
  },
  thumbnail: {
    required: { value: true, message: 'Banner image is required..' },
  },
};

export const addPlaylistRules = {
  name: {
    required: { value: true, message: 'Playlist name is required.' },
    min: { value: 3, message: 'Playlist name must be between 3 and 50 characters.' },
    max: { value: 50, message: 'Playlist name must be between 3 and 50 characters.' },
  },
  keywordIds: {
    required: false,
  },
  description: {
    required: { value: true, message: 'Description is required.' },
    min: { value: 3, message: 'Description must be at least 3 characters.' },
    max: { value: 500, message: 'Description must not exceed 500 characters.' },
  },
  thumbnail: {
    required: { value: true, message: 'Thumbnail is required.' },
  },
  content: {
    required: { value: true, message: 'Content is required.' },
  },
};

export const userRules = {
  name: {
    required: { value: true, message: 'Name is required.' },
    customMessage: 'Full Name is required',
  },
  email: {
    required: { value: true, message: 'Email is required.' },
    pattern: emailRegex,
    customMessage: 'Invalid email address',
  },
  phoneNumber: {
    required: { value: true, message: 'Phone number is required.' },
    pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
    customMessage: 'Phone Number must be in the format (671) 555-0110',
  },
};
