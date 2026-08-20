/**
 * @fileOverview API إدارة الفصول (Classes) - Admin
 * @description: ربط حقيقي مع ClassRoomController (apiResource) و GradeManagementController
 */

import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api/axiosClient";
import { ADMIN } from "../../services/api/endpoints";
import { extractList, extractObject } from "../../services/api/responseHelpers";

const normalizeClass = (c) => ({
  id: c.id,
  name: c.name,
  nameEn: c.name,
  section: c.section || "",
  gradeId: c.grade_level_id ?? c.gradeId,
  gradeName: c.grade?.name || c.grade_name || "",
  studentCount: c.students_count ?? c.student_count ?? c.studentCount ?? 0,
  raw: c,
});

const normalizeGrade = (g) => ({
  id: g.id,
  name: g.name,
  nameEn: g.name,
  raw: g,
});

export async function fetchAllClasses() {
  const response = await apiGet(ADMIN.CLASSES);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["classes", "data", "class_rooms"]);
  return { success: true, data: list.map(normalizeClass) };
}

export async function fetchAllGrades() {
  const response = await apiGet(ADMIN.GRADES_LIST);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["grades", "data"]);
  return { success: true, data: list.map(normalizeGrade) };
}

export async function createClass({ name, gradeId, section = "" }) {
  const response = await apiPost(ADMIN.CLASSES, {
    name,
    section: section || null,
    grade_level_id: gradeId,
  });

  if (!response.success) {
    return { success: false, message: response.message, errors: response.errors };
  }

  const obj = extractObject(response.data, ["data", "class_room", "classRoom"]);
  return { success: true, data: normalizeClass(obj), message: response.data?.message || "تم إضافة الشعبة بنجاح" };
}

export async function updateClass(id, { name, section, gradeId, studentCount }) {
  const response = await apiPut(ADMIN.CLASS_DETAIL(id), {
    name,
    section: section ?? null,
    grade_level_id: gradeId,
  });

  if (!response.success) {
    return { success: false, message: response.message, errors: response.errors };
  }

  const obj = extractObject(response.data, ["data", "class_room", "classRoom"]);
  return {
    success: true,
    data: { ...normalizeClass(obj), studentCount: studentCount ?? normalizeClass(obj).studentCount },
    message: response.data?.message || "تم تعديل الشعبة بنجاح",
  };
}

export async function deleteClass(id) {
  const response = await apiDelete(ADMIN.CLASS_DETAIL(id));
  if (!response.success) return { success: false, message: response.message };
  return { success: true, data: { id }, message: response.data?.message || "تم حذف الشعبة بنجاح" };
}
