import { useCallback } from 'react';
import { api } from '../../../services/api';

export function useAuthActions() {
  const login = useCallback((username, password) => api.login(username, password), []);
  const register = useCallback(
    (name, username, password) => api.registerUser(name, username, password),
    []
  );

  return { login, register };
}
