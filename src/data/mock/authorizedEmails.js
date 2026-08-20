/**
 * @fileOverview قائمة البريد الإلكتروني المعتمد
 * @description: بيانات تجريبية للـ emails المصرح بها لإنشاء حسابات
 *
 * هذه البيانات تمثل قائمة البريد الإلكتروني المعتمدة من قبل الأدمن
 * يمكن للمستخدمين التسجيل فقط باستخدام emails من هذه القائمة
 */

/**
 * @description: حالات البريد الإلكتروني
 * - PENDING: مضافة ولم يتم التسجيل بعد
 * - USED: تم استخدام البريد الإلكتروني للتسجيل
 * - INACTIVE: معطلة من قبل الأدمن
 * - EXPIRED: انتهت صلاحيتها
 */
export const EMAIL_STATUS = {
  PENDING: "معلق",
  USED: "مستخدم",
  INACTIVE: "غير نشط",
  EXPIRED: "منتهي الصلاحية",
};

/**
 * @description: أنواع المستخدمين المسموحين
 */
export const USER_TYPES = {
  STUDENT: "طالب",
  TEACHER: "أستاذ",
  PARENT: "ولي أمر",
  SUPERVISOR: "مشرف",
  ACCOUNTANT: "محاسب",
};

/**
 * @description: بيانات الـ emails المعتمدة (Mock Data)
 * في التطبيق الحقيقي، ستأتي من قاعدة البيانات
 */
export const AUTHORIZED_EMAILS = [
  // ===== الأساتذة (Teachers) =====
  {
    id: 1,
    email: "dr.fatima@school.com",
    userType: USER_TYPES.TEACHER,
    name: "د. فاطمة الأحمد",
    status: EMAIL_STATUS.PENDING,
    subject: "اللغة العربية",
    createdAt: "2024-01-15",
    createdBy: 1, // Admin ID
    expiresAt: "2025-12-31",
    notes: "معلمة اللغة العربية",
  },
  {
    id: 2,
    email: "mr.ahmed@school.com",
    userType: USER_TYPES.TEACHER,
    name: "أ. أحمد سالم",
    status: EMAIL_STATUS.PENDING,
    subject: "الرياضيات",
    createdAt: "2024-01-15",
    createdBy: 1,
    expiresAt: "2025-12-31",
    notes: "معلم الرياضيات",
  },
  {
    id: 3,
    email: "ms.sara@school.com",
    userType: USER_TYPES.TEACHER,
    name: "أ. سارة محمود",
    status: EMAIL_STATUS.PENDING,
    subject: "العلوم",
    createdAt: "2024-01-15",
    createdBy: 1,
    expiresAt: "2025-12-31",
    notes: "معلمة العلوم",
  },

  // ===== الطلاب (Students) =====
  {
    id: 4,
    email: "student.ali@school.com",
    userType: USER_TYPES.STUDENT,
    name: "علي محمد",
    status: EMAIL_STATUS.PENDING,
    classId: 1,
    classLevel: "الأول الابتدائي أ",
    createdAt: "2024-02-01",
    createdBy: 1,
    expiresAt: "2024-06-30",
    notes: "طالب في الفصل الأول الابتدائي",
  },
  {
    id: 5,
    email: "student.fatima@school.com",
    userType: USER_TYPES.STUDENT,
    name: "فاطمة علي",
    status: EMAIL_STATUS.PENDING,
    classId: 1,
    classLevel: "الأول الابتدائي أ",
    createdAt: "2024-02-01",
    createdBy: 1,
    expiresAt: "2024-06-30",
    notes: "طالبة في الفصل الأول الابتدائي",
  },
  {
    id: 6,
    email: "student.mohammad@school.com",
    userType: USER_TYPES.STUDENT,
    name: "محمد سعيد",
    status: EMAIL_STATUS.USED, // مستخدم بالفعل
    classId: 2,
    classLevel: "الثاني الابتدائي ب",
    createdAt: "2024-02-01",
    createdBy: 1,
    usedAt: "2024-03-15",
    usedBy: 12, // User ID
    expiresAt: "2024-06-30",
    notes: "تم استخدام هذا البريد بنجاح",
  },

  // ===== أولياء الأمور (Parents) =====
  {
    id: 7,
    email: "parent.ali@school.com",
    userType: USER_TYPES.PARENT,
    name: "والد علي محمد",
    status: EMAIL_STATUS.PENDING,
    childName: "علي محمد",
    childId: 4,
    createdAt: "2024-02-05",
    createdBy: 1,
    expiresAt: "2025-06-30",
    notes: "ولي أمر الطالب علي محمد",
  },
  {
    id: 8,
    email: "parent.fatima@school.com",
    userType: USER_TYPES.PARENT,
    name: "والدة فاطمة علي",
    status: EMAIL_STATUS.PENDING,
    childName: "فاطمة علي",
    childId: 5,
    createdAt: "2024-02-05",
    createdBy: 1,
    expiresAt: "2025-06-30",
    notes: "والدة الطالبة فاطمة علي",
  },

  // ===== المشرفين (Supervisors) =====
  {
    id: 9,
    email: "supervisor.ahmed@school.com",
    userType: USER_TYPES.SUPERVISOR,
    name: "أحمد محمد",
    status: EMAIL_STATUS.PENDING,
    createdAt: "2024-01-20",
    createdBy: 1,
    expiresAt: "2025-12-31",
    notes: "مشرف عام المدرسة",
  },

  // ===== المحاسبين (Accountants) =====
  {
    id: 10,
    email: "accountant.fatima@school.com",
    userType: USER_TYPES.ACCOUNTANT,
    name: "فاطمة علي",
    status: EMAIL_STATUS.PENDING,
    createdAt: "2024-01-20",
    createdBy: 1,
    expiresAt: "2025-12-31",
    notes: "محاسبة المدرسة",
  },
];

