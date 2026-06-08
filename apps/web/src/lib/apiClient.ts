import { type HealthStatus } from '@decathlon/shared';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export const apiClient = {
  getHealth: () => getJson<HealthStatus>('/health'),
};
