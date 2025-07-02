import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { Tooltip } from 'antd';

export const validate = (
  values: Record<string, any>,
  rules: Record<string, any>,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((field) => {
    const value = values[field];
    const rule = rules[field];

    // Required
    if (
      rule.required?.value &&
      (value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0))
    ) {
      errors[field] = rule.required.message;
      return;
    }

    // Min length
    if (
      rule.min &&
      (typeof value === 'string' || Array.isArray(value)) &&
      value.length < rule.min.value
    ) {
      errors[field] = rule.min.message;
      return;
    }

    // Max length
    if (
      rule.max &&
      (typeof value === 'string' || Array.isArray(value)) &&
      value.length > rule.max.value
    ) {
      errors[field] = rule.max.message;
      return;
    }

    // Pattern
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors[field] = rule.pattern.message || `Invalid ${field}`;
      return;
    }

    // Match Field (corrected)
    if (rule.matchField && value !== values[rule.matchField.field]) {
      errors[field] = rule.matchField.message || `${field} does not match`;
      return;
    }

    // Match (alias support)
    if (rule.match && value !== values[rule.match.field]) {
      errors[field] = rule.match.message || `${field} does not match`;
      return;
    }

    // Custom
    if (rule.custom && typeof rule.custom.isValid === 'function') {
      if (!rule.custom.isValid(value, values)) {
        errors[field] = rule.custom.message;
        return;
      }
    }

    // Custom Function (legacy support)
    if (typeof rule.custom === 'function') {
      const customError = rule.custom(value, values);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
  });

  return errors;
};

export const handleApiError = (error: any): never => {
  if (error.response && error.response.data) {
    const apiError = error.response.data;

    // If it's a validation error array
    if (Array.isArray(apiError.message)) {
      const messages = apiError.message.map((msgObj: any) => {
        if (typeof msgObj === 'object' && msgObj.constraints) {
          return Object.values(msgObj.constraints).join(', ');
        }
        return typeof msgObj === 'string' ? msgObj : JSON.stringify(msgObj);
      });
      throw { message: messages.join(' | ') };
    }

    // If it's a single message
    if (typeof apiError.message === 'string') {
      throw { message: apiError.message };
    }

    // Fallback
    throw { message: JSON.stringify(apiError) };
  }

  throw { message: error.message || 'Unknown error' };
};

export const formatPhoneNumber = (rawNumber: string): JSX.Element => {
  let digits = rawNumber.replace(/\D/g, '');

  // Remove leading '1' if present (US country code)
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.slice(1);
  }

  let formatted = rawNumber;
  if (digits.length === 10) {
    const areaCode = digits.slice(0, 3);
    const centralOfficeCode = digits.slice(3, 6);
    const lineNumber = digits.slice(6);
    formatted = `(${areaCode}) ${centralOfficeCode}-${lineNumber}`;
  }

  return <a href={`tel:${digits}`}>{formatted}</a>;
};

export const createEmailLink = (email: string): JSX.Element => {
  return <a href={`mailto:${email}`}>{email}</a>;
};

GlobalWorkerOptions.workerSrc = pdfWorker;

export const getFileInfo = async (file) => {
  const { name, size, type } = file;

  // Convert size to readable format
  const readableSize = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let s = bytes;
    while (s >= 1024 && i < units.length - 1) {
      s /= 1024;
      i++;
    }
    return `${s.toFixed(2)} ${units[i]}`;
  };

  // Get duration for audio/video
  const getMediaDuration = (file) => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const media = document.createElement(type.startsWith('audio') ? 'audio' : 'video');

      media.preload = 'metadata';
      media.src = url;
      media.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(media.duration); // in seconds
      };
      media.onerror = (e) => reject('Cannot load media');
    });
  };
  // Get number of pages in PDF
  const getPdfPageCount = async (file: File): Promise<number> => {
    const typedarray = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocument({ data: typedarray }).promise;
    return pdf.numPages;
  };

  let length = null;
  try {
    if (type.startsWith('audio') || type.startsWith('video')) {
      length = await getMediaDuration(file);
    } else if (type === 'application/pdf') {
      length = await getPdfPageCount(file);
    }
  } catch (err) {
    console.warn('Error getting file length:', err);
  }

  return {
    name,
    size: readableSize(size),
    length,
  };
};

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (!password) return 'weak';
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const mediumRegex = /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,})$/;
  if (strongRegex.test(password)) return 'strong';
  if (mediumRegex.test(password)) return 'medium';
  return 'weak';
}

/**
 * Returns an error message if password does not meet strong requirements, otherwise returns undefined.
 */
export function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  if (!/[@$!%*?&]/.test(password)) return 'Password must contain at least one special character';
  return undefined;
}
export function getContentHeight(mainSelector = 'main'): number {
  // Try to select Ant Design header first, fallback to <header>
  const headerHeight = 68;

  const main = document.querySelector(mainSelector);
  let paddingTop = 0;
  let paddingBottom = 0;
  if (main) {
    const style = window.getComputedStyle(main);
    paddingTop = parseFloat(style.paddingTop) || 0;
    paddingBottom = parseFloat(style.paddingBottom) || 0;
  }
  return window.innerHeight - headerHeight - paddingTop - paddingBottom;
}

export function truncateText(text: string, maxLength: number): JSX.Element | string {
  if (text.length > maxLength) {
    return (
      <Tooltip title={text}>
        <span>{text.slice(0, maxLength) + '...'}</span>
      </Tooltip>
    );
  }
  return text;
}

export function extractOriginalFilename(key: string): string {
  const filename = key.split('/').pop() || '';
  return filename.substring(37); // 36 (UUID) + 1 (hyphen) = 37
}
