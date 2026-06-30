import { apiClient } from './client';
import type { CurrentUserResponse } from '@/features/org/types';

export function getMe(token: string | null, signal?: AbortSignal) {
  return apiClient.get<CurrentUserResponse>('/me', { signal, token });
}
