import DOMPurify from 'dompurify';

export const sanitizeInput = (value: string): string => {
  const clean = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  const temp = document.createElement('div');
  temp.innerHTML = clean;

  return temp.textContent || '';
};
