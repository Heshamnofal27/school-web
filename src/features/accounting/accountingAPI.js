import {
  getAccountingDashboard,
  getStudentFinancialRecords,
  getTuitionSettings,
  saveTuitionPlans,
  saveInstallmentPlans,
  getStudentBilling,
  getAllStudentOptions,
  recordPayment,
} from "../../data/mock/accountingData";
import { apiGet, apiPost } from "../../services/api/axiosClient";
import { ACCOUNTANT } from "../../services/api/endpoints";
import { extractList, extractObject } from "../../services/api/responseHelpers";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * ⚠️ ملاحظة (Backend Gap):
 * الصفحات التالية: FinancialDashboard (بتفصيل شهري كامل)، TuitionSettings
 * (خطط أقساط/رسوم دراسية)، StudentBillingPage و StudentFinancialDirectory
 * (استعلام مالي لكل طالب) تعتمد على مفاهيم غير موجودة في الباك-إند الحالي، الذي
 * يعمل بمنطق "دفعات مستحقة على ولي الأمر" (guardian) وليس "فوترة لكل طالب" أو
 * "خطط أقساط قابلة للتعديل". لذلك أُبقيت الدوال أدناه على mock مؤقتاً حتى تتوفر
 * endpoints مطابقة، وتم توفير دوال حقيقية بديلة (fetchRealPayments,
 * createDuePayment, fetchMonthlySummary, fetchGuardianSummary, ...) في أسفل
 * الملف مع صفحة جديدة DuePaymentsManager تستخدمها فعلياً. راجع GAPS.md.
 */
export async function fetchFinancialDashboard() {
  await delay(300);
  const data = getAccountingDashboard();
  return { success: true, data, message: null, _mock: true };
}

export async function fetchTuitionSettings() {
  await delay(200);
  return { success: true, data: getTuitionSettings(), _mock: true };
}

export async function updateTuitionPlans(plans) {
  await delay(200);
  return { ...saveTuitionPlans(plans), _mock: true };
}

export async function updateInstallmentPlans(plans) {
  await delay(200);
  return { ...saveInstallmentPlans(plans), _mock: true };
}

export async function fetchStudentFinancialRecords() {
  await delay(200);
  return { success: true, data: getStudentFinancialRecords(), _mock: true };
}

export async function fetchStudentOptions() {
  await delay(150);
  return { success: true, data: getAllStudentOptions(), _mock: true };
}

export async function fetchStudentBilling(studentId) {
  await delay(250);
  const data = getStudentBilling(studentId);
  if (!data) return { success: false, message: "الطالب غير موجود" };
  return { success: true, data, _mock: true };
}

export async function submitPayment(studentId, amount, method) {
  await delay(300);
  return { ...recordPayment(studentId, amount, method), _mock: true };
}

// ================================================================
// ✅ REAL backend integration (AccountantPaymentController)
// used by the new "DuePaymentsManager" page (features/accounting/pages)
// ================================================================

const normalizePayment = (p) => ({
  id: p.id,
  guardianId: p.guardian_id,
  accountantId: p.accountant_id,
  templateId: p.template_id,
  amount: p.amount,
  penalty: p.penalty,
  description: p.description,
  dueDate: p.due_date,
  status: p.status,
  raw: p,
});

/** GET /accountants/Getpayments */
export async function fetchRealPayments() {
  const response = await apiGet(ACCOUNTANT.PAYMENTS_LIST);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["payments", "data", "due_payments"]);
  return { success: true, data: list.map(normalizePayment) };
}

/** POST /accountants/Addpayments — creates a due payment for a guardian */
export async function createDuePayment({ guardianId, templateId, dueDate }) {
  const response = await apiPost(ACCOUNTANT.PAYMENTS_CREATE, {
    guardian_id: guardianId,
    template_id: templateId,
    due_date: dueDate || undefined,
  });
  if (!response.success) {
    return { success: false, message: response.message, errors: response.errors };
  }
  const obj = extractObject(response.data, ["due_payment", "data"]);
  return { success: true, data: normalizePayment(obj), message: response.data?.message || "تمت إضافة الدفعة المستحقة" };
}

/** GET /accountants/class-rooms/{id}/due-payment-templates */
export async function fetchDuePaymentTemplatesByClass(classRoomId) {
  const response = await apiGet(ACCOUNTANT.DUE_PAYMENT_TEMPLATES_BY_CLASS(classRoomId));
  if (!response.success) return { success: false, message: response.message };
  return { success: true, data: response.data };
}

/** GET /accountants/report/monthly-summary */
export async function fetchMonthlySummary() {
  const response = await apiGet(ACCOUNTANT.REPORT_MONTHLY_SUMMARY);
  if (!response.success) return { success: false, message: response.message };
  return { success: true, data: response.data };
}

/** GET /accountants/report/guardian-summary */
export async function fetchGuardianSummary() {
  const response = await apiGet(ACCOUNTANT.REPORT_GUARDIAN_SUMMARY);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["data", "guardians", "summary"]);
  return { success: true, data: list };
}

/** POST /accountants/due-payments/update-penalties */
export async function updateOverduePenalties() {
  const response = await apiPost(ACCOUNTANT.UPDATE_PENALTIES);
  if (!response.success) return { success: false, message: response.message };
  return { success: true, data: response.data, message: response.data?.message || "تم تحديث الغرامات" };
}
