/**
 * @fileOverview API نقل الطلاب بين الشعب - Admin
 * @description: ربط جزئي حقيقي مع ClassTransferController + ClassRoomController + GradeManagementController
 *
 * ⚠️ ملاحظة هامة (Backend Gap):
 * لا يحتوي `routes/api.php` الحالي على أي endpoint لجلب "كل الطلاب" أو "طلاب شعبة معينة"
 * ضمن مسارات /admin. الموجود فقط:
 *   - POST /admin/students        (إنشاء طالب)
 *   - POST /admin/editstudentinfo/{id} (تعديل طالب)
 *   - POST /admin/students/transfer     (نقل طالب واحد بين الشعب)
 *   - GET  /admin/students/{id}/transfers (سجل نقل طالب واحد)
 * لذلك أبقينا `fetchAllStudents` و `fetchStudentsByClass` و `fetchTransferHistory`
 * (العامة لكل الطلاب) على البيانات التجريبية (mock) مؤقتاً، مع توثيق ذلك بوضوح.
 * راجع ملف GAPS.md المرفق مع المشروع لمزيد من التفاصيل واقتراح الحل (endpoint جديد
 * على الباك-إند مثل GET /admin/students).
 */

import { apiGet, apiPost } from "../../services/api/axiosClient";
import { ADMIN } from "../../services/api/endpoints";
import { extractList, extractObject } from "../../services/api/responseHelpers";
import { STUDENTS, TRANSFER_HISTORY, transferStudents as mockTransfer } from "../../data/mock/studentsData";

let localStudents = STUDENTS.map((s) => ({ ...s }));
let localHistory = [...TRANSFER_HISTORY];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------
// ⚠️ mock fallback (no backend endpoint available yet - see note above)
// ------------------------------------------------------------
export async function fetchAllStudents() {
  await delay(250);
  return { success: true, data: localStudents.map((s) => ({ ...s })), _mock: true };
}

export async function fetchStudentsByClass(classId) {
  await delay(150);
  return {
    success: true,
    data: localStudents.filter((s) => s.classId === classId).map((s) => ({ ...s })),
    _mock: true,
  };
}

// ------------------------------------------------------------
// ✅ real backend endpoints
// ------------------------------------------------------------
export async function fetchAllClasses() {
  const response = await apiGet(ADMIN.CLASSES);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["classes", "data", "class_rooms"]);
  return {
    success: true,
    data: list.map((c) => ({ id: c.id, name: c.name, section: c.section || "", gradeId: c.grade_level_id })),
  };
}

export async function fetchAllGrades() {
  const response = await apiGet(ADMIN.GRADES_LIST);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["grades", "data"]);
  return { success: true, data: list.map((g) => ({ id: g.id, name: g.name })) };
}

/**
 * ينقل كل طالب على حدة عبر POST /admin/students/transfer (الباك-إند يدعم طالب واحد بكل نداء)
 */
export async function executeTransfer(studentIds, fromClassId, toClassId, reason = "") {
  const ids = Array.isArray(studentIds) ? studentIds : [studentIds];
  const results = [];

  for (const studentId of ids) {
    // eslint-disable-next-line no-await-in-loop
    const response = await apiPost(ADMIN.TRANSFER_STUDENT, {
      student_id: studentId,
      to_class_room_id: toClassId,
      reason: reason || undefined,
    });
    results.push({ studentId, ...response });
  }

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    return {
      success: false,
      message: failed[0].message || "فشل نقل بعض الطلاب",
      data: results,
    };
  }

  // مزامنة النسخة المحلية (mock) حتى تبقى شاشات القائمة متوافقة إلى حين توفر endpoint حقيقي للقوائم
  const mockResult = mockTransfer(ids, fromClassId, toClassId);
  if (mockResult.success) {
    localStudents = STUDENTS.map((s) => ({ ...s }));
    localHistory = [...TRANSFER_HISTORY];
  }

  return { success: true, data: results.map((r) => extractObject(r.data, ["data"])), message: "تم نقل الطلاب بنجاح" };
}

/**
 * سجل نقل طالب واحد - endpoint حقيقي
 */
export async function fetchStudentTransferHistory(studentId) {
  const response = await apiGet(ADMIN.STUDENT_TRANSFER_HISTORY(studentId));
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["transfers", "data"]);
  return { success: true, data: list };
}

// ⚠️ لا يوجد endpoint لسجل نقل "كل" الطلاب دفعة واحدة - نستخدم mock مؤقتاً
export async function fetchTransferHistory() {
  await delay(150);
  return { success: true, data: [...localHistory], _mock: true };
}
