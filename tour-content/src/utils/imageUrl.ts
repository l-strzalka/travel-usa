import { API_URL } from '../config';

export const BACKEND_URL = API_URL;

export const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return undefined;
  }

  const normalized = imageUrl.trim();

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized;
  }

  if (normalized.startsWith('/uploads/')) {
    return `${BACKEND_URL}${normalized}`;
  }

  return normalized;
};
