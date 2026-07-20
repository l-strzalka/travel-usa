const defaultApiUrl = import.meta.env.PROD
  ? 'https://travel-usa-self.vercel.app'
  : 'http://localhost:3000';

export const API_URL = import.meta.env.VITE_API_URL ?? defaultApiUrl;
export const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL ?? 'https://travel-usa-p2t7.vercel.app';
