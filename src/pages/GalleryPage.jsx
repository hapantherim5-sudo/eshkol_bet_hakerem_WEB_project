import { useState } from 'react';
import { useT } from '../i18n/i18n';

const GALLERY_ITEMS = [
  { id: 1,  src: '/gallery/youth-football-training.jpg',    captionHe: 'אימון כדורגל קהילתי',              captionAr: 'تدريب كرة القدم المجتمعي',           tag: 'sport',     tagLabelHe: 'ספורט',    tagLabelAr: 'رياضة',    tagColor: 'bg-orange-500' },
  { id: 2,  src: '/gallery/youth-art-workshop.jpg',         captionHe: 'סדנת ציור ויצירה',                 captionAr: 'ورشة الرسم والإبداع',                tag: 'art',       tagLabelHe: 'אמנות',    tagLabelAr: 'فنون',     tagColor: 'bg-violet-500' },
  { id: 3,  src: '/gallery/community-garden-volunteering.jpg', captionHe: 'פעילות התנדבות בגינה הקהילתית', captionAr: 'نشاط التطوع في الحديقة المجتمعية',  tag: 'volunteer', tagLabelHe: 'התנדבות',  tagLabelAr: 'تطوع',     tagColor: 'bg-emerald-500' },
  { id: 4,  src: '/gallery/youth-science-learning.jpg',     captionHe: 'מעבדת מדע לנוער',                 captionAr: 'مختبر العلوم للشباب',                tag: 'science',   tagLabelHe: 'מדע',      tagLabelAr: 'علوم',     tagColor: 'bg-blue-500' },
  { id: 5,  src: '/gallery/community-event-gathering.jpg',  captionHe: 'אירוע קהילתי שנתי',               captionAr: 'الحدث المجتمعي السنوي',              tag: 'community', tagLabelHe: 'קהילה',    tagLabelAr: 'مجتمع',    tagColor: 'bg-pink-500' },
  { id: 6,  src: '/gallery/youth-basketball-tournament.jpg',captionHe: 'טורניר כדורסל בין-ישובי',          captionAr: 'بطولة كرة السلة بين البلدات',        tag: 'sport',     tagLabelHe: 'ספורט',    tagLabelAr: 'رياضة',    tagColor: 'bg-orange-500' },
  { id: 7,  src: '/gallery/music-workshop-drums.jpg',       captionHe: 'סדנת מוזיקה ותופים',              captionAr: 'ورشة الموسيقى والطبل',               tag: 'art',       tagLabelHe: 'אמנות',    tagLabelAr: 'فنون',     tagColor: 'bg-violet-500' },
  { id: 8,  src: '/gallery/community-cleanup-volunteers.jpg',captionHe: 'ניקוי פארק קהילתי',              captionAr: 'تنظيف الحديقة المجتمعية',           tag: 'volunteer', tagLabelHe: 'התנדבות',  tagLabelAr: 'تطوع',     tagColor: 'bg-emerald-500' },
  { id: 9,  src: '/gallery/youth-coding-workshop.jpg',      captionHe: 'קורס קידוד ותכנות לנוער',         captionAr: 'دورة البرمجة للشباب',                tag: 'science',   tagLabelHe: 'טכנולוגיה',tagLabelAr: 'تكنولوجيا',tagColor: 'bg-blue-500' },
  { id: 10, src: '/gallery/youth-festival-celebration.jpg', captionHe: 'פסטיבל נוער אזורי',               captionAr: 'مهرجان الشباب الإقليمي',             tag: 'community', tagLabelHe: 'אירוע',    tagLabelAr: 'حدث',      tagColor: 'bg-pink-500' },
  { id: 11, src: '/gallery/youth-dance-performance.jpg',    captionHe: 'הצגת מחול סיום שנה',              captionAr: 'عرض الرقص في نهاية السنة',           tag: 'art',       tagLabelHe: 'אמנות',    tagLabelAr: 'فنون',     tagColor: 'bg-violet-500' },
  { id: 12, src: '/gallery/nature-hiking-group.jpg',        captionHe: 'טיול שנתי לטבע הגליל',            captionAr: 'رحلة سنوية إلى طبيعة الجليل',       tag: 'community', tagLabelHe: 'פעילות',   tagLabelAr: 'نشاط',     tagColor: 'bg-pink-500' },
];

const FILTERS = [
  { id: 'all',       labelHe: '⭐ הכל',      labelAr: '⭐ الكل'   },
  { id: 'sport',     labelHe: '⚽ ספורט',    labelAr: '⚽ رياضة'  },
  { id: 'art',       labelHe: '🎨 אמנות',    labelAr: '🎨 فنون'   },
  { id: 'volunteer', labelHe: '🤝 התנדבות',  labelAr: '🤝 تطوع'   },
  { id: 'science',   labelHe: '🔬 מדע',      labelAr: '🔬 علوم'   },
  { id: 'community', labelHe: '🏘️ קהילה',   labelAr: '🏘️ مجتمع' },
];

function GalleryItem({ item, isAr }) {
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
        alt={isAr ? item.captionAr : item.captionHe}
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
          {isAr ? item.tagLabelAr : item.tagLabelHe}
        </span>

        <p className={`text-white text-sm font-bold leading-tight transition-all duration-300
          ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          {isAr ? item.captionAr : item.captionHe}
        </p>
      </div>
    </div>
  );
}

function GalleryPage({ lang }) {
  const t = useT(lang);
  const isAr = lang === 'ar';
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.tag === activeFilter);

  return (
    <div className="animate-fade-in">

      <div className="relative overflow-hidden bg-gradient-to-bl from-cyan-600 via-teal-500 to-emerald-500 text-white">
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
          <p className="text-teal-100 text-base sm:text-lg max-w-lg mx-auto">
            {isAr
              ? 'لقطات حقيقية من فعاليات ونشاطات شبابنا في المجتمع'
              : 'צילומים אמיתיים מפעילויות ואירועים של הנוער שלנו בקהילה'}
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
              {isAr ? f.labelAr : f.labelHe}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 font-medium mb-5 text-center">
          {isAr ? `${filtered.length} صورة` : `${filtered.length} תמונות`}
        </p>

        <div className="gallery-masonry">
          {filtered.map((item, i) => (
            <div key={item.id} style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
              <GalleryItem item={item} isAr={isAr} />
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
