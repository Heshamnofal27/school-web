/**
 * @fileOverview API functions للمصادقة - ربط حقيقي مع Laravel backend عبر Axios
 * @description: تسجيل الدخول/الخروج عبر الواجهة الموحّدة الجديدة (AuthController)
 *
 * ⚙️ تحديث (باك-إند جديد): تسجيل الدخول والخروج أصبحا موحّدين لكل الأدوار عبر
 * نقطة نهاية واحدة (`POST /login`, `POST /logout`) بدل استدعاء 3 نقاط نهاية
 * منفصلة (admin/supervisors/accountants) بالتجربة والخطأ كما كان سابقاً.
 * الباك-إند يكتشف دور المستخدم تلقائياً بالبحث في كل الجداول، ويُعيده ضمن
 * حقل `role` في الاستجابة، ثم يُستخدم هذا الدور لاحقاً في:
 *   - تحديد الصفحة الرئيسية بعد الدخول (dashboardPath في roles.js)
 *   - اختيار endpoint "الملف الشخصي" الصحيح (لا يزال مقسّماً حسب الدور)
 *
 * فقط أدوار Admin / Supervisor / Accountant مسموح لها بالدخول لهذه الواجهة
 * (الأدوار الأخرى التي قد يُعيدها الباك-إند مثل student/teacher/guardian
 * تُرفض هنا صراحة لأنها تخص منصة أخرى بالكامل).
 */

import { apiGet, apiPost, setAuthToken, setAuthRole, getAuthRole, clearAuthToken, clearAuthRole } from "../../services/api/axiosClient";
import { AUTH_UNIFIED, AUTH_PROFILE } from "../../services/api/endpoints";

const ALLOWED_ROLES = ["admin", "supervisor", "accountant"];

const normalizeUser = (userSource, role, fallbackEmail) => {
  const safeUser = { ...(userSource || {}) };
  delete safeUser.password;

  return {
    ...safeUser,
    id: safeUser.id,
    name: safeUser.name || safeUser.Full_name || safeUser.full_name || safeUser.email || fallbackEmail,
    email: safeUser.email || fallbackEmail,
    phone: safeUser.phone || safeUser.mobile || "",
    role,
    permissions: safeUser.permissions || [],
    department: safeUser.department || "",
    status: safeUser.status || "active",
  };
};

/**
 * @description: تسجيل الدخول عبر الواجهة الموحّدة الجديدة (POST /login)
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token:string, user:object}>}
 */
