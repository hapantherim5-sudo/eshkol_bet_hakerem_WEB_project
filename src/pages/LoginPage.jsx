import { useState } from 'react';
import { api } from '../services/api';
import { CITY_ORG } from '../data/opportunitiesSeed';
import { useT } from '../i18n/i18n';

const staffLabel = Object.keys(CITY_ORG).join(' · ');

function LoginPage({ lang, onLogin, onNavigate }) {
  const t = useT(lang);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    if (!username || !password) {
      setError(t('login_err_fields'));
      return;
    }
    console.log('[login] attempt  username=%s', username);
    setError('');
    setLoading(true);
    try {
      console.log('[login] calling api.login...');
      const user = await api.login(username, password);
      console.log('[login] success  username=%s  role=%s', user?.username, user?.role);
      onLogin(user);
    } catch (e) {
      console.error('[login] failed  status=%s  message=%s', e.status, e.message);
      if (e.status === 401) {
        setError(t('login_err_credentials'));
      } else {
        setError(t('login_err_server'));
      }
    } finally {
      console.log('[login] request done, loading reset');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 relative overflow-hidden">

      <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72
        rounded-full bg-emerald-200/40 animate-blob" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80
        rounded-full bg-teal-200/30 animate-blob" style={{ animationDelay: '4s' }} />
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-40 h-40
        rounded-full bg-violet-200/20 animate-float" />

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

          <div className="bg-gradient-to-l from-emerald-600 to-teal-500 px-6 py-8 text-center">
            <img
              src="https://bkerem.org.il/wp-content/uploads/2023/01/Logo.jpg"
              alt="לוגו"
              className="h-16 mx-auto mb-4 rounded-xl object-contain ring-4 ring-white/30 shadow-lg"
            />
            <h2 className="text-2xl font-black text-white mb-1">{t('login_title')}</h2>
            <p className="text-emerald-100 text-xs font-medium">{t('login_subtitle')}</p>
          </div>

          <div className="px-6 py-6">
            <details className="mb-5 group">
              <summary className="text-xs font-bold text-emerald-700 cursor-pointer select-none
                flex items-center gap-1.5 list-none hover:text-emerald-800 transition">
                <span className="text-base">👤</span>
                {t('login_demo_label')}
                <span className="text-gray-400 mr-auto text-xs group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 space-y-1">
                <p>Admin: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">admin</code> / <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">1234</code></p>
                <p>{t('login_staff_label')} ({t('login_password_label')}: 1234):</p>
                <p className="text-emerald-600 font-medium leading-relaxed">{staffLabel}</p>
                <p className="mt-1">User: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">user1</code> / <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">1234</code></p>
              </div>
            </details>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  👤 {t('login_username_field')}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder={t('login_username_ph')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm
                    focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white
                    transition-all placeholder-gray-400"
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  🔒 {t('login_password_field')}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder={t('login_password_ph')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white
                      transition-all placeholder-gray-400 pl-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition text-base">
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl
                text-sm text-red-700 font-medium flex items-center gap-2">
                <span>⚠️</span>{error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-l from-emerald-600 to-teal-500
                hover:from-emerald-700 hover:to-teal-600 text-white font-black rounded-2xl
                transition-all duration-200 shadow-lg shadow-emerald-100
                hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                disabled:hover:scale-100 text-base mb-3">
              {loading ? t('login_loading') : t('login_btn')}
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="w-full py-2.5 text-sm font-semibold text-gray-500 hover:text-emerald-700
                transition-colors duration-150">
              {t('login_back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;