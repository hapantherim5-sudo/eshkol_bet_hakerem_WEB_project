const MISSION_CARDS = [
  {
    icon: '🌱',
    titleHe: 'צמיחה אישית',
    titleAr: 'النمو الشخصي',
    textHe: 'אנחנו מאמינים שכל נער ונערה זכאים להזדמנות לגלות את הכוחות שלהם, לפתח כישורים ולצמוח.',
    textAr: 'نؤمن بأن كل شاب وشابة يستحقان الفرصة لاكتشاف قدراتهما وتطوير مهاراتهما والنمو.',
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: '🤝',
    titleHe: 'קהילה ושייכות',
    titleAr: 'المجتمع والانتماء',
    textHe: 'יוצרים מרחב בטוח ומכיל שבו כל צעיר מרגיש שייך, נשמע ומוערך.',
    textAr: 'نخلق مساحة آمنة وشاملة حيث يشعر كل شاب بالانتماء والاستماع والتقدير.',
    gradient: 'plum-gradient',
    bg: 'bg-[#f2eef7]',
  },
  {
    icon: '🚀',
    titleHe: 'הזדמנויות ללא גבולות',
    titleAr: 'فرص بلا حدود',
    textHe: 'ממגוון רחב של פעילויות - ספורט, אמנות, מדע, התנדבות - לכולם יש מקום אצלנו.',
    textAr: 'من مجموعة واسعة من الأنشطة - رياضة وفنون وعلوم وتطوع - للجميع مكان عندنا.',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
  },
];

const VALUES = [
  { icon: '💡', titleHe: 'חדשנות',    titleAr: 'الابتكار',    textHe: 'חשיבה יצירתית ופתרונות חדשים', textAr: 'التفكير الإبداعي والحلول الجديدة' },
  { icon: '🌍', titleHe: 'מגוון',     titleAr: 'التنوع',      textHe: 'פתוחים לכל, מכל רקע ותרבות', textAr: 'مفتوحون للجميع من كل خلفية وثقافة' },
  { icon: '🏆', titleHe: 'מצוינות',   titleAr: 'التميز',      textHe: 'שאיפה לטוב ביותר בכל פעילות', textAr: 'السعي للأفضل في كل نشاط' },
  { icon: '❤️', titleHe: 'אכפתיות',   titleAr: 'الاهتمام',   textHe: 'איכפת לנו מכל ילד וילדה', textAr: 'نهتم بكل طفل وطفلة' },
];

const TEAM = [
  { name: 'ירה עבאס דאהר', nameAr: 'يرح عباس داهر', role: 'מנהלת אשכול', roleAr: 'مدير العنقود', emoji: '👩‍💼', color: 'from-emerald-400 to-teal-500' },
  { name: 'מוחמד עלי',     nameAr: 'محمد علي',        role: 'רכז נוער',    roleAr: 'منسق الشباب',  emoji: '👨‍🏫', color: 'plum-gradient' },
  { name: 'רותם שלום',     nameAr: 'روتم شالوم',      role: 'מנחת סדנאות', roleAr: 'مشرفة ورش عمل', emoji: '👩‍🎨', color: 'from-amber-400 to-orange-500' },
  { name: 'סמיר חוסיין',   nameAr: 'سمير حسين',       role: 'מדריך ספורט', roleAr: 'مدرب رياضي',   emoji: '🏅', color: 'from-blue-400 to-cyan-500' },
];

const STATS = [
  { num: '500+', labelHe: 'צעירים פעילים', labelAr: 'شاب نشط', icon: '👥' },
  { num: '10',   labelHe: 'ישובים',         labelAr: 'بلدة',     icon: '🏘️' },
  { num: '6',    labelHe: 'קטגוריות',       labelAr: 'فئة',      icon: '✨' },
  { num: '3',    labelHe: 'שנות פעילות',    labelAr: 'سنوات',   icon: '📅' },
];

