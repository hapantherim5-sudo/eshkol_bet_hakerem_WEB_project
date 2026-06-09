import { apiEnabled } from '../lib/services/api';
import { useLocalStore } from './useLocalStore';
import { useApiStore } from './useApiStore';

const USE_API = apiEnabled();

/**
 * MongoDB (via API) when VITE_USE_API=true or VITE_API_URL is set; otherwise localStorage.
 * Env is fixed at build time — safe stable branch for hooks.
 */
export function useDataStore() {
  if (USE_API) return useApiStore();
  return useLocalStore();
}
