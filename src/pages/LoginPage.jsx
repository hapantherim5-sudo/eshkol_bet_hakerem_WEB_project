import { useState } from 'react';
import { api } from '../services/api';
import { CITY_ORG } from '../data/opportunitiesSeed';

const staffLabel = Object.keys(CITY_ORG).join(' · ');

function LoginPage({ lang, onLogin, onNavigate }) {
  const isAr = lang === 'ar';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    if (!username || !password) {
      setError(isAr ? 'يرجى ملء جميع الحقول' : 'יש למלא את כל השדות');
      return;
    }
    setLoading(true);
    try {
      const user = await api.login(username, password);
      setError('');
      onLogin(user);
    } catch (e) {
      if (e.status === 401) {
        setError(isAr ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'שם משתמש או סיסמה שגויים');
      } else {
        setError(isAr ? 'خطأ في الخادم، حاول مجدداً' : 'שגיאת שרת, נסה שוב');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72
        rounded-full bg-emerald-200/40 animate-blob" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80
        rounded-full bg-teal-200/30 animate-blob" style={{ animationDelay: '4s' }} />
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-40 h-40
        rounded-full bg-violet-200/20 animate-float" />

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Card header strip */}
          <div className="bg-gradient-to-l from-emerald-600 to-teal-500 px-6 py-8 text-center">
            <img
              src="https://bkerem.org.il/wp-content/uploads/2023/01/Logo.jpg"
              alt="לוגו"
              className="h-16 mx-auto mb-4 rounded-xl object-contain
                ring-4 ring-white/30 shadow-lg"
            />
            <h2 className="text-2xl font-black text-white mb-1">
              {isAr ? 'تسجيل الدخول' : 'כניסה למערכת'}
            </h2>
            <p className="text-emerald-100 text-xs font-medium">
              {isAr ? 'مركز الفرص — عنقود بيت هكيريم' : 'מרכז ההזדמנויות — אשכול בית הכרם'}
            </p>
          </div>

          <div className="px-6 py-6">
            {/* Demo credentials */}
            <details className="mb-5 group">
              <summary className="text-xs font-bold text-emerald-700 cursor-pointer select-none
                flex items-center gap-1.5 list-none hover:text-emerald-800 transition">
                <span className="text-base">👤</span>
                {isAr ? 'بيانات Demo (انقر للعرض)' : 'משתמשי Demo (לחץ לפתוח)'}
                <span className="text-gray-400 mr-auto text-xs group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 space-y-1">
                <p>Admin: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">admin</code> / <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">1234</code></p>
                <p>{isAr ? 'الموظفون' : 'צוות'} ({isAr ? 'كلمة المرور' : 'סיסמה'}: 1234):</p>
                <p className="leading-relaxed text-emerald-600">{staffLabel}</p>
                <p>User: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">youth</code> / <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">1234</code></p>
              </div>
            </details>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700
                flex items-center gap-2 animate-fade-in">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {isAr ? 'اسم المستخدم' : 'שם משתמש'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder={isAr ? 'أدخل اسم المستخدم' : 'הכנס שם משתמש'}
                  className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-xl
                    focus:outline-none focus:border-emerald-500 focus:bg-white text-gray-800
                    transition-all duration-150 text-sm placeholder-gray-400" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {isAr ? 'كلمة المرور' : 'סיסמה'}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="••••"
                    className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-xl
                      focus:outline-none focus:border-emerald-500 focus:bg-white text-gray-800
                      transition-all duration-150 text-sm" />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm transition">
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3.5 min-h-[44px] bg-emerald-600 hover:bg-emerald-700
                  text-white font-black rounded-2xl transition-all duration-150
                  hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-100 text-base
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100">
                {loading ? (isAr ? 'جارٍ الدخول...' : 'מתחבר...') : (isAr ? 'دخول ←' : 'כניסה ←')}
              </button>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={() => onNavigate('home')}
                className="text-sm text-gray-400 hover:text-emerald-700 transition font-medium">
                {isAr ? '→ العودة للرئيسية' : '→ חזרה לדף הבית'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
