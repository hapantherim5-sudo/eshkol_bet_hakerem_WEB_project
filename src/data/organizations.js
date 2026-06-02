export const ORGANIZATIONS = [
  { id: 'youth-majd',   nameHe: "מחלקת נוער מג'ד אל-כרום", nameAr: 'قسم الشباب مجد الكروم' },
  { id: 'youth-karmiel', nameHe: 'רשות נוער כרמיאל',        nameAr: 'سلطة شباب كرميئيل' },
  { id: 'scouts',        nameHe: 'תנועת הצופים',            nameAr: 'حركة الكشافة' },
  { id: 'mda',           nameHe: 'מגן דוד אדום',            nameAr: 'نجمة داود الحمراء' },
  { id: 'community-baana', nameHe: 'מרכז קהילתי בענה',      nameAr: 'مركز مجتمعي بعنة' },
  { id: 'youth-rama',    nameHe: 'מחלקת נוער ראמה',         nameAr: 'قسم الشباب رامة' },
];

export function getOrgName(orgId, isAr) {
  const org = ORGANIZATIONS.find(o => o.id === orgId);
  if (!org) return '';
  return isAr ? org.nameAr : org.nameHe;
}
