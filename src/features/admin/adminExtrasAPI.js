/**
 * @fileOverview API الإدارة العامة الإضافية - Admin
 * @description: تخصصات (Specializations)، شكاوى (Complaints - قراءة فقط)، حافلات (Buses)
 * ربط حقيقي مع AdminSpecializController, ComplaintController::index, AdminAuthController::AddBus, SchoolTripController::studentsByBus
 */

import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api/axiosClient";
import { ADMIN } from "../../services/api/endpoints";
import { extractList, extractObject } from "../../services/api/responseHelpers";

// ============================================================
// SPECIALIZATIONS
// ============================================================
export async function fetchSpecializations() {
  const response = await apiGet(ADMIN.SPECIALIZATIONS);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["specializations", "data"]);
  return { success: true, data: list.map((s) => ({ id: s.id, name: s.name })) };
}

export async function createSpecialization(name) {
  const response = await apiPost(ADMIN.SPECIALIZATIONS, { name });
  if (!response.success) return { success: false, message: response.message, errors: response.errors };
  const obj = extractObject(response.data, ["specialization", "data"]);
  return { success: true, data: { id: obj.id, name: obj.name }, message: response.data?.message };
}

export async function updateSpecialization(id, name) {
  const response = await apiPut(ADMIN.SPECIALIZATION_DETAIL(id), { name });
  if (!response.success) return { success: false, message: response.message, errors: response.errors };
  const obj = extractObject(response.data, ["specialization", "data"]);
  return { success: true, data: { id: obj.id, name: obj.name }, message: response.data?.message };
}

export async function deleteSpecialization(id) {
  const response = await apiDelete(ADMIN.SPECIALIZATION_DETAIL(id));
  if (!response.success) return { success: false, message: response.message };
  return { success: true, data: { id }, message: response.data?.message };
}

// ============================================================
// COMPLAINTS (read-only for admin)
// ============================================================
export async function fetchComplaints() {
  const response = await apiGet(ADMIN.COMPLAINTS);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["complaints", "data"]);
  return { success: true, data: list };
}

// ============================================================
// BUSES
// ============================================================
export async function createBus({ name, licensePlate }) {
  const response = await apiPost(ADMIN.BUS_CREATE, {
    name,
    license_plate: licensePlate || undefined,
  });
  if (!response.success) return { success: false, message: response.message, errors: response.errors };
  return { success: true, data: response.data, message: response.data?.message };
}

export async function fetchBusStudents(busId) {
  const response = await apiGet(ADMIN.BUS_STUDENTS(busId));
  if (!response.success) return { success: false, message: response.message };
  return { success: true, data: response.data };
}
