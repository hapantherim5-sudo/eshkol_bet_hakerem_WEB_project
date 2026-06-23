export const KEYS = {
  opportunities: 'eshkol_opportunities',
  events:        'eshkol_events',
  registrations: 'eshkol_registrations',
  cancellations: 'eshkol_cancellations',
  views:         'eshkol_views',
  session:       'eshkol_session',
  profiles:      'eshkol_profiles',
  theme:         'eshkol_theme',
};

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
