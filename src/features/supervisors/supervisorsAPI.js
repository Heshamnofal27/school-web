/**
 * @fileOverview API تعيين المشرفين على الشعب/الصفوف - Admin
 * @description: ربط جزئي حقيقي مع GradeSupervisorController
 *
 * ⚠️ ملاحظة هامة (Backend/Frontend Model Mismatch):
 * الواجهة الحالية (سحب وإفلات) مصممة لتعيين مشرف على "شعبة" (class) بينما الباك-إند
 * (`GradeSupervisorController`) يعيّن المشرف على مستوى "الصف الدراسي كاملاً" (grade level)
 * وليس شعبة بعينها - أي أن تعيين مشرف على شعبة 7-أ سيُطبَّق فعلياً على كل شعب الصف السابع.
 * تم اعتماد هذا كأفضل حل ممكن دون تعديل الباك-إند، وتم توضيحه هنا وفي GAPS.md.
 *
 * كذلك لا يوجد endpoint لعرض "قائمة كل المشرفين" ولا "قائمة كل التعيينات الحالية" في
 * `routes/api.php` الحالي (الموجود فقط: add-email / update / delete-email / assign / move /
 * unassign)، لذلك أُبقيت `fetchSupervisors` و `fetchAssignments` على بيانات تجريبية (mock)
 * مؤقتاً إلى حين إضافة GET /admin/supervisors و GET /admin/supervisors/assignments في الباك-إند.
 */

import { apiGet, apiPost } from "../../services/api/axiosClient";
import { ADMIN } from "../../services/api/endpoints";
import { extractList } from "../../services/api/responseHelpers";
import {
  SUPERVISORS,
  ASSIGNMENTS,
  getClassById,
  getSupervisorById,
} from "../../data/mock/supervisorsData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let nextId = Date.now();
let localAssignments = [...ASSIGNMENTS];
let cachedClasses = [];

// ------------------------------------------------------------
// ✅ real backend endpoints
// ------------------------------------------------------------
export async function fetchClasses() {
  const response = await apiGet(ADMIN.CLASSES);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["classes", "data", "class_rooms"]);
  cachedClasses = list.map((c) => ({
    id: c.id,
    name: c.name,
    nameEn: c.name,
    gradeId: c.grade_level_id,
    gradeName: c.grade?.name || "",
    gradeNameEn: c.grade?.name || "",
    studentCount: c.students_count ?? 0,
  }));
  return { success: true, data: cachedClasses };
}

export async function fetchGrades() {
  const response = await apiGet(ADMIN.GRADES_LIST);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["grades", "data"]);
  return { success: true, data: list.map((g) => ({ id: g.id, name: g.name, nameEn: g.name })) };
}

// ------------------------------------------------------------
// ⚠️ mock fallback (no listing endpoint on backend yet - see note above)
// ------------------------------------------------------------
export async function fetchSupervisors() {
  await delay(300);
  return { success: true, data: [...SUPERVISORS], _mock: true };
}

export async function fetchAssignments() {
  await delay(300);
  const enriched = localAssignments.map((a) => {
    const cls = getClassById(a.classId);
    const sup = getSupervisorById(a.supervisorId);
    return {
      ...a,
      className: cls?.name || "",
      classNameEn: cls?.nameEn || "",
      gradeName: cls?.gradeName || "",
      gradeNameEn: cls?.gradeNameEn || "",
      supervisorName: sup?.name || "",
    };
  });
  return { success: true, data: enriched, _mock: true };
}

// ------------------------------------------------------------
// ✅ real write actions (applied at grade level - see note above)
// ------------------------------------------------------------
const resolveGradeId = (classId) => {
  const cls = cachedClasses.find((c) => String(c.id) === String(classId)) || getClassById(classId);
  return cls?.gradeId ?? cls?.grade_level_id ?? null;
}
;

export async function assignSupervisor(classId, supervisorId) {
  const gradeId = resolveGradeId(classId);
  if (!gradeId) {
    return { success: false, message: "تعذر تحديد الصف الدراسي لهذه الشعبة" };
  }

  const response = await apiPost(ADMIN.SUPERVISOR_ASSIGN, {
    supervisor_id: supervisorId,
    grade_ids: [gradeId],
  });

  if (!response.success) {
    return { success: false, message: response.message || "alreadyAssigned" };
  }

  // مزامنة الحالة المحلية للعرض الفوري في الواجهة (إلى حين توفر endpoint لقراءة التعيينات)
  const cls = getClassById(classId);
  const sup = getSupervisorById(supervisorId);
  const newAssignment = { id: `a${nextId++}`, classId, supervisorId, isPrimary: true };
  localAssignments.push(newAssignment);

  return {
    success: true,
    data: {
      ...newAssignment,
      className: cls?.name || "",
      gradeName: cls?.gradeName || "",
      supervisorName: sup?.name || "",
    },
    message: response.data?.message || "assignSuccess",
  };
}

export async function moveSupervisor(assignmentId, toClassId) {
  const idx = localAssignments.findIndex((a) => a.id === assignmentId);
  if (idx === -1) return { success: false, message: "لم يتم العثور على التعيين" };

  const { supervisorId, classId: fromClassId } = localAssignments[idx];
  const fromGradeId = resolveGradeId(fromClassId);
  const toGradeId = resolveGradeId(toClassId);

  if (!fromGradeId || !toGradeId) {
    return { success: false, message: "بيانات غير صحيحة" };
  }

  if (fromGradeId === toGradeId) {
    // نفس الصف الدراسي - تحديث محلي فقط لتغيير الشعبة المعروضة
    localAssignments[idx].classId = toClassId;
    return { success: true, message: "assignSuccess" };
  }

  const response = await apiPost(ADMIN.SUPERVISOR_MOVE, {
    supervisor_id: supervisorId,
    from_grade_id: fromGradeId,
    to_grade_id: toGradeId,
  });

  if (!response.success) {
    return { success: false, message: response.message };
  }

  localAssignments[idx].classId = toClassId;
  return { success: true, message: response.data?.message || "assignSuccess" };
}

export async function unassignSupervisor(assignmentId) {
  const idx = localAssignments.findIndex((a) => a.id === assignmentId);
  if (idx === -1) {
    return { success: false, message: "لم يتم العثور على التعيين" };
  }

  const { classId } = localAssignments[idx];
  const gradeId = resolveGradeId(classId);

  if (gradeId) {
    const response = await apiPost(ADMIN.SUPERVISOR_UNASSIGN, { grade_id: gradeId });
    if (!response.success) {
      return { success: false, message: response.message };
    }
  }

  localAssignments.splice(idx, 1);
  return { success: true, message: "unassignSuccess" };
}
