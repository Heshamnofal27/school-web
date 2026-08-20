/**
 * @fileOverview ثوابت الصلاحيات والأدوار
 * @description: تعريف جميع الأدوار والصلاحيات في التطبيق
 */

/**
 * @enum الأدوار المتاحة (Roles)
 * كل دور له مجموعة محددة من الصلاحيات
 */
export const ROLES = {
  ADMIN: "admin",
  ACCOUNTING: "accountant",
  SUPERVISION: "supervisor",
};

/**
 * @enum الصلاحيات المتاحة (Permissions)
 * كل صلاحية تسمح بإجراء معين
 */
export const PERMISSIONS = {
  // ===== صلاحيات إدارة المدرسة (المجموعة أ) =====
  // إعدادات المدرسة
  MANAGE_SCHOOL_SETTINGS: "manage_school_settings", // إدارة إعدادات المدرسة
  MANAGE_ACADEMIC_YEAR: "manage_academic_year", // إدارة السنة الدراسية
  MANAGE_CLASSES: "manage_classes", // إدارة الفصول الدراسية
  MANAGE_USERS: "manage_users", // إدارة المستخدمين

  // إدارة الحسابات (الطلاب والموظفين)
  VIEW_STUDENT_ACCOUNTS: "view_student_accounts", // عرض حسابات الطلاب
  ADD_STUDENT_ACCOUNTS: "add_student_accounts", // إضافة حسابات طلاب
  EDIT_STUDENT_ACCOUNTS: "edit_student_accounts", // تعديل حسابات طلاب
  DELETE_STUDENT_ACCOUNTS: "delete_student_accounts", // حذف حسابات طلاب

  VIEW_STAFF_ACCOUNTS: "view_staff_accounts", // عرض حسابات الموظفين
  ADD_STAFF_ACCOUNTS: "add_staff_accounts", // إضافة حسابات موظفين
  EDIT_STAFF_ACCOUNTS: "edit_staff_accounts", // تعديل حسابات موظفين
  DELETE_STAFF_ACCOUNTS: "delete_staff_accounts", // حذف حسابات موظفين

  // إدارة الحسابات الجديدة
  MANAGE_ACCOUNTS: "manage_accounts", // إدارة إنشاء الحسابات
  CREATE_ACCOUNTS: "create_accounts", // إنشاء حسابات جديدة

  VIEW_DASHBOARD_ADMIN: "view_dashboard_admin", // عرض لوحة التحكم الإدارية

  // المشرفون على الصفوف
  MANAGE_SUPERVISORS: "manage_supervisors", // إدارة المشرفين على الصفوف

  // نقل الطلاب
  MANAGE_STUDENTS: "manage_students", // نقل الطلاب بين الشعب

  // ===== صلاحيات المحاسبة (المجموعة ب) =====
  // الفواتير
  VIEW_INVOICES: "view_invoices", // عرض الفواتير
  CREATE_INVOICES: "create_invoices", // إنشاء فواتير
  EDIT_INVOICES: "edit_invoices", // تعديل الفواتير
  DELETE_INVOICES: "delete_invoices", // حذف الفواتير
  APPROVE_INVOICES: "approve_invoices", // موافقة على الفواتير

  // الخزنة (المقبوضات)
  VIEW_CASH_REGISTER: "view_cash_register", // عرض الخزنة
  RECORD_PAYMENTS: "record_payments", // تسجيل المقبوضات
  RECORD_EXPENSES: "record_expenses", // تسجيل المصاريف
  GENERATE_FINANCIAL_REPORTS: "generate_financial_reports", // إنشاء تقارير مالية
  MANAGE_PAYMENT_METHODS: "manage_payment_methods", // إدارة طرق الدفع

  // المصاريف
  VIEW_EXPENSES: "view_expenses", // عرض المصاريف
  CREATE_EXPENSES: "create_expenses", // إنشاء مصاريف
  EDIT_EXPENSES: "edit_expenses", // تعديل المصاريف
  DELETE_EXPENSES: "delete_expenses", // حذف المصاريف
  APPROVE_EXPENSES: "approve_expenses", // موافقة على المصاريف

  // التقارير المالية
  VIEW_FINANCIAL_REPORTS: "view_financial_reports", // عرض التقارير المالية
  EXPORT_FINANCIAL_DATA: "export_financial_data", // تصدير البيانات المالية

  VIEW_DASHBOARD_ACCOUNTING: "view_dashboard_accounting", // عرض لوحة التحكم المحاسبية

  // ===== صلاحيات الإشراف (المجموعة ج) =====
  // الغياب والحضور
  VIEW_ATTENDANCE: "view_attendance", // عرض الحضور والغياب
  RECORD_ATTENDANCE: "record_attendance", // تسجيل الحضور والغياب
  EDIT_ATTENDANCE: "edit_attendance", // تعديل الحضور والغياب
  GENERATE_ATTENDANCE_REPORTS: "generate_attendance_reports", // إنشاء تقارير الحضور

  // السلوك والانضباط
  VIEW_BEHAVIOR: "view_behavior", // عرض سجل السلوك
  RECORD_BEHAVIOR: "record_behavior", // تسجيل ملاحظات السلوك
  EDIT_BEHAVIOR: "edit_behavior", // تعديل ملاحظات السلوك
  ISSUE_WARNINGS: "issue_warnings", // إصدار تنبيهات
  VIEW_DISCIPLINE_RECORDS: "view_discipline_records", // عرض سجلات الانضباط

  // الجداول الدراسية
  VIEW_SCHEDULES: "view_schedules", // عرض الجداول الدراسية
  CREATE_SCHEDULES: "create_schedules", // إنشاء جداول دراسية
  EDIT_SCHEDULES: "edit_schedules", // تعديل الجداول الدراسية
  DELETE_SCHEDULES: "delete_schedules", // حذف الجداول الدراسية
  PUBLISH_SCHEDULES: "publish_schedules", // نشر الجداول الدراسية

  // التقارير
  VIEW_SUPERVISION_REPORTS: "view_supervision_reports", // عرض تقارير الإشراف
  GENERATE_CLASS_REPORTS: "generate_class_reports", // إنشاء تقارير الفصول

  VIEW_DASHBOARD_SUPERVISION: "view_dashboard_supervision", // عرض لوحة التحكم الإشرافية
};

/**
 * @description: تعيين الصلاحيات لكل دور
 * كل دور يحصل على مجموعة من الصلاحيات
 */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // المجموعة أ (الأدمن) - إدارة المدرسة كاملة
    PERMISSIONS.MANAGE_SCHOOL_SETTINGS,
    PERMISSIONS.MANAGE_ACADEMIC_YEAR,
    PERMISSIONS.MANAGE_CLASSES,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_STUDENT_ACCOUNTS,
    PERMISSIONS.ADD_STUDENT_ACCOUNTS,
    PERMISSIONS.EDIT_STUDENT_ACCOUNTS,
    PERMISSIONS.DELETE_STUDENT_ACCOUNTS,
    PERMISSIONS.VIEW_STAFF_ACCOUNTS,
    PERMISSIONS.ADD_STAFF_ACCOUNTS,
    PERMISSIONS.EDIT_STAFF_ACCOUNTS,
    PERMISSIONS.DELETE_STAFF_ACCOUNTS,
    PERMISSIONS.MANAGE_ACCOUNTS,
    PERMISSIONS.CREATE_ACCOUNTS,
    PERMISSIONS.VIEW_DASHBOARD_ADMIN,
    PERMISSIONS.MANAGE_SUPERVISORS,
    PERMISSIONS.MANAGE_STUDENTS,
  ],

  [ROLES.ACCOUNTING]: [
    // المجموعة ب (المحاسبة) - الفواتير والخزنة والمصاريف
    PERMISSIONS.VIEW_INVOICES,
    PERMISSIONS.CREATE_INVOICES,
    PERMISSIONS.EDIT_INVOICES,
    PERMISSIONS.DELETE_INVOICES,
    PERMISSIONS.APPROVE_INVOICES,
    PERMISSIONS.VIEW_CASH_REGISTER,
    PERMISSIONS.RECORD_PAYMENTS,
    PERMISSIONS.RECORD_EXPENSES,
    PERMISSIONS.GENERATE_FINANCIAL_REPORTS,
    PERMISSIONS.MANAGE_PAYMENT_METHODS,
    PERMISSIONS.VIEW_EXPENSES,
    PERMISSIONS.CREATE_EXPENSES,
    PERMISSIONS.EDIT_EXPENSES,
    PERMISSIONS.DELETE_EXPENSES,
    PERMISSIONS.APPROVE_EXPENSES,
    PERMISSIONS.VIEW_FINANCIAL_REPORTS,
    PERMISSIONS.EXPORT_FINANCIAL_DATA,
    PERMISSIONS.VIEW_DASHBOARD_ACCOUNTING,
  ],

  [ROLES.SUPERVISION]: [
    // المجموعة ج (الإشراف) - الغياب والسلوك والجداول
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.RECORD_ATTENDANCE,
    PERMISSIONS.EDIT_ATTENDANCE,
    PERMISSIONS.GENERATE_ATTENDANCE_REPORTS,
    PERMISSIONS.VIEW_BEHAVIOR,
    PERMISSIONS.RECORD_BEHAVIOR,
    PERMISSIONS.EDIT_BEHAVIOR,
    PERMISSIONS.ISSUE_WARNINGS,
    PERMISSIONS.VIEW_DISCIPLINE_RECORDS,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.CREATE_SCHEDULES,
    PERMISSIONS.EDIT_SCHEDULES,
    PERMISSIONS.DELETE_SCHEDULES,
    PERMISSIONS.PUBLISH_SCHEDULES,
    PERMISSIONS.VIEW_SUPERVISION_REPORTS,
    PERMISSIONS.GENERATE_CLASS_REPORTS,
    PERMISSIONS.VIEW_DASHBOARD_SUPERVISION,
  ],
};

/**
 * @description: تعيين الصفحات لكل دور
 * يحدد الصفحات التي يمكن الوصول إليها لكل دور
 */
export const ROLE_PAGES = {
  [ROLES.ADMIN]: [
    "/admin/dashboard",
    "/admin/create-accounts",
    "/admin/assign-supervisors",
    "/admin/manage-classes",
    "/admin/transfer-students",
    "/admin/specializations",
    "/admin/complaints",
    "/admin/buses",
    "/settings",
  ],

  [ROLES.ACCOUNTING]: [
    "/accounting/dashboard",
    "/accounting/tuition-settings",
    "/accounting/student-directory",
    "/accounting/student-billing",
    "/accounting/due-payments",
    "/settings",
  ],

  [ROLES.SUPERVISION]: [
    "/supervisor/dashboard",
    "/supervisor/students/:classId",
    "/supervisor/student/:studentId",
    "/supervisor/class/:classId",
    "/supervisor/class-students",
    "/supervisor/meetings",
    "/supervisor/attendance",
    "/supervisor/trips",
  ],
};

/**
 * @description: معلومات عن كل دور
 */
export const ROLE_INFO = {
  [ROLES.ADMIN]: {
    name: "مدير النظام",
    description: "إدارة المدرسة والحسابات والإعدادات",
    dashboardPath: "/admin/dashboard",
  },

  [ROLES.ACCOUNTING]: {
    name: "محاسب",
    description: "إدارة الفواتير والخزنة والمصاريف والتقارير المالية",
    dashboardPath: "/accounting/dashboard",
  },

  [ROLES.SUPERVISION]: {
    name: "مشرف",
    description: "إدارة الغياب والسلوك والجداول الدراسية",
    dashboardPath: "/supervisor/dashboard",
  },
};

export const MOCK_USERS = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "admin@school.com",
    password: "123456",
    role: ROLES.ADMIN,
    phone: "0501234567",
    permissions: Object.values(PERMISSIONS),
    department: "الإدارة",
    status: "active",
  },
  {
    id: 2,
    name: "محمد عبدالرحمن",
    email: "supervision@school.com",
    password: "123456",
    role: ROLES.SUPERVISION,
    phone: "0551234567",
    permissions: ROLE_PERMISSIONS[ROLES.SUPERVISION],
    department: "الإشراف",
    status: "active",
  },
  {
    id: 3,
    name: "خالد أحمد",
    email: "accounting@school.com",
    password: "123456",
    role: ROLES.ACCOUNTING,
    phone: "0561234567",
    permissions: ROLE_PERMISSIONS[ROLES.ACCOUNTING],
    department: "المحاسبة",
    status: "active",
  },
];

