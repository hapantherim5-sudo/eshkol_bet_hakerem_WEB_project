// File: src/components/DateInputIL.jsx
// Purpose: DateInputIL component
// Role: React component for DateInputIL

import { useEffect, useState } from 'react';
import { isoToDisplay, displayToIso, maskIsraeliDateInput } from '../../utils/israeliDate';
import { useT } from '../../i18n/i18n';

// DateInputIL — renders DateInputIL
function DateInputIL({ value, onChange, lang, className, id, required = false }) {
  const t = useT(lang);
  const [text, setText] = useState(() => isoToDisplay(value));

  // Sync display text when the parent resets the ISO value (e.g. clearing the form)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setText(isoToDisplay(value)); }, [value]);

  // apply — handles apply
  const apply = (display) => {
    const trimmed = display.trim();
    if (!trimmed) {
      onChange('');
      setText('');
      return;
    }
    const iso = displayToIso(trimmed);
    if (iso) {
      onChange(iso);
      setText(isoToDisplay(iso));
    }
  };

  return (
    <input
      id={id}
      type="text"
      required={required}
      inputMode="numeric"
      autoComplete="off"
      dir="ltr"
      className={className}
      placeholder={t('date_input_placeholder')}
      title={t('date_input_title')}
      value={text}
      onChange={e => {
        const masked = maskIsraeliDateInput(e.target.value);
        setText(masked);
        const iso = displayToIso(masked);
        if (iso) onChange(iso);
        else if (!masked.trim()) onChange('');
      }}
      onBlur={e => {
        const trimmed = e.target.value.trim();
        if (!trimmed) apply('');
        else if (!displayToIso(trimmed)) setText(isoToDisplay(value));
        else apply(trimmed);
      }}
    />
  );
}

export default DateInputIL;