function AboutPage({ lang }) {
  const isAr = lang === 'ar';

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <div className="about-hero relative overflow-hidden text-white">
        <div className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full bg-white/5 animate-blob" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 w-56 h-56 rounded-full bg-slate-950/10 animate-blob" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/30">
            <span>📖</span>
            <span>{isAr ? 'من نحن' : 'מי אנחנו'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">
            {isAr ? 'عنقود بيت هكيريم' : 'אשכול בית הכרם'}
          </h1>

          <p className="text-white/75 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            {isAr
              ? 'مبادرة شبابية مجتمعية تهدف إلى توفير الفرص والإمكانات لكل شاب وشابة في المنطقة'
              : 'יוזמה קהילתית-נוענית שמטרתה להנגיש הזדמנויות ולשחרר את הפוטנציאל של כל צעיר וצעירה באזור'}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/15 rounded-2xl border border-white/25 text-sm font-semibold">
              <span>🌿</span>
              <span>{isAr ? 'منذ 2022' : 'פעילים מ-2022'}</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/15 rounded-2xl border border-white/25 text-sm font-semibold">
              <span>📍</span>
              <span>{isAr ? 'منطقة الجليل' : 'אזור הגליל'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className="text-2xl sm:text-3xl font-black text-gray-800">{s.num}</p>
                <p className="text-xs text-gray-500 font-medium">{isAr ? s.labelAr : s.labelHe}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* ── Who We Are ── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 bg-[#f2eef7] text-[#6c4e9b] rounded-full text-xs font-bold mb-3">
              {isAr ? '✨ هويتنا' : '✨ הזהות שלנו'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
              {isAr ? 'من نحن؟' : 'מי אנחנו?'}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p className="text-base">
                {isAr
                  ? 'أشكول بيت هكيريم هو برنامج تجمّعي لشبان المنطقة، يهدف إلى بناء جيل من الشباب المتفاعل، المبادر والملتزم بمجتمعه.'
                  : 'אשכול בית הכרם הוא תוכנית אזורית לנוער המאגדת בתוכה קהילות, ארגונים ומדריכים מתחום כל רחבי האזור.'}
              </p>
              <p className="text-base">
                {isAr
                  ? 'نحن نؤمن بأن الشباب هم قادة الغد، وأن توفير الفرص المناسبة لهم اليوم سيُحدث فارقاً في مستقبل مجتمعاتنا.'
                  : 'אנחנו מאמינים שנוערי היום הם מנהיגי מחר, ושמתן ההזדמנות הנכונה להם כיום ישנה את עתיד הקהילות שלנו.'}
              </p>
              <p className="text-base">
                {isAr
                  ? 'من خلال شراكاتنا مع السلطات المحلية والمنظمات المجتمعية، نوفر طيفاً واسعاً من الأنشطة والفرص المتنوعة.'
                  : 'באמצעות שיתופי פעולה עם רשויות מקומיות וארגונים קהילתיים, אנחנו מגישים מגוון רחב של פעילויות והזדמנויות.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🏘️', labelHe: '10 ישובים',     labelAr: '10 بلدات' },
                { icon: '🎯', labelHe: '6 קטגוריות',    labelAr: '6 فئات' },
                { icon: '👥', labelHe: 'קהילה גדלה',    labelAr: 'مجتمع متنامي' },
                { icon: '🌐', labelHe: 'דו-לשוני',       labelAr: 'ثنائي اللغة' },
              ].map((item, i) => (
                <div key={i} className="about-info-card bg-[#f2eef7] rounded-2xl p-4 text-center border border-[#dfd2eb]">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-xs font-bold text-gray-700">{isAr ? item.labelAr : item.labelHe}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission Cards ── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold mb-3">
              {isAr ? '🎯 رسالتنا' : '🎯 המשימה שלנו'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
              {isAr ? 'لماذا نحن هنا؟' : 'למה אנחנו כאן?'}
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {MISSION_CARDS.map((card, i) => (
              <div key={i}
                className={`about-mission-card ${card.bg} rounded-3xl p-6 border border-white/50
                  animate-card-in`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                  {card.icon}
                </div>
                <h3 className="font-black text-gray-800 text-lg mb-2">
                  {isAr ? card.titleAr : card.titleHe}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {isAr ? card.textAr : card.textHe}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Values ── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold mb-3">
              {isAr ? '💛 قيمنا' : '💛 הערכים שלנו'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
              {isAr ? 'ما الذي نؤمن به؟' : 'במה אנחנו מאמינים?'}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {VALUES.map((v, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm animate-card-in"
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="text-4xl mb-3">{v.icon}</div>
                <p className="font-black text-gray-800 text-sm mb-1">{isAr ? v.titleAr : v.titleHe}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{isAr ? v.textAr : v.textHe}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Team ── */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold mb-3">
              {isAr ? '👥 فريقنا' : '👥 הצוות שלנו'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
              {isAr ? 'الأشخاص خلف الكواليس' : 'האנשים מאחורי הקלעים'}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TEAM.map((member, i) => (
              <div key={i}
                className="bg-white rounded-3xl p-5 text-center border border-gray-100 shadow-sm animate-card-in"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-3xl mx-auto mb-3 shadow-md`}>
                  {member.emoji}
                </div>
                <p className="font-black text-gray-800 text-sm leading-snug">
                  {isAr ? member.nameAr : member.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {isAr ? member.roleAr : member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <div className="relative overflow-hidden bg-gradient-to-bl from-emerald-600 via-teal-600 to-cyan-500 rounded-3xl p-8 sm:p-12 text-white text-center">
            <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 animate-blob" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-teal-900/20 animate-blob" style={{ animationDelay: '5s' }} />

            <div className="relative">
              <p className="text-4xl mb-4">🌟</p>
              <h2 className="text-2xl sm:text-3xl font-black mb-3">
                {isAr ? 'انضم إلى مجتمعنا اليوم!' : 'הצטרף לקהילה שלנו היום!'}
              </h2>
              <p className="text-emerald-100 mb-6 text-base max-w-md mx-auto">
                {isAr
                  ? 'سجّل دخولك واستكشف الفرص التي تنتظرك'
                  : 'התחבר וגלה את ההזדמנויות שמחכות לך'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="about-email-chip px-6 py-3 bg-white text-emerald-700 font-black rounded-2xl text-sm shadow-lg">
                  {isAr ? '📧 info@bkerem.org.il' : '📧 info@bkerem.org.il'}
                </div>
                <div className="px-6 py-3 bg-white/15 border border-white/30 font-bold rounded-2xl text-sm">
                  {isAr ? '📍 منطقة الجليل، إسرائيل' : '📍 אזור הגליל, ישראל'}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default AboutPage;