/**
 * @description: إحصائيات الـ emails المعتمدة
 */
export const getEmailsStatistics = () => {
  const total = AUTHORIZED_EMAILS.length;
  const pending = AUTHORIZED_EMAILS.filter(
    (e) => e.status === EMAIL_STATUS.PENDING,
  ).length;
  const used = AUTHORIZED_EMAILS.filter(
    (e) => e.status === EMAIL_STATUS.USED,
  ).length;
  const inactive = AUTHORIZED_EMAILS.filter(
    (e) => e.status === EMAIL_STATUS.INACTIVE,
  ).length;

  return {
    total,
    pending,
    used,
    inactive,
    available: pending + inactive,
  };
};

/**
 * @description: الحصول على الـ emails حسب النوع
 */
export const getEmailsByType = (userType) => {
  return AUTHORIZED_EMAILS.filter((e) => e.userType === userType);
};

/**
 * @description: التحقق من البريد الإلكتروني المعتمد
 */
export const isEmailAuthorized = (email) => {
  const emailRecord = AUTHORIZED_EMAILS.find(
    (e) => e.email.toLowerCase() === email.toLowerCase(),
  );
  return emailRecord && emailRecord.status !== EMAIL_STATUS.INACTIVE;
};

/**
 * @description: الحصول على بيانات البريد الإلكتروني
 */
export const getEmailRecord = (email) => {
  return AUTHORIZED_EMAILS.find(
    (e) => e.email.toLowerCase() === email.toLowerCase(),
  );
};

/**
 * @description: التحقق من استخدام البريد الإلكتروني
 */
export const isEmailUsed = (email) => {
  const emailRecord = getEmailRecord(email);
  return emailRecord && emailRecord.status === EMAIL_STATUS.USED;
};

/**
 * @description: الحصول على حالة الـ emails حسب النوع
 */
export const getStatsForUserType = (userType) => {
  const emails = getEmailsByType(userType);
  return {
    userType,
    total: emails.length,
    pending: emails.filter((e) => e.status === EMAIL_STATUS.PENDING).length,
    used: emails.filter((e) => e.status === EMAIL_STATUS.USED).length,
    inactive: emails.filter((e) => e.status === EMAIL_STATUS.INACTIVE).length,
  };
};
