// File: src/components/staff/OpportunityForm.jsx
// Purpose: OpportunityForm component
// Role: React component for OpportunityForm

import { useState } from 'react';
import {
  CATEGORIES, DEFAULT_REGISTRATION, OPPORTUNITY_SCOPES, OPPORTUNITY_TYPES, STATUSES,
} from '../../data/opportunityOptions';
import { ORGANIZATIONS, getOrgName } from '../../data/organizations';
import { useT } from '../../i18n/i18n';
import { buildCalendarEvents } from '../../utils/scheduleEvents';
import DateInputIL from '../DateInputIL';

// empty — handles empty
const empty = (defaults = {}) => ({
  icon: '✨', title: '', titleAr: '', category: 'sport', categoryLabel: '',
  type: OPPORTUNITY_TYPES[0].value, scope: OPPORTUNITY_SCOPES[0].value, city: '', organizationId: '',
  ageMin: 12, ageMax: 18, time: '',
  description: '', descriptionAr: '', contact: '', phone: '',
  registration: DEFAULT_REGISTRATION.he, registrationAr: DEFAULT_REGISTRATION.ar, status: STATUSES[0].value,
  startDate: '', endDate: '',
  ...defaults,
});

// OpportunityForm — renders OpportunityForm
function OpportunityForm({ lang, initial, user, onSave, onCancel }) {
  const isAr = lang === 'ar';
  const t = useT(lang);
  const [form, setForm] = useState(() => empty({
    organizationId: user.role === 'Staff' ? user.organizationId : (initial?.organizationId || ''),
    ...initial,
    startDate: initial?.startDate || '',
    endDate: initial?.endDate || '',
  }));
  const [err, setErr] = useState('');

  // set — handles set
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const orgOptions = user.role === 'Staff'
    ? ORGANIZATIONS.filter(o => o.id === user.organizationId)
    : ORGANIZATIONS;

  // handleSubmit — handles Submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.titleAr.trim() || !form.organizationId || !form.city.trim()) {
      setErr(t('admin_opportunity_required_error'));
      return;
    }
    const payload = { ...form };

    if (form.startDate) {
      if (form.endDate && form.endDate < form.startDate) {
        setErr(t('admin_opportunity_date_error'));
        return;
      }
      const calendarEvents = buildCalendarEvents(payload);
      onSave(payload, calendarEvents.length ? calendarEvents : null);
      return;
    }

    onSave(payload, null);
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none';
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <p className="mb-4 text-xs text-gray-500">
        <span className="font-black text-red-500" aria-hidden="true">*</span>{' '}
        {t('admin_opportunity_required_note')}
      </p>
      {err && <p role="alert" className="text-sm text-red-600 mb-3">{err}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="opportunity-title" className="text-xs text-gray-500">{t('admin_opportunity_title_he')} <span className="font-black text-red-500" aria-hidden="true">*</span></label>
          <input id="opportunity-title" required className={inputClass} value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div>
          <label htmlFor="opportunity-title-ar" className="text-xs text-gray-500">{t('admin_opportunity_title_ar')} <span className="font-black text-red-500" aria-hidden="true">*</span></label>
          <input id="opportunity-title-ar" required className={inputClass} value={form.titleAr} onChange={e => set('titleAr', e.target.value)} dir="rtl" />
        </div>
        <div>
          <label htmlFor="opportunity-organization" className="text-xs text-gray-500">{t('admin_opportunity_organization')} <span className="font-black text-red-500" aria-hidden="true">*</span></label>
          <select id="opportunity-organization" required className={inputClass} value={form.organizationId} onChange={e => set('organizationId', e.target.value)}
            disabled={user.role === 'Staff'}>
            <option value="">{t('admin_select')}</option>
            {orgOptions.map(o => (
              <option key={o.id} value={o.id}>{getOrgName(o.id, isAr)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="opportunity-city" className="text-xs text-gray-500">{t('admin_opportunity_city')} <span className="font-black text-red-500" aria-hidden="true">*</span></label>
          <input id="opportunity-city" required className={inputClass} value={form.city} onChange={e => set('city', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_category')}</label>
          <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {t(c.labelKey)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_type')}</label>
          <select className={inputClass} value={form.type} onChange={e => set('type', e.target.value)}>
            {OPPORTUNITY_TYPES.map(type => <option key={type.value} value={type.value}>{t(type.labelKey)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_scope')}</label>
          <select className={inputClass} value={form.scope} onChange={e => set('scope', e.target.value)}>
            {OPPORTUNITY_SCOPES.map(scope => <option key={scope.value} value={scope.value}>{t(scope.labelKey)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_status')}</label>
          <select className={inputClass} value={form.status} onChange={e => set('status', e.target.value)}>
            {STATUSES.map(status => <option key={status.value} value={status.value}>{t(status.labelKey)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_age_min')}</label>
          <input type="number" className={inputClass} value={form.ageMin} onChange={e => set('ageMin', +e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_age_max')}</label>
          <input type="number" className={inputClass} value={form.ageMax} onChange={e => set('ageMax', +e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_start_time')}</label>
          <input type="time" className={inputClass} value={form.time} onChange={e => set('time', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_start_date')}</label>
          <DateInputIL lang={lang} className={inputClass} value={form.startDate}
            onChange={v => set('startDate', v)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_end_date')}</label>
          <DateInputIL lang={lang} className={inputClass} value={form.endDate}
            onChange={v => set('endDate', v)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500">{t('admin_opportunity_description_he')}</label>
          <textarea className={inputClass} rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500">{t('admin_opportunity_description_ar')}</label>
          <textarea className={inputClass} rows={2} dir="rtl" value={form.descriptionAr} onChange={e => set('descriptionAr', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_emoji')}</label>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{form.icon || '✨'}</span>
            <input className={inputClass} maxLength={2} value={form.icon}
              placeholder="✨" onChange={e => set('icon', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_contact')}</label>
          <input className={inputClass} value={form.contact} onChange={e => set('contact', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('admin_opportunity_phone')}</label>
          <input className={inputClass} value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          {t('cancel')}
        </button>
        <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">
          {t('admin_save')}
        </button>
      </div>
    </form>
  );
}

export default OpportunityForm;
