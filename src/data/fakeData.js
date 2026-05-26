export const FAKE_USERS = [
  { id: 1, username: 'admin', password: '1234', name: 'ירה עבאס דאהר', role: 'Admin' },
  { id: 2, username: 'youth', password: '1234', name: 'אחמד נמר', role: 'User' },
];

export const CATEGORIES = [
  { id: 'sport',     label: 'ספורט',         labelAr: 'رياضة',           icon: '⚽' },
  { id: 'art',       label: 'אמנות ויצירה',   labelAr: 'فنون وإبداع',     icon: '🎨' },
  { id: 'volunteer', label: 'התנדבות',        labelAr: 'تطوع',            icon: '🤝' },
  { id: 'science',   label: 'מדע וטכנולוגיה', labelAr: 'علوم وتكنولوجيا', icon: '🔬' },
  { id: 'community', label: 'קהילה וחברה',    labelAr: 'مجتمع',           icon: '🏘️' },
  { id: 'workshops', label: 'סדנאות והכשרות', labelAr: 'ورش عمل وتدريب',  icon: '📚' },
];

export const STATUS_AR = {
  'פתוח': 'مفتوح', 'מקומות אחרונים': 'أماكن محدودة',
  'נסגר בקרוב': 'يغلق قريباً', 'סגור להרשמה': 'مغلق للتسجيل',
};
export const TYPE_AR = {
  'חוג': 'دوري', 'סדנה': 'ورشة', 'תנועת נוער': 'حركة شباب',
  'התנדבות': 'تطوع', 'מיזם': 'مبادرة', 'הכשרה': 'تدريب', 'תוכנית': 'برنامج',
};
export const SCOPE_AR = { 'יישובי': 'بلدي', 'אזורי': 'إقليمي' };

export const INITIAL_OPPORTUNITIES = [
  { id:1, icon:'🏀', title:'חוג כדורסל', titleAr:'دوري كرة السلة', category:'sport', categoryLabel:'ספורט', type:'חוג', scope:'יישובי', city:"מג'ד אל כרום", ageMin:12, ageMax:18, days:'שני, רביעי', daysAr:'الاثنين، الأربعاء', time:'17:00-19:00', description:'חוג כדורסל לבני ובנות נוער בגילאי 12-18.', descriptionAr:'دوري كرة السلة للشباب بين 12-18 عامًا.', contact:'מוחמד עבאס', phone:'050-1234567', registration:'טלפון', registrationAr:'هاتف', status:'פתוח' },
  { id:2, icon:'📸', title:'סדנת צילום', titleAr:'ورشة تصوير', category:'art', categoryLabel:'אמנות ויצירה', type:'סדנה', scope:'אזורי', city:'כרמיאל', ageMin:14, ageMax:20, days:'שישי', daysAr:'الجمعة', time:'10:00-13:00', description:'סדנת צילום אמנותי לנוער. הציוד מסופק.', descriptionAr:'ورشة تصوير فني للشباب. المعدات متوفرة.', contact:'דנה לוי', phone:'052-9876543', registration:'טופס מקוון', registrationAr:'نموذج إلكتروني', status:'פתוח' },
  { id:3, icon:'🚑', title:'התנדבות מד"א', titleAr:'تطوع في المجن داود', category:'volunteer', categoryLabel:'התנדבות', type:'התנדבות', scope:'אזורי', city:'כרמיאל', ageMin:16, ageMax:18, days:'ראשון', daysAr:'الأحد', time:'08:00-14:00', description:'מסלול התנדבות בתחנת מד"א כרמיאל-משגב.', descriptionAr:'مسار تطوع في محطة المجن داود الأحمر.', contact:'גילי כהן', phone:'054-1112233', registration:'אתר מד"א', registrationAr:'موقع المجن داود', status:'מקומות אחרונים' },
  { id:4, icon:'⛺', title:'תנועת צופים', titleAr:'حركة الكشافة', category:'community', categoryLabel:'קהילה וחברה', type:'תנועת נוער', scope:'יישובי', city:'משגב', ageMin:10, ageMax:18, days:'שבת', daysAr:'السبت', time:'09:00-13:00', description:'תנועת הצופים — פעילות חינוכית-חברתית שבועית.', descriptionAr:'حركة الكشافة — نشاط تعليمي اجتماعي أسبوعي.', contact:'נועה שמש', phone:'053-4445566', registration:'טלפון', registrationAr:'هاتف', status:'פתוח' },
  { id:5, icon:'🤖', title:'סדנת רובוטיקה', titleAr:'ورشة الروبوتيك', category:'science', categoryLabel:'מדע וטכנולוגיה', type:'סדנה', scope:'אזורי', city:'כרמיאל', ageMin:13, ageMax:17, days:'שלישי, חמישי', daysAr:'الثلاثاء، الخميس', time:'16:00-18:00', description:'סדנת רובוטיקה ותכנות STEM לנוער.', descriptionAr:'ورشة روبوتيك وبرمجة STEM للشباب.', contact:'אלון ברק', phone:'050-7778899', registration:'טופס מקוון', registrationAr:'نموذج إلكتروني', status:'פתוח' },
  { id:6, icon:'💃', title:'ריקוד מזרחי', titleAr:'رقص شرقي', category:'art', categoryLabel:'אמנות ויצירה', type:'חוג', scope:'יישובי', city:'ראמה', ageMin:12, ageMax:20, days:'ראשון, שלישי', daysAr:'الأحد، الثلاثاء', time:'18:00-20:00', description:'חוג ריקוד מזרחי לנוער.', descriptionAr:'دوري رقص شرقي للشباب.', contact:'סמר עיסא', phone:'052-3334455', registration:'טלפון', registrationAr:'هاتف', status:'פתוח' },
  { id:7, icon:'🗣️', title:'שיח נוער קהילתי', titleAr:'حوار شباب مجتمعي', category:'community', categoryLabel:'קהילה וחברה', type:'מיזם', scope:'אזורי', city:'בענה', ageMin:15, ageMax:22, days:'חמישי', daysAr:'الخميس', time:'17:30-19:30', description:'פורום נוער אזורי לדיון בנושאים חברתיים.', descriptionAr:'منتدى شباب إقليمي لمناقشة القضايا الاجتماعية.', contact:"ג'מאל חוסין", phone:'054-6667788', registration:'חופשי', registrationAr:'مجاني', status:'פתוח' },
  { id:8, icon:'🩺', title:'הכשרת עזרה ראשונה', titleAr:'تدريب الإسعافات الأولية', category:'workshops', categoryLabel:'סדנאות והכשרות', type:'הכשרה', scope:'אזורי', city:"מג'ד אל כרום", ageMin:14, ageMax:18, days:'שישי', daysAr:'الجمعة', time:'09:00-14:00', description:'קורס עזרה ראשונה מוסמך לבני נוער.', descriptionAr:'دورة إسعافات أولية معتمدة للشباب.', contact:'ריאד מנסור', phone:'050-2223344', registration:'טופס מקוון', registrationAr:'نموذج إلكتروني', status:'פתוח' },
];