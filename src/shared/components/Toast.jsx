export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`animate-toast pointer-events-none fixed top-20 left-1/2 z-[70] flex items-center gap-2 whitespace-nowrap rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-xl
        ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'}`}>
      <span className="text-base" aria-hidden="true">{toast.type === 'error' ? '✕' : '✓'}</span>
      {toast.message}
    </div>
  );
}
