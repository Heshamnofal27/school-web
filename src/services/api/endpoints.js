/**
 * 📍 API ENDPOINTS MAP
 * =====================
 * مصدر واحد للحقيقة لكل نقاط النهاية (endpoints) في الباك-إند Laravel،
 * مأخوذة مباشرة من `routes/api.php`.
 *
 * ⚠️ يغطي هذا الملف فقط الأدوار المستهدفة لهذا التطبيق:
 *    Admin, Supervisor, Accountant
 * (تم تعمّد استبعاد Student / Teacher / Guardian(Parent) لأنها تخص منصة أخرى)
 */

// ============================================================
// PUBLIC / PASSWORD RESET
// ============================================================
export const PUBLIC = {
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_CODE: "/verify-code",
  RESET_PASSWORD: "/reset-password",
};

// ============================================================
// AUTH — واجهة موحّدة لكل الأدوار (login/register/logout)
// الباك-إند يكتشف الرول تلقائياً ويعيده ضمن الاستجابة (role)
// ============================================================
export const AUTH_UNIFIED = {
  CHECK_EMAIL: "/register/check-email",
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",
};

// نقاط نهاية "الملف الشخصي" ما زالت خاصة بكل دور على حدة
export const AUTH_PROFILE = {
  admin: "/admin/profile",
  supervisor: "/supervisors/profile",
  accountant: "/accountants/profile",
};

// ============================================================
// ADMIN (prefix /admin, guard: admin)
// ============================================================
export const ADMIN = {
  // Students
  STUDENTS_CREATE: "/admin/students",
  STUDENT_UPDATE: (id) => `/admin/editstudentinfo/${id}`,

  // Teachers (excluded from this web client's UI per scope, kept for completeness)
  ADD_TEACHER: "/admin/add-teacher",

  // Classes (apiResource)
  CLASSES: "/admin/classes",
  CLASS_DETAIL: (id) => `/admin/classes/${id}`,

  // Student transfer between classes
  TRANSFER_STUDENT: "/admin/students/transfer",
  STUDENT_TRANSFER_HISTORY: (id) => `/admin/students/${id}/transfers`,

  // Specializations (apiResource)
  SPECIALIZATIONS: "/admin/specializations",
  SPECIALIZATION_DETAIL: (id) => `/admin/specializations/${id}`,

  // Supervisors management
  SUPERVISOR_ADD_EMAIL: "/admin/supervisors/add-email",
  SUPERVISOR_UPDATE: (id) => `/admin/supervisors/${id}`,
  SUPERVISOR_DELETE_BY_EMAIL: "/admin/supervisors/delete-email",
  SUPERVISOR_ASSIGN: "/admin/supervisors/assign",
  SUPERVISOR_MOVE: "/admin/supervisors/move",
  SUPERVISOR_UNASSIGN: "/admin/supervisors/unassign",

  // Grades / grade levels
  GRADES_LIST: "/admin/Get/grades",
  GRADE_DETAIL: (id) => `/admin/grades/${id}`,
  GRADE_CREATE: "/admin/grades",
  GRADE_UPDATE: (id) => `/admin/grades/${id}`,
  GRADE_DELETE: (id) => `/admin/grades/${id}`,

  // Accountants management
  ACCOUNTANTS_LIST: "/admin/accountants",
  ACCOUNTANT_ADD_EMAIL: "/admin/accountants/add-email",
  ACCOUNTANT_UPDATE: (id) => `/admin/accountants/${id}`,
  ACCOUNTANT_DELETE: (id) => `/admin/accountants/${id}`,

  // Guardians management (excluded from UI scope - Parent role - kept for completeness only)
  GUARDIANS_LIST: "/admin/guardians",
  GUARDIAN_ADD_EMAIL: "/admin/guardians/add-email",
  GUARDIAN_UPDATE: (id) => `/admin/guardians/${id}`,
  GUARDIAN_DELETE: (id) => `/admin/guardians/${id}`,
  GUARDIAN_ASSIGN_STUDENT: "/admin/guardians/assign-student-to-guardian",
  GUARDIAN_UNASSIGNED_STUDENTS: "/admin/guardians/unassigned-students",
  GUARDIAN_RECHARGE: (id) => `/admin/guardians/${id}/recharge`,

  // Complaints (read-only for admin)
  COMPLAINTS: "/admin/complaints",

  // Bus / school trips
  BUS_STUDENTS: (busId) => `/admin/bus/${busId}/students`,
  BUS_CREATE: "/admin/buses",
};

// ============================================================
// ACCOUNTANT (prefix /accountants, guard: accountant)
// ============================================================
export const ACCOUNTANT = {
  PAYMENTS_LIST: "/accountants/Getpayments",
  PAYMENTS_CREATE: "/accountants/Addpayments",
  DUE_PAYMENT_TEMPLATES_BY_CLASS: (classRoomId) =>
    `/accountants/class-rooms/${classRoomId}/due-payment-templates`,
  REPORT_MONTHLY_SUMMARY: "/accountants/report/monthly-summary",
  REPORT_GUARDIAN_SUMMARY: "/accountants/report/guardian-summary",
  UPDATE_PENALTIES: "/accountants/due-payments/update-penalties",
};

// ============================================================
// SUPERVISOR (prefix /supervisors, guard: supervisor)
// ============================================================
export const SUPERVISOR = {
  TRIP_CONFIRMED_STUDENTS: (tripId) => `/supervisors/school-trips/${tripId}/confirmed-students`,
  STUDENT_TRANSFER_HISTORY: (studentId) => `/supervisors/students/${studentId}/transfers`,

  ATTENDANCE_TAKE: "/supervisors/attendance/take",
  ATTENDANCE_CANCEL: "/supervisors/attendance/cancel",
  ATTENDANCE_VIEW: "/supervisors/attendance/view",

  TRIPS_CREATE: "/supervisors/trips",
  TRIPS_LIST: "/supervisors/school-trips",
};

export default { PUBLIC, AUTH_UNIFIED, AUTH_PROFILE, ADMIN, ACCOUNTANT, SUPERVISOR };
