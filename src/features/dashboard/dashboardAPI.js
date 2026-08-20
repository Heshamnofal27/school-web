/**
 * ⚠️ ملاحظة (Backend Gap): لا يوجد في `routes/api.php` أي endpoint مخصص لإحصائيات
 * لوحة تحكم المدير (عدد المستخدمين حسب النوع، نمو الطلاب، إلخ). الإحصائيات المتاحة فعلياً
 * من الباك-إند محدودة بـ: عدد الشعب (/admin/classes)، عدد الصفوف (/admin/Get/grades)،
 * عدد المحاسبين (/admin/accountants)، والشكاوى (/admin/complaints). بانتظار إضافة
 * endpoint مخصص (مثل GET /admin/dashboard/stats) يبقى هذا الملف على بيانات تجريبية.
 * راجع GAPS.md لمزيد من التفاصيل.
 */
import { AUTHORIZED_EMAILS } from "../../data/mock/authorizedEmails";
import { SUPERVISORS, GRADES, CLASSES } from "../../data/mock/supervisorsData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchDashboardStats() {
  await delay(400);

  const totalEmails = AUTHORIZED_EMAILS.length;
  const pendingEmails = AUTHORIZED_EMAILS.filter((e) => e.status === "معلق").length;
  const usedEmails = AUTHORIZED_EMAILS.filter((e) => e.status === "مستخدم").length;
  const inactiveEmails = AUTHORIZED_EMAILS.filter((e) => e.status === "غير نشط").length;

  const usersByType = {
    طالب: 120,
    أستاذ: 25,
    "ولي أمر": 80,
    مشرف: SUPERVISORS.length,
    محاسب: 3,
  };
  const totalUsers = Object.values(usersByType).reduce((a, b) => a + b, 0);

  const emailsByType = {};
  AUTHORIZED_EMAILS.forEach((e) => {
    const t = e.userType || "أخرى";
    if (!emailsByType[t]) emailsByType[t] = { total: 0, pending: 0, used: 0, inactive: 0 };
    emailsByType[t].total++;
    if (e.status === "معلق") emailsByType[t].pending++;
    else if (e.status === "مستخدم") emailsByType[t].used++;
    else if (e.status === "غير نشط") emailsByType[t].inactive++;
  });

  const classesPerGrade = GRADES.map((g) => ({
    gradeName: g.name,
    count: CLASSES.filter((c) => c.gradeId === g.id).length,
  }));

  const studentGrowth = [
    { month: "سبتمبر", count: 180 },
    { month: "أكتوبر", count: 210 },
    { month: "نوفمبر", count: 245 },
    { month: "ديسمبر", count: 270 },
    { month: "يناير", count: 295 },
    { month: "فبراير", count: 310 },
    { month: "مارس", count: 335 },
    { month: "أبريل", count: 355 },
    { month: "مايو", count: 370 },
  ];

  const evaluation = {
    axes: ["التعليم", "النظافة", "الحافلات", "المعاملة", "الأنشطة", "الأمن"],
    parents: [85, 70, 60, 90, 65, 80],
    students: [78, 65, 55, 88, 72, 75],
  };

  return {
    success: true,
    data: {
      users: {
        total: totalUsers,
        byType: usersByType,
      },
      emails: {
        total: totalEmails,
        pending: pendingEmails,
        used: usedEmails,
        inactive: inactiveEmails,
        available: pendingEmails,
        byType: emailsByType,
      },
      classes: {
        total: CLASSES.length,
        grades: GRADES.length,
        perGrade: classesPerGrade,
      },
      supervisors: {
        total: SUPERVISORS.length,
        assigned: 3,
        unassigned: SUPERVISORS.length - 3,
      },
      studentGrowth,
      evaluation,
    },
  };
}
