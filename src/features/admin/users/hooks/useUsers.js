import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../../services/api';

export function useUsers({ onLoadError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setUsers(await api.getUsers());
    } catch (error) {
      setLoadError(error);
      onLoadError(error);
    } finally {
      setLoading(false);
    }
  }, [onLoadError]);

  useEffect(() => {
    const timer = window.setTimeout(reload, 0);
    return () => window.clearTimeout(timer);
  }, [reload]);

  const createUser = useCallback(async data => {
    await api.createUser(data);
    await reload();
  }, [reload]);

  const updateUser = useCallback(async (id, data) => {
    await api.updateUser(id, data);
    await reload();
  }, [reload]);

  const deleteUser = useCallback(async id => {
    await api.deleteUser(id);
    await reload();
  }, [reload]);

  return { users, loading, loadError, reload, createUser, updateUser, deleteUser };
}
