import { apiEnabled } from '../services/api';
import { useLocalStore } from './useLocalStore';
import { useApiStore } from './useApiStore';

// Resolved once at module load (build-time constant). Exporting the hook
// function directly means React always calls the exact same hook - no
// conditional hook calls, no rules-of-hooks violation.
export const useDataStore = apiEnabled() ? useApiStore : useLocalStore;
