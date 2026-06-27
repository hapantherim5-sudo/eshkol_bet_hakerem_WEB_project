import { useState } from 'react';
import { useT } from '../i18n/i18n';
import { GALLERY_ITEMS } from '../data/galleryItems';

const FILTERS = [
  { id: 'all',       labelKey: 'gallery_filter_all' },
  { id: 'sport',     labelKey: 'gallery_filter_sport' },
  { id: 'art',       labelKey: 'gallery_filter_art' },
  { id: 'volunteer', labelKey: 'gallery_filter_volunteer' },
  { id: 'science',   labelKey: 'gallery_filter_science' },
  { id: 'community', labelKey: 'gallery_filter_community' },
];

function GalleryItem({ item, t }) {
  const [hovered, setHovered] = useState(false);
  const [loaded,  setLoaded ] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group animate-scale-in"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse-gentle rounded-2xl" />
      )}

      <img
        src={item.src}
        alt={t(item.captionKey)}
        className={`w-full object-cover rounded-2xl transition-transform duration-500
          ${hovered ? 'scale-105' : 'scale-100'}
          ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />

      <div className={`absolute inset-0 rounded-2xl flex flex-col justify-end p-4 transition-all duration-300
        ${hovered
          ? 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'
          : 'bg-gradient-to-t from-black/30 to-transparent'}`}>

        <span className={`self-start mb-2 px-2.5 py-1 ${item.tagColor} text-white text-[12px] font-black rounded-lg shadow-md`}>
          {t(item.tagLabelKey)}
        </span>

        <p className={`text-white text-sm font-bold leading-tight transition-all duration-300
          ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          {t(item.captionKey)}
        </p>
      </div>
    </div>
  );
}

function GalleryPage({ lang }) {
  const t = useT(lang);
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.tag === activeFilter);

  return (
    <div className="animate-fade-in">

      <div className="relative overflow-hidden bg-gradient-to-bl from-emerald-700 via-emerald-600 to-teal-500 text-white">
        <div className="pointer-events-none absolute -top-16 -right-12 w-64 h-64 rounded-full bg-white/5 animate-blob" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 w-48 h-48 rounded-full bg-teal-900/20 animate-blob" style={{ animationDelay: '4s' }} />

        <div className="relative max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/30">
            <span>📸</span>
            <span>{t('gallery_title')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-3 leading-tight">
            {t('gallery_subtitle')}
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg max-w-lg mx-auto">
            {t('gallery_description')}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8 justify-center flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all duration-150
                ${activeFilter === f.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-700'}`}>
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 font-medium mb-5 text-center">
          {t('gallery_photo_count', { count: filtered.length })}
        </p>

        <div className="gallery-masonry">
          {filtered.map((item, i) => (
            <div key={item.id} style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
              <GalleryItem item={item} t={t} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📷</p>
            <p className="text-xl font-bold text-gray-500">{t('gallery_empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryPage;
