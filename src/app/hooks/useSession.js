import { useCallback, useState } from 'react';
import { loadSession, saveSession } from '../../utils/storage';

export function useSession() {
  const [currentUser, setCurrentUser] = useState(() => loadSession());

  const signIn = useCallback(user => {
    setCurrentUser(user);
    saveSession(user);
  }, []);

  const signOut = useCallback(() => {
    setCurrentUser(null);
    saveSession(null);
  }, []);

  return { currentUser, signIn, signOut };
}
