/** In production always use same-origin /api - ignore VITE_API_URL from Vercel env. */
const BASE = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || '');

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Production (Vercel): always use MongoDB via same-origin /api.
 * Local dev: set VITE_USE_API=true in .env (optional - uses vite proxy to /api).
 */
export function apiEnabled() {
  return import.meta.env.PROD || import.meta.env.VITE_USE_API === 'true';
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // Destructure so we can merge headers cleanly and guarantee our signal is last.
  const { headers: extraHeaders, ...rest } = options;

  console.log('[api] →', options.method || 'GET', path);
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...rest,
      headers: { 'Content-Type': 'application/json', ...extraHeaders },
      signal: controller.signal,
    });
    console.log('[api] ←', res.status, path);
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
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('[api] timeout after', REQUEST_TIMEOUT_MS, 'ms:', path);
      const timeout = new Error('Request timed out');
      timeout.status = 408;
      throw timeout;
    }
    console.error('[api] error', path, err.status ?? '', err.message);
    throw err;
  } finally {
    clearTimeout(timer);
  }
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

  /* ── User management (Admin only) ── */
  getUsers: () => request('/api/users'),
  createUser: body => request('/api/users', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id, body) => request(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteUser: id => request(`/api/users/${id}`, { method: 'DELETE' }),

  /* ── Analytics dashboard ── */
  getStats: () => request('/api/stats'),
};
