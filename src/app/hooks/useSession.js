import { useCallback, useState } from 'react';
import { loadSession, saveSession } from '../../utils/storage';

export function useSession() {
  const [currentUser, setCurrentUser] = useState(() => loadSession()?.user || null);

  const signIn = useCallback(session => {
    setCurrentUser(session.user);
    saveSession(session);
  }, []);

  const signOut = useCallback(() => {
    setCurrentUser(null);
    saveSession(null);
  }, []);

  return { currentUser, signIn, signOut };
}
