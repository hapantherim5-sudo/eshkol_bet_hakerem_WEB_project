const BASE = import.meta.env.VITE_API_URL || '';

export function apiEnabled() {
  return Boolean(BASE);
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = new Error(res.statusText || 'API error');
    err.status = res.status;
    try {
      err.body = await res.json();
    } catch {
      /* ignore */
    }
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  health: () => request('/api/health'),
  bootstrap: () => request('/api/bootstrap'),
  login: (username, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  addOpportunity: body =>
    request('/api/opportunities', { method: 'POST', body: JSON.stringify(body) }),
  updateOpportunity: opp =>
    request(`/api/opportunities/${opp.id}`, { method: 'PUT', body: JSON.stringify(opp) }),
  deleteOpportunity: id => request(`/api/opportunities/${id}`, { method: 'DELETE' }),
  addEvent: body => request('/api/events', { method: 'POST', body: JSON.stringify(body) }),
  deleteEvent: id => request(`/api/events/${id}`, { method: 'DELETE' }),
  replaceEventsForOpportunity: (opportunityId, eventDefs) =>
    request(`/api/events/by-opportunity/${opportunityId}`, {
      method: 'PUT',
      body: JSON.stringify({ eventDefs }),
    }),
  recordView: (opportunityId, userId) =>
    request('/api/views', {
      method: 'POST',
      body: JSON.stringify({ opportunityId, userId: userId ?? null }),
    }),
  register: (userId, opportunityId, profilePatch) =>
    request('/api/registrations', {
      method: 'POST',
      body: JSON.stringify({ userId, opportunityId, profilePatch }),
    }),
  unregister: (userId, opportunityId) =>
    request('/api/registrations', {
      method: 'DELETE',
      body: JSON.stringify({ userId, opportunityId }),
    }),
  getProfile: userId => request(`/api/profiles/${userId}`),
};
