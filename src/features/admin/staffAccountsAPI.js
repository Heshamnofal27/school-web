/**
 * @fileOverview API إدارة حسابات المشرفين والمحاسبين - Admin
 * @description: ربط حقيقي مع AdminAuthController (supervisors) و AdminAccountantController (accountants)
 *
 * ⚠️ ملاحظة (Backend Gap): لا يوجد endpoint لعرض "قائمة كل المشرفين" في الباك-إند الحالي
 * (الموجود فقط: إضافة بريد / تعديل / حذف). أما المحاسبون فلديهم GET /admin/accountants
 * الذي نستخدمه فعلياً هنا. راجع GAPS.md.
 */

import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api/axiosClient";
import { ADMIN } from "../../services/api/endpoints";
import { extractList } from "../../services/api/responseHelpers";

// ============================================================
// ACCOUNTANTS (full CRUD + list supported by backend)
// ============================================================
export async function fetchAccountants() {
  const response = await apiGet(ADMIN.ACCOUNTANTS_LIST);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["accountants", "data"]);
  return {
    success: true,
    data: list.map((a) => ({ id: a.id, name: a.name || a.Full_name, email: a.email, phone: a.phone })),
  };
}

export async function addAccountantEmail(email) {
  const response = await apiPost(ADMIN.ACCOUNTANT_ADD_EMAIL, { email });
  if (!response.success) return { success: false, message: response.message, errors: response.errors };
  return { success: true, data: response.data, message: response.data?.message || "تمت إضافة البريد بنجاح" };
}

export async function updateAccountant(id, payload) {
  const response = await apiPut(ADMIN.ACCOUNTANT_UPDATE(id), payload);
  if (!response.success) return { success: false, message: response.message, errors: response.errors };
  return { success: true, data: response.data, message: response.data?.message || "تم التحديث بنجاح" };
}

export async function deleteAccountant(id) {
  const response = await apiDelete(ADMIN.ACCOUNTANT_DELETE(id));
  if (!response.success) return { success: false, message: response.message };
  return { success: true, data: { id }, message: response.data?.message || "تم الحذف بنجاح" };
}

// ============================================================
// SUPERVISORS (add/update/delete supported; NO list endpoint - see note above)
// ============================================================
export async function addSupervisorEmail(email) {
  const response = await apiPost(ADMIN.SUPERVISOR_ADD_EMAIL, { email });
  if (!response.success) return { success: false, message: response.message, errors: response.errors };
  return { success: true, data: response.data, message: response.data?.message || "تمت إضافة البريد بنجاح" };
}

export async function updateSupervisorAccount(id, payload) {
  const response = await apiPut(ADMIN.SUPERVISOR_UPDATE(id), payload);
  if (!response.success) return { success: false, message: response.message, errors: response.errors };
  return { success: true, data: response.data, message: response.data?.message || "تم التحديث بنجاح" };
}

export async function deleteSupervisorByEmail(email) {
  const response = await apiDelete(ADMIN.SUPERVISOR_DELETE_BY_EMAIL, { data: { email } });
  if (!response.success) return { success: false, message: response.message };
  return { success: true, message: response.data?.message || "تم الحذف بنجاح" };
}
