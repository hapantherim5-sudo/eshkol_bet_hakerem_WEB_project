export const ORGANIZATIONS = [
  { id: 'youth-misgav',      nameHe: 'רשות נוער משגב',           nameAr: 'سلطة شباب مشگاف' },
  { id: 'youth-karmiel',     nameHe: 'רשות נוער כרמיאל',         nameAr: 'سلطة شباب كرميئيل' },
  { id: 'community-baana',   nameHe: 'מרכז קהילתי בענה',         nameAr: 'مركز مجتمعي بعنة' },
  { id: 'youth-dir-el-asad', nameHe: 'רשות נוער דיר אלאסד',      nameAr: 'سلطة شباب دير الأسد' },
  { id: 'youth-sakhnin',     nameHe: "רשות נוער סח'נין",         nameAr: 'سلطة شباب سخنين' },
  { id: 'youth-rama',        nameHe: 'מחלקת נוער ראמה',          nameAr: 'قسم الشباب رامة' },
  { id: 'youth-nahaf',       nameHe: 'רשות נוער נחף',            nameAr: 'سلطة شباب نحف' },
  { id: 'youth-majd',        nameHe: "מחלקת נוער מג'ד אל-כרום",  nameAr: 'قسم الشباب مجد الكروم' },
  { id: 'scouts',            nameHe: 'תנועת הצופים',             nameAr: 'حركة الكشافة' },
  { id: 'mda',               nameHe: 'מגן דוד אדום',             nameAr: 'نجمة داود الحمراء' },
];

export function getOrgName(orgId, isAr) {
  const org = ORGANIZATIONS.find(o => o.id === orgId);
  if (!org) return '';
  return isAr ? org.nameAr : org.nameHe;
}
