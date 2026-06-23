import { useState, useCallback } from 'react';
import { KEYS, load, save } from '../utils/storage';
import { INITIAL_OPPORTUNITIES, INITIAL_EVENTS } from '../data/fakeData';

function maxId(items) {
  return items.length ? Math.max(...items.map(x => x.id)) + 1 : 1;
}

let nextOppId = maxId(INITIAL_OPPORTUNITIES);
let nextEventId = maxId(INITIAL_EVENTS);
let nextRegId = 1;
let nextCancelId = 1;

// Backfill organizationId for data saved before this field existed
function migrateOpportunities(list) {
  const seedById = Object.fromEntries(INITIAL_OPPORTUNITIES.map(o => [o.id, o]));
  return list.map(o =>
    o.organizationId ? o : { ...o, organizationId: seedById[o.id]?.organizationId || 'youth-karmiel' }
  );
}

function initOpportunities() {
  const stored = load(KEYS.opportunities, null);
  if (stored) {
    if (stored.some(o => !o.organizationId)) {
      const migrated = migrateOpportunities(stored);
      save(KEYS.opportunities, migrated);
      return migrated;
    }
    return stored;
  }
  save(KEYS.opportunities, INITIAL_OPPORTUNITIES);
  return INITIAL_OPPORTUNITIES;
}

function initEvents() {
  const stored = load(KEYS.events, null);
  if (stored) return stored;
  save(KEYS.events, INITIAL_EVENTS);
  return INITIAL_EVENTS;
}

export function useLocalStore() {
  const [opportunities, setOpportunities] = useState(initOpportunities);
  const [events, setEvents] = useState(initEvents);
  const [registrations, setRegistrations] = useState(() => load(KEYS.registrations, []));
  const [cancellations, setCancellations] = useState(() => {
    const list = load(KEYS.cancellations, []);
    nextCancelId = maxId(list);
    return list;
  });
  const [views, setViews] = useState(() => load(KEYS.views, []));
  const [profiles, setProfiles] = useState(() => load(KEYS.profiles, {}));

  const persistOpps = useCallback(list => {
    setOpportunities(list);
    save(KEYS.opportunities, list);
    nextOppId = maxId(list);
  }, []);

  const persistEvents = useCallback(list => {
    setEvents(list);
    save(KEYS.events, list);
    nextEventId = maxId(list);
  }, []);

  const addOpportunity = useCallback(opp => {
    const item = { ...opp, id: nextOppId++ };
    const list = [...opportunities, item];
    persistOpps(list);
    return item;
  }, [opportunities, persistOpps]);

  const updateOpportunity = useCallback(opp => {
    const list = opportunities.map(o => o.id === opp.id ? opp : o);
    persistOpps(list);
  }, [opportunities, persistOpps]);

  const deleteOpportunity = useCallback(id => {
    persistOpps(opportunities.filter(o => o.id !== id));
    const evList = events.filter(e => e.opportunityId !== id);
    persistEvents(evList);
  }, [opportunities, events, persistOpps, persistEvents]);

  const addEvent = useCallback(ev => {
    const item = { ...ev, id: nextEventId++ };
    const list = [...events, item];
    persistEvents(list);
    return item;
  }, [events, persistEvents]);

  const deleteEvent = useCallback(id => {
    persistEvents(events.filter(e => e.id !== id));
  }, [events, persistEvents]);

  const replaceEventsForOpportunity = useCallback((opportunityId, eventDefs) => {
    const without = events.filter(e => e.opportunityId !== opportunityId);
    const added = eventDefs.map(def => ({ ...def, id: nextEventId++, opportunityId }));
    persistEvents([...without, ...added]);
  }, [events, persistEvents]);

  const recordView = useCallback((opportunityId, userId) => {
    const uid = userId ?? null;
    if (views.some(v => v.opportunityId === opportunityId && v.userId === uid)) return;
    const entry = { opportunityId, userId: uid, viewedAt: new Date().toISOString() };
    const list = [...views, entry];
    setViews(list);
    save(KEYS.views, list);
  }, [views]);

  const register = useCallback((userId, opportunityId, profilePatch) => {
    if (registrations.some(r => r.userId === userId && r.opportunityId === opportunityId)) {
      return { ok: false, reason: 'duplicate' };
    }
    const reg = { id: nextRegId++, userId, opportunityId, createdAt: new Date().toISOString() };
    const list = [...registrations, reg];
    setRegistrations(list);
    save(KEYS.registrations, list);
    if (profilePatch) {
      const next = { ...profiles, [userId]: { ...profiles[userId], ...profilePatch } };
      setProfiles(next);
      save(KEYS.profiles, next);
    }
    return { ok: true };
  }, [registrations, profiles]);

  const isRegistered = useCallback((userId, opportunityId) => {
    return registrations.some(r => r.userId === userId && r.opportunityId === opportunityId);
  }, [registrations]);

  const unregister = useCallback((userId, opportunityId) => {
    const exists = registrations.some(
      r => r.userId === userId && r.opportunityId === opportunityId
    );
    if (!exists) return { ok: false, reason: 'not_found' };

    const list = registrations.filter(
      r => !(r.userId === userId && r.opportunityId === opportunityId)
    );
    setRegistrations(list);
    save(KEYS.registrations, list);

    const cancelEntry = {
      id: nextCancelId++,
      userId,
      opportunityId,
      cancelledAt: new Date().toISOString(),
    };
    const cancelList = [...cancellations, cancelEntry];
    setCancellations(cancelList);
    save(KEYS.cancellations, cancelList);
    return { ok: true };
  }, [registrations, cancellations]);

  const getProfile = useCallback(userId => profiles[userId] || null, [profiles]);

  return {
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

// Session helpers (used by App)
export function loadSession() {
  return load(KEYS.session, null);
}

export function saveSession(user) {
  if (user) save(KEYS.session, user);
  else localStorage.removeItem(KEYS.session);
}

export function loadTheme() {
  return load(KEYS.theme, '');
}

export function saveTheme(theme) {
  save(KEYS.theme, theme);
}
