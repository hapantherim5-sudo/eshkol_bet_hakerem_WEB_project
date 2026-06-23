import { useState } from 'react';
import { CATEGORIES, OPPORTUNITY_TYPES, STATUSES } from '../../data/fakeData';
import { ORGANIZATIONS } from '../../data/organizations';
import { pick } from '../../i18n/i18n';
import { buildCalendarEvents } from '../../utils/scheduleEvents';
import DateInputIL from '../DateInputIL';

const empty = (defaults = {}) => ({
  icon: '✨', title: '', titleAr: '', category: 'sport', categoryLabel: 'ספורט',
  type: 'חוג', scope: 'יישובי', city: '', organizationId: '',
  ageMin: 12, ageMax: 18, time: '',
  description: '', descriptionAr: '', contact: '', phone: '',
  registration: 'טלפון', registrationAr: 'هاتف', status: 'פתוח',
  startDate: '', endDate: '',
  ...defaults,
});

function OpportunityForm({ lang, initial, user, onSave, onCancel }) {
  const isAr = lang === 'ar';
  const [form, setForm] = useState(() => empty({
    organizationId: user.role === 'Staff' ? user.organizationId : (initial?.organizationId || ''),
    ...initial,
    startDate: initial?.startDate || '',
    endDate: initial?.endDate || '',
  }));
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const orgOptions = user.role === 'Staff'
    ? ORGANIZATIONS.filter(o => o.id === user.organizationId)
    : ORGANIZATIONS;

  const handleSubmit = () => {
    if (!form.title || !form.titleAr || !form.organizationId || !form.city) {
      setErr(pick(isAr, 'יש למלא שדות חובה', 'يرجى ملء الحقول المطلوبة'));
      return;
    }
    const cat = CATEGORIES.find(c => c.id === form.category);
    const payload = { ...form, categoryLabel: cat?.label || form.categoryLabel };

    if (form.startDate) {
      if (form.endDate && form.endDate < form.startDate) {
        setErr(pick(isAr, 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה', 'يجب أن يكون تاريخ النهاية بعد البداية'));
        return;
      }
      const calendarEvents = buildCalendarEvents(payload);
      onSave(payload, calendarEvents.length ? calendarEvents : null);
      return;
    }

    onSave(payload, null);
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none';
  const label = (he, ar) => pick(isAr, he, ar);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      {err && <p className="text-sm text-red-600 mb-3">{err}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500">{label('כותרת (עברית)', 'العنوان (عبري)')}</label>
          <input className={inputClass} value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('כותרת (ערבית)', 'العنوان (عربي)')}</label>
          <input className={inputClass} value={form.titleAr} onChange={e => set('titleAr', e.target.value)} dir="rtl" />
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('ארגון מפעיל', 'الجهة المشغلة')}</label>
          <select className={inputClass} value={form.organizationId} onChange={e => set('organizationId', e.target.value)}
            disabled={user.role === 'Staff'}>
            <option value="">{label('בחר', 'اختر')}</option>
            {orgOptions.map(o => (
              <option key={o.id} value={o.id}>{isAr ? o.nameAr : o.nameHe}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('יישוב', 'البلدة')}</label>
          <input className={inputClass} value={form.city} onChange={e => set('city', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('קטגוריה', 'الفئة')}</label>
          <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {isAr ? c.labelAr : c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('סוג', 'النوع')}</label>
          <select className={inputClass} value={form.type} onChange={e => set('type', e.target.value)}>
            {OPPORTUNITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('היקף', 'النطاق')}</label>
          <select className={inputClass} value={form.scope} onChange={e => set('scope', e.target.value)}>
            <option value="יישובי">{label('יישובי', 'بلدي')}</option>
            <option value="אזורי">{label('אזורי', 'إقليمي')}</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('סטטוס', 'الحالة')}</label>
          <select className={inputClass} value={form.status} onChange={e => set('status', e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('גיל מינימום', 'العمر الأدنى')}</label>
          <input type="number" className={inputClass} value={form.ageMin} onChange={e => set('ageMin', +e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('גיל מקסימום', 'العمر الأقصى')}</label>
          <input type="number" className={inputClass} value={form.ageMax} onChange={e => set('ageMax', +e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('שעת התחלה', 'وقت البداية')}</label>
          <input type="time" className={inputClass} value={form.time} onChange={e => set('time', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('תאריך התחלה', 'تاريخ البداية')}</label>
          <DateInputIL lang={lang} className={inputClass} value={form.startDate}
            onChange={v => set('startDate', v)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('תאריך סיום', 'تاريخ النهاية')}</label>
          <DateInputIL lang={lang} className={inputClass} value={form.endDate}
            onChange={v => set('endDate', v)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500">{label('תיאור', 'الوصف')}</label>
          <textarea className={inputClass} rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('איש קשר', 'جهة الاتصال')}</label>
          <input className={inputClass} value={form.contact} onChange={e => set('contact', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{label('טלפון', 'الهاتف')}</label>
          <input className={inputClass} value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          {label('ביטול', 'إلغاء')}
        </button>
        <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">
          {label('שמור', 'حفظ')}
        </button>
      </div>
    </div>
  );
}

export default OpportunityForm;
