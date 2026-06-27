export const KEYS = {
  opportunities: 'eshkol_opportunities',
  events:        'eshkol_events',
  registrations: 'eshkol_registrations',
  cancellations: 'eshkol_cancellations',
  views:         'eshkol_views',
  session:       'eshkol_session',
  profiles:      'eshkol_profiles',
  theme:         'eshkol_theme',
  currentScreen: 'eshkol_current_screen',
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

export function loadCurrentScreen() {
  return load(KEYS.currentScreen, 'home');
}

export function saveCurrentScreen(screen) {
  save(KEYS.currentScreen, screen);
}
