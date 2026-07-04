// File: src/utils/storage.js
// Purpose: storage script
// Role: utility module for storage

const KEYS = {
  session: 'eshkol_session',
  theme: 'eshkol_theme',
  currentScreen: 'eshkol_current_screen',
};

// load — handles load
function load(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// save — handles save
function save(storage, key, value) {
  storage.setItem(key, JSON.stringify(value));
}

export function loadSession() {
  const session = load(sessionStorage, KEYS.session, null);
  return session?.user && session?.token ? session : null;
}

export function saveSession(session) {
  if (session?.user && session?.token) save(sessionStorage, KEYS.session, session);
  else sessionStorage.removeItem(KEYS.session);
}

// loadTheme — handles loadTheme
export function loadTheme() {
  return load(localStorage, KEYS.theme, '');
}

// saveTheme — handles saveTheme
export function saveTheme(theme) {
  save(localStorage, KEYS.theme, theme);
}

export function loadCurrentScreen() {
  return load(sessionStorage, KEYS.currentScreen, 'home');
}

export function saveCurrentScreen(screen) {
  save(sessionStorage, KEYS.currentScreen, screen);
}
