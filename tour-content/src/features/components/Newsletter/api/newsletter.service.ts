import axios from 'axios';
import { API_URL } from '@/config';

export interface SubscriptionResponse {
  message: string;
}

export interface SubscribePayload {
  email: string;
  marketingConsent: boolean;
}

export const subscribeToNewsletter = async (
  payload: SubscribePayload,
): Promise<SubscriptionResponse> => {
  const response = await axios.post<SubscriptionResponse>(
    `${API_URL}/newsletter/subscribe`,
    payload,
  );
  return response.data;
};