export async function loginWithEmail(email, password) {
  if (!email || !password) {
    throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان");
  }

  const response = await apiPost(AUTH_UNIFIED.LOGIN, { email, password });

  if (!response.success) {
    throw new Error(response.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }

  const { role, token, user } = response.data || {};

  if (!ALLOWED_ROLES.includes(role)) {
    // الدور موجود ومصادقة صحيحة، لكنه يخص منصة أخرى (طالب/معلم/ولي أمر)
    // لا نسمح له بالدخول لهذه الواجهة الإدارية
    throw new Error("هذا الحساب غير مخوّل بالدخول إلى لوحة التحكم الإدارية");
  }

  setAuthToken(token);
  setAuthRole(role);

  return { token, user: normalizeUser(user, role, email) };
}

/**
 * الأدوار التي يُسمح لها بإكمال التسجيل الذاتي عبر *هذه* الواجهة الإدارية
 * تحديداً. ملاحظة: الأدمن نفسه مستبعد أصلاً من التسجيل الذاتي على مستوى
 * الباك-إند (راجع AuthController::preAuthorizedModels)، لذلك لن يُعاد
 * role === "admin" أبداً من check-email/register. أما student/teacher/
 * guardian فهي أدوار صحيحة يدعمها الباك-إند الموحّد، لكنها تخص منصة
 * أخرى (تطبيق الموبايل)، فنرفضها صراحة هنا بنفس منطق ALLOWED_ROLES
 * المستخدم في loginWithEmail حتى لا يُنشئ مستخدم من النوع الخطأ حساباً
 * ناجحاً هنا ثم يكتشف أنه لا يمكنه استخدام لوحة التحكم هذه إطلاقاً.
 */
const SELF_REGISTERABLE_ROLES = ["supervisor", "accountant"];

/**
 * @description: الخطوة 1 من التسجيل — التحقق من أن البريد مصرّح به من
 * الأدمن مسبقاً (POST /register/check-email)، دون إنشاء أي حساب.
 * @param {string} email
 * @returns {Promise<{role: string}>}
 */
export async function checkEmailForRegistration(email) {
  if (!email) {
    throw new Error("البريد الإلكتروني مطلوب");
  }

  const response = await apiPost(AUTH_UNIFIED.CHECK_EMAIL, { email });

  if (!response.success) {
    // 403 = البريد غير مصرح به، 409 = الحساب موجود بالفعل (له كلمة مرور)
    throw new Error(response.message || "تعذر التحقق من البريد الإلكتروني");
  }

  const { role } = response.data || {};

  if (!SELF_REGISTERABLE_ROLES.includes(role)) {
    throw new Error(
      "هذا النوع من الحسابات لا يُسجَّل عبر هذه اللوحة. يرجى استخدام التطبيق أو التواصل مع الإدارة.",
    );
  }

  return { role };
}

/**
 * @description: الخطوة 2 من التسجيل — إكمال إنشاء الحساب بعد نجاح
 * check-email (POST /register). الباك-إند يُعيد token مباشرة (تسجيل
 * دخول تلقائي)، لذا نُعيد نفس شكل الاستجابة الذي يتوقعه authSlice
 * (loginSuccess) تماماً كما تفعل loginWithEmail.
 * @param {{email:string, password:string, password_confirmation:string, name?:string}} payload
 * @returns {Promise<{token:string, user:object}>}
 */
export async function completeRegistration({ email, password, password_confirmation, name }) {
  if (!email || !password || !password_confirmation) {
    throw new Error("البريد الإلكتروني وكلمة المرور وتأكيدها مطلوبة");
  }

  const response = await apiPost(AUTH_UNIFIED.REGISTER, {
    email,
    password,
    password_confirmation,
    name,
  });

  if (!response.success) {
    throw new Error(response.message || "تعذر إنشاء الحساب");
  }

  const { role, token, user } = response.data || {};

  if (!SELF_REGISTERABLE_ROLES.includes(role)) {
    // حماية إضافية: لا يجب أن يصل الكود إلى هنا لأن check-email كان قد
    // رفض بالفعل، لكن نتحقق مرة أخرى دفاعياً (مثلاً إن نُودي register
    // مباشرة دون المرور بـ check-email).
    throw new Error("هذا النوع من الحسابات لا يُسجَّل عبر هذه اللوحة.");
  }

  setAuthToken(token);
  setAuthRole(role);

  return { token, user: normalizeUser(user, role, email) };
}

/**
 * @description: جلب بيانات المستخدم الحالي بناءً على الدور المخزن محلياً
 * (لا يزال endpoint الملف الشخصي مقسّماً حسب الدور في الباك-إند)
 */
export async function getCurrentUser() {
  const role = getAuthRole();
  if (!role || !AUTH_PROFILE[role]) {
    throw new Error("لا يوجد دور مصادقة محفوظ");
  }

  const response = await apiGet(AUTH_PROFILE[role]);
  if (!response.success) {
    throw new Error(response.message || "تعذر جلب بيانات المستخدم");
  }

  const payload = response.data?.data ?? response.data;
  return normalizeUser(payload, role);
}

/**
 * @description: تسجيل الخروج عبر الواجهة الموحّدة الجديدة (POST /logout)
 * يعمل بنفس الطريقة بغض النظر عن نوع الحساب المصادَق (Sanctum لا يفرّق بين الأدوار هنا)
 */
export async function logout() {
  try {
    await apiPost(AUTH_UNIFIED.LOGOUT, null);
  } catch {
    // نتجاهل فشل استدعاء تسجيل الخروج على الخادم؛ سنمسح الجلسة محلياً بأي حال
  } finally {
    clearAuthToken();
    clearAuthRole();
  }
}
