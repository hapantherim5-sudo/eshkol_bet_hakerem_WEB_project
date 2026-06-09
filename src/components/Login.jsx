import { useState } from 'react';
import { FAKE_USERS } from '../data/fakeData';

const STAFF_USERNAMES = FAKE_USERS.filter(u => u.role === 'Staff').map(u => u.username);
const staffLabel = STAFF_USERNAMES.join(' · ');

function Login({ lang, onLogin, onNavigate }) {
  const isAr = lang === 'ar';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      setError(isAr ? 'يرجى ملء جميع الحقول' : 'יש למלא את כל השדות');
      return;
    }
    const user = FAKE_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      setError('');
      onLogin(user);
    } else {
      setError(isAr ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'שם משתמש או סיסמה שגויים');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">

        <div className="text-center mb-8">
          <img src="https://bkerem.org.il/wp-content/uploads/2023/01/Logo.jpg"
            alt="לוגו" className="h-16 mx-auto mb-4 rounded-lg object-contain" />
          <h2 className="text-2xl font-black text-gray-800">
            {isAr ? 'تسجيل الدخول' : 'כניסה למערכת'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isAr ? 'مركز الفرص — عنقود بيت هكيريم' : 'מרכז ההזדמנויות — אשכול בית הכרם'}
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-6 text-xs text-emerald-800">
          <p className="font-bold mb-1">👤 {isAr ? 'مستخدمو Demo:' : 'משתמשי Demo:'}</p>
          <p>Admin: <code className="bg-white px-1 rounded font-mono">admin</code> / <code className="bg-white px-1 rounded font-mono">1234</code></p>
          <p>{isAr ? 'الموظفون' : 'צוות'} ({isAr ? 'كلمة المرور' : 'סיסמה'} 1234):</p>
          <p className="leading-relaxed">{staffLabel}</p>
          <p>User: <code className="bg-white px-1 rounded font-mono">youth</code> / <code className="bg-white px-1 rounded font-mono">1234</code></p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isAr ? 'اسم المستخدم' : 'שם משתמש'}
            </label>
            <input type="text" value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="משגב / כרמיאל / admin / youth"
              className="w-full px-4 py-3 border border-gray-200 bg-gray-50
                rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isAr ? 'كلمة المرور' : 'סיסמה'}
            </label>
            <input type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="1234"
              className="w-full px-4 py-3 border border-gray-200 bg-gray-50
                rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800" />
          </div>

          <button onClick={handleLogin}
            className="w-full py-3 min-h-[44px] bg-emerald-600 hover:bg-emerald-700
              text-white font-bold rounded-xl transition shadow-md text-base">
            {isAr ? 'دخول' : 'כניסה'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => onNavigate('home')}
            className="text-sm text-gray-500 hover:text-emerald-700 transition">
            {isAr ? '← العودة للرئيسية' : '← חזרה לדף הבית'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;