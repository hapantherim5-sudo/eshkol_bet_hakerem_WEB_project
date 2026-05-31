import { useState, useCallback, useEffect } from 'react';
import { api, apiEnabled } from '../lib/api';
import { KEYS, load, save } from '../lib/storage';
import { INITIAL_OPPORTUNITIES, INITIAL_EVENTS } from '../data/fakeData';

/**
 * Same interface as useLocalStore, backed by MongoDB via Express API.
 * Enable with VITE_API_URL in .env at project root.
 */
export function useApiStore() {
  const [ready, setReady] = useState(false);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [registrations, setRegistrations] = useState([]);
  const [cancellations, setCancellations] = useState([]);
  const [views, setViews] = useState([]);
  const [profiles, setProfiles] = useState({});

  useEffect(() => {
    if (!apiEnabled()) {
      setReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await api.bootstrap();
        if (cancelled) return;
        setOpportunities(data.opportunities);
        setEvents(data.events);
        setRegistrations(data.registrations);
        setCancellations(data.cancellations);
        setViews(data.views);
        setProfiles(data.profiles || {});
      } catch (e) {
        console.error('API bootstrap failed, using local seed:', e);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addOpportunity = useCallback(async opp => {
    const item = await api.addOpportunity(opp);
    setOpportunities(prev => [...prev, item]);
    return item;
  }, []);

  const updateOpportunity = useCallback(async opp => {
    const item = await api.updateOpportunity(opp);
    setOpportunities(prev => prev.map(o => (o.id === item.id ? item : o)));
  }, []);

  const deleteOpportunity = useCallback(async id => {
    await api.deleteOpportunity(id);
    setOpportunities(prev => prev.filter(o => o.id !== id));
    setEvents(prev => prev.filter(e => e.opportunityId !== id));
  }, []);

  const addEvent = useCallback(async ev => {
    const item = await api.addEvent(ev);
    setEvents(prev => [...prev, item]);
    return item;
  }, []);

  const deleteEvent = useCallback(async id => {
    await api.deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const replaceEventsForOpportunity = useCallback(async (opportunityId, eventDefs) => {
    const added = await api.replaceEventsForOpportunity(opportunityId, eventDefs);
    setEvents(prev => [...prev.filter(e => e.opportunityId !== opportunityId), ...added]);
  }, []);

  const recordView = useCallback(async (opportunityId, userId) => {
    const uid = userId ?? null;
    if (views.some(v => v.opportunityId === opportunityId && v.userId === uid)) return;
    await api.recordView(opportunityId, uid);
    const entry = { opportunityId, userId: uid, viewedAt: new Date().toISOString() };
    setViews(prev => [...prev, entry]);
  }, [views]);

  const register = useCallback(async (userId, opportunityId, profilePatch) => {
    try {
      const result = await api.register(userId, opportunityId, profilePatch);
      setRegistrations(prev => [...prev, result.registration]);
      if (profilePatch) {
        setProfiles(prev => ({
          ...prev,
          [userId]: { ...prev[userId], ...profilePatch },
        }));
      }
      return { ok: true };
    } catch (e) {
      if (e.status === 409) return { ok: false, reason: 'duplicate' };
      throw e;
    }
  }, []);

  const isRegistered = useCallback(
    (userId, opportunityId) =>
      registrations.some(r => r.userId === userId && r.opportunityId === opportunityId),
    [registrations]
  );

  const unregister = useCallback(async (userId, opportunityId) => {
    try {
      await api.unregister(userId, opportunityId);
      setRegistrations(prev =>
        prev.filter(r => !(r.userId === userId && r.opportunityId === opportunityId))
      );
      return { ok: true };
    } catch (e) {
      if (e.status === 404) return { ok: false, reason: 'not_found' };
      throw e;
    }
  }, []);

  const getProfile = useCallback(userId => profiles[userId] || null, [profiles]);

  return {
    ready,
    opportunities,
    events,
    registrations,
    cancellations,
    views,
    profiles,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    addEvent,
    deleteEvent,
    replaceEventsForOpportunity,
    recordView,
    register,
    unregister,
    isRegistered,
    getProfile,
  };
}
