// File: src/components/RegistrationModal.jsx
// Purpose: RegistrationModal component
// Role: React component for RegistrationModal

import { useState } from 'react';
import { CATEGORIES } from '../../../data/opportunityOptions';
import { useT } from '../../../i18n/i18n';
import { getOpportunityDisplaySchedule } from '../../../utils/opportunitySchedule';

// RegistrationModal — renders RegistrationModal
function RegistrationModal({ opportunity, lang, profile, onConfirm, onClose }) {
  const t = useT(lang);
  const isAr = lang === 'ar';
  const needsProfile = !profile?.settlement;
  const schedule = getOpportunityDisplaySchedule(opportunity);

  const [settlement, setSettlement] = useState(profile?.settlement || '');
  const [interests, setInterests]   = useState(profile?.interests || []);
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleInterest = id => {
    setInterests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // handleConfirm — handles Confirm
  const handleConfirm = async () => {
    if (submitting) return;
    if (needsProfile && !settlement.trim()) {
      setValidationError(t('reg_city_required'));
      return;
    }

    setValidationError('');
    setSubmitting(true);
    try {
      await onConfirm(needsProfile ? { settlement: settlement.trim(), interests } : null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full shadow-2xl
          max-h-[90dvh] overflow-y-auto animate-slide-up">

        <div className="bg-gradient-to-l from-emerald-600 to-teal-500 text-white px-6 py-5 rounded-t-3xl sm:rounded-t-3xl">
          <h3 className="text-lg font-black mb-1">{t('reg_modal_title')}</h3>
          <p className="text-emerald-100 text-sm font-medium truncate">
            {isAr ? opportunity.titleAr : opportunity.title}
          </p>
        </div>

        <div className="p-5">
          {(schedule.dateLabel || schedule.timeLabel) && (
            <div className="mb-4 flex items-center gap-2.5 px-4 py-3
              bg-emerald-50 border border-emerald-100 rounded-xl">
              <span className="text-emerald-600 text-lg shrink-0">📅</span>
              <div className="text-sm font-semibold text-emerald-800">
                {schedule.dateLabel && (
                  <span>{schedule.dateLabel}</span>
                )}
                {schedule.timeLabel && (
                  <span className="text-emerald-600">
                    {schedule.dateLabel ? ' · ' : ''}🕐 {schedule.timeLabel}
                  </span>
                )}
              </div>
            </div>
          )}

          {needsProfile && (
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  📍 {t('reg_city_label')} *
                </label>
                <input
                  value={settlement}
                  onChange={e => {
                    setSettlement(e.target.value);
                    if (e.target.value.trim()) setValidationError('');
                  }}
                  placeholder={t('reg_city_placeholder')}
                  aria-invalid={Boolean(validationError)}
                  aria-describedby={validationError ? 'registration-city-error' : undefined}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm
                    focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all
                    aria-invalid:border-red-400" />
                {validationError && (
                  <p
                    id="registration-city-error"
                    role="alert"
                    className="mt-1.5 text-sm font-semibold text-red-600">
                    {validationError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ✨ {t('reg_interests_label')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleInterest(c.id)}
                      className={`text-sm px-3.5 py-2 rounded-xl border-2 font-semibold transition-all duration-150
                        ${interests.includes(c.id)
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700'}`}>
                      {c.icon} {t(c.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3.5 sm:py-3 min-h-[44px] text-sm font-bold text-gray-600
                border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all
                disabled:opacity-60 disabled:cursor-not-allowed">
              {t('reg_cancel_btn')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 py-3.5 sm:py-3 min-h-[44px] text-sm font-black bg-emerald-600
                text-white rounded-2xl hover:bg-emerald-700 transition-all
                hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-100
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
              {submitting ? t('reg_submitting') : t('reg_confirm_btn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationModal;
