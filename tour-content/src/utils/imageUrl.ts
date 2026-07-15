export const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
