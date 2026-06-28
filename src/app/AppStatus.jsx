export function LoadingScreen({ label }) {
  return (
    <div dir="rtl" className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
      <p className="text-sm font-semibold text-emerald-700">{label}</p>
    </div>
  );
}

export function LoadErrorScreen({ title, description, retryLabel }) {
  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center">
      <div className="max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 text-white shadow-2xl">
        <div className="mb-4 text-5xl" aria-hidden="true">⚠️</div>
        <h1 className="mb-2 text-xl font-black">{title}</h1>
        <p className="mb-6 text-sm leading-6 text-slate-300">{description}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-[#037c57] px-6 py-3 text-sm font-black text-white transition hover:bg-[#026647]">
          {retryLabel}
        </button>
      </div>
    </div>
  );
}
