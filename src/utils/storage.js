// File: src/utils/storage.js
// Purpose: storage script
// Role: utility module for storage

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

// load — handles load
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// save — handles save
export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// loadSession — handles loadSession
export function loadSession() {
  return load(KEYS.session, null);
}

// saveSession — handles saveSession
export function saveSession(user) {
  if (user) save(KEYS.session, user);
  else localStorage.removeItem(KEYS.session);
}

// loadTheme — handles loadTheme
export function loadTheme() {
  return load(KEYS.theme, '');
}

// saveTheme — handles saveTheme
export function saveTheme(theme) {
  save(KEYS.theme, theme);
}

// loadCurrentScreen — handles loadCurrentScreen
export function loadCurrentScreen() {
  return load(KEYS.currentScreen, 'home');
}

// saveCurrentScreen — handles saveCurrentScreen
export function saveCurrentScreen(screen) {
  save(KEYS.currentScreen, screen);
}
