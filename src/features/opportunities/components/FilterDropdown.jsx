export default function FilterDropdown({ id, value, options, open, onToggle, onChange }) {
  const selectedLabel = options.find(option => option.value === value)?.label ?? options[0]?.label;
  return (
    <div className="relative">
      <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-options`} onClick={onToggle} className="flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-emerald-500">
        <span className="truncate">{selectedLabel}</span><span className={`text-xs text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div id={`${id}-options`} role="listbox" className="filter-dropdown-options absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          {options.map(option => <button key={option.value || 'all'} type="button" role="option" aria-selected={value === option.value} onClick={() => onChange(option.value)} className={`filter-dropdown-option w-full px-3 py-2 text-right text-sm transition ${value === option.value ? 'bg-emerald-100 font-bold text-emerald-800' : 'text-gray-700 hover:bg-emerald-50'}`}>{option.label}</button>)}
        </div>
      )}
    </div>
  );
}
