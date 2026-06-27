import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useT } from '../i18n/i18n';

function RegisterPage({ lang, onNavigate }) {
  const t = useT(lang);
  const [name,     setName    ] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm ] = useState('');
  const [showPw,   setShowPw  ] = useState(false);
  const [error,    setError   ] = useState('');
  const [success,  setSuccess ] = useState(false);
  const [loading,  setLoading ] = useState(false);
  const redirectTimer = useRef(null);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const handleRegister = async () => {
    if (loading) return;
    if (!name.trim() || !username.trim() || !password.trim() || !confirm.trim()) {
      setError(t('signup_err_fields'));
      return;
    }
    if (password !== confirm) {
      setError(t('signup_err_passwords'));
      return;
    }
    if (password.trim().length < 4) {
      setError(t('signup_err_short_pw'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.registerUser(name.trim(), username.trim(), password.trim());
      setSuccess(true);
      redirectTimer.current = setTimeout(() => onNavigate('login'), 2200);
    } catch (e) {
      if (e.status === 409) {
        setError(t('signup_err_taken'));
      } else if (e.status === 408) {
        setError(lang === 'ar' ? 'انتهت المهلة، حاول مجدداً' : 'פסק זמן, נסה שוב');
      } else {
        setError(t('signup_err_server'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page min-h-screen flex items-center justify-center px-4
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
            <h2 className="text-2xl font-black text-white mb-1">{t('signup_title')}</h2>
            <p className="text-emerald-100 text-xs font-medium">{t('signup_subtitle')}</p>
          </div>

          <div className="px-6 py-6">
            {success ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-emerald-700 font-black text-lg mb-2">{t('signup_success')}</p>
                <p className="text-gray-400 text-sm">{t('signup_redirect')}</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      👤 {t('signup_name_field')}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleRegister()}
                      placeholder={t('signup_name_ph')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm
                        focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white
                        transition-all placeholder-gray-400"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      🔤 {t('signup_username_field')}
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleRegister()}
                      placeholder={t('signup_username_ph')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm
                        focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white
                        transition-all placeholder-gray-400"
                      autoComplete="username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      🔒 {t('signup_password_field')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleRegister()}
                        placeholder={t('signup_password_ph')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm
                          focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white
                          transition-all placeholder-gray-400 pl-10"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(p => !p)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400
                          hover:text-gray-600 transition text-base">
                        {showPw ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      🔒 {t('signup_confirm_field')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleRegister()}
                        placeholder={t('signup_confirm_ph')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm
                          focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white
                          transition-all placeholder-gray-400 pl-10"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(p => !p)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400
                          hover:text-gray-600 transition text-base">
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
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-l from-emerald-600 to-teal-500
                    hover:from-emerald-700 hover:to-teal-600 text-white font-black rounded-2xl
                    transition-all duration-200 shadow-lg shadow-emerald-100
                    hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                    disabled:hover:scale-100 text-base mb-3">
                  {loading ? t('signup_loading') : t('signup_btn')}
                </button>

                <button
                  onClick={() => onNavigate('login')}
                  className="w-full py-2.5 text-sm font-semibold text-emerald-600
                    hover:text-emerald-700 transition-colors duration-150 text-center">
                  {t('signup_have_account')} {t('signup_login_link')}
                </button>

                <button
                  onClick={() => onNavigate('home')}
                  className="w-full py-2 text-sm font-semibold text-gray-500
                    hover:text-emerald-700 transition-colors duration-150">
                  {t('signup_back_home')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
