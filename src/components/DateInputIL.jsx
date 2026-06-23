import { useEffect, useState } from 'react';
import { isoToDisplay, displayToIso, maskIsraeliDateInput } from '../utils/israeliDate';
import { pick } from '../i18n/i18n';

function DateInputIL({ value, onChange, lang, className, id }) {
  const isAr = lang === 'ar';
  const [text, setText] = useState(() => isoToDisplay(value));

  // Sync display text when the parent resets the ISO value (e.g. clearing the form)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setText(isoToDisplay(value)); }, [value]);

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
      inputMode="numeric"
      autoComplete="off"
      dir="ltr"
      className={className}
      placeholder={pick(isAr, 'יום/חודש/שנה', 'يوم/شهر/سنة')}
      title={pick(isAr, 'פורמט: יום/חודש/שנה (למשל 31/05/2026)', 'التنسيق: يوم/شهر/سنة')}
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
