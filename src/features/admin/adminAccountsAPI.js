/**
 * @fileOverview API functions لإنشاء/إدارة حسابات (مشرف/محاسب) من لوحة
 * الأدمن — ربط حقيقي مع Laravel عبر axiosClient، يحل محل الاعتماد على
 * البيانات الوهمية (data/mock/authorizedEmails) الذي كان يُستخدم سابقاً.
 *
 * ⚠️ نطاق هذا الملف مقصود: مشرف (supervisor) ومحاسب (accountant) فقط،
 * لأنهما الدوران الوحيدان اللذان يستخدمان "بريد يضيفه الأدمن بلا كلمة
 * مرور، ثم يُكمل صاحبه التسجيل عبر /register" بنفس الشكل تماماً. أما
 * معلم (teacher) وطالب (student) وولي أمر (guardian) فتستخدم عقود
 * (payload) مختلفة تماماً في الباك-إند:
 *   - معلم: POST /admin/add-teacher — يقبل email فقط (بلا name إطلاقاً).
 *   - طالب: POST /admin/students — يتطلب Full_name (وليس name) + حقول
 *     أخرى (class_room_id, guardian_id...)، وهو إنشاء سجل طالب كامل وليس
 *     مجرد "بريد مصرّح به".
 *   - ولي أمر: POST /admin/guardians/add-email — نفس نمط المحاسب لكن
 *     ضمن مسار مختلف.
 * دمجها في نموذج عام واحد (كما كان في CreateAccounts.jsx سابقاً) كان
 * يُنتج طلبات غير متوافقة مع الباك-إند لثلاثة من الأدوار الخمسة. راجع
 * تقرير التدقيق للتفاصيل والتوصية بشاشات مخصّصة لكل منها.
 */

import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api/axiosClient";
import { ADMIN } from "../../services/api/endpoints";

/**
 * إضافة بريد مشرف مصرّح به (POST /admin/supervisors/add-email).
 * ⚠️ الباك-إند يتطلب name هنا (على عكس المحاسب) — راجع
 * AdminAuthController::addEmail.
 */
export async function addSupervisorEmail({ email, name }) {
  const response = await apiPost(ADMIN.SUPERVISOR_ADD_EMAIL, { email, name });
  if (!response.success) {
    throw new Error(response.message || "تعذر إضافة بريد المشرف");
  }
  return response.data;
}

export async function updateSupervisor(id, updates) {
  const response = await apiPut(ADMIN.SUPERVISOR_UPDATE(id), updates);
  if (!response.success) {
    throw new Error(response.message || "تعذر تعديل بيانات المشرف");
  }
  return response.data;
}

/**
 * حذف مشرف عبر بريده الإلكتروني (وليس عبر id — هكذا صمّم الباك-إند
 * هذا المسار تحديداً). راجع AdminAuthController::deleteByEmail.
 */
export async function deleteSupervisorByEmail(email) {
  const response = await apiDelete(ADMIN.SUPERVISOR_DELETE_BY_EMAIL, { data: { email } });
  if (!response.success) {
    throw new Error(response.message || "تعذر حذف المشرف");
  }
  return response.data;
}

/**
 * إضافة بريد محاسب مصرّح به (POST /admin/accountants/add-email).
 * ⚠️ لا يقبل هذا المسار حقل name إطلاقاً — الباك-إند يضع اسماً مؤقتاً
 * ("Pending Registration") يُستبدل لاحقاً عند إكمال المحاسب تسجيله عبر
 * /register (حقل name اختياري هناك). راجع AdminAccountantController::addEmail.
 */
export async function addAccountantEmail({ email }) {
  const response = await apiPost(ADMIN.ACCOUNTANT_ADD_EMAIL, { email });
  if (!response.success) {
    throw new Error(response.message || "تعذر إضافة بريد المحاسب");
  }
  return response.data;
}

export async function updateAccountant(id, updates) {
  const response = await apiPut(ADMIN.ACCOUNTANT_UPDATE(id), updates);
  if (!response.success) {
    throw new Error(response.message || "تعذر تعديل بيانات المحاسب");
  }
  return response.data;
}

export async function deleteAccountant(id) {
  const response = await apiDelete(ADMIN.ACCOUNTANT_DELETE(id));
  if (!response.success) {
    throw new Error(response.message || "تعذر حذف المحاسب");
  }
  return response.data;
}

/**
 * قائمة المحاسبين (GET /admin/accountants).
 * ⚠️ لا يوجد مسار مقابل لعرض قائمة المشرفين في الباك-إند حالياً
 * (AdminAuthController لا يحتوي على index()) — راجع تقرير التدقيق،
 * القسم "فجوات في الباك-إند"، للتوصية بإضافته.
 */
export async function listAccountants() {
  const response = await apiGet(ADMIN.ACCOUNTANTS_LIST);
  if (!response.success) {
    throw new Error(response.message || "تعذر جلب قائمة المحاسبين");
  }
  return response.data?.accountants ?? [];
}
