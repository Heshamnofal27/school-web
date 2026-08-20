/**
 * @fileOverview API عمليات المشرف - الحضور والرحلات المدرسية
 * @description: ربط حقيقي مع AttendanceController و SchoolTripController (نطاق /supervisors)
 */

import { apiGet, apiPost, apiDelete } from "../../services/api/axiosClient";
import { SUPERVISOR } from "../../services/api/endpoints";
import { extractList } from "../../services/api/responseHelpers";

// ============================================================
// ATTENDANCE
// ============================================================
export async function takeAttendance({ studentId, date, status }) {
  const response = await apiPost(SUPERVISOR.ATTENDANCE_TAKE, {
    student_id: studentId,
    date,
    status, // present | absent | late
  });
  if (!response.success) return { success: false, message: response.message, errors: response.errors };
  return { success: true, data: response.data?.data, message: response.data?.message || "تم تسجيل الحضور" };
}

export async function cancelAttendance({ studentId, date }) {
  const response = await apiDelete(SUPERVISOR.ATTENDANCE_CANCEL, {
    data: { student_id: studentId, date },
  });
  if (!response.success) return { success: false, message: response.message };
  return { success: true, message: response.data?.message || "تم إلغاء تسجيل الحضور" };
}

export async function fetchAttendanceReport() {
  const response = await apiGet(SUPERVISOR.ATTENDANCE_VIEW);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["data", "records"]);
  return { success: true, data: list };
}

// ============================================================
// SCHOOL TRIPS
// ============================================================
export async function fetchTrips() {
  const response = await apiGet(SUPERVISOR.TRIPS_LIST);
  if (!response.success) return { success: false, message: response.message };
  const list = extractList(response.data, ["trips", "data"]);
  return { success: true, data: list };
}

export async function createTrip({ title, description, tripDate, location, classRoomId }) {
  const response = await apiPost(SUPERVISOR.TRIPS_CREATE, {
    title,
    description: description || undefined,
    trip_date: tripDate,
    location,
    class_room_id: classRoomId,
  });
  if (!response.success) return { success: false, message: response.message, errors: response.errors };
  return { success: true, data: response.data?.trip, message: response.data?.message || "تم إنشاء الرحلة بنجاح" };
}

export async function fetchTripConfirmedStudents(tripId) {
  const response = await apiGet(SUPERVISOR.TRIP_CONFIRMED_STUDENTS(tripId));
  if (!response.success) return { success: false, message: response.message };
  return { success: true, data: response.data };
}
