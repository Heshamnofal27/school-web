/**
 * ⚠️ ملاحظة (Backend Gap): هذا الملف بأكمله (سلوك الطلاب، التقييمات، التواصل مع
 * أولياء الأمور، العقوبات، الاجتماعات، وقوائم الطلاب/الشعب الخاصة بالمشرف) لا يقابله
 * أي endpoint في `routes/api.php` الحالي. الموجود فعلياً لنطاق /supervisors هو فقط:
 * الحضور والغياب (attendance/take|cancel|view) والرحلات المدرسية (trips) —
 * وقد تم ربطهما بشكل حقيقي في ملف `supervisorOpsAPI.js` وصفحتي AttendanceManager
 * و SchoolTripsManager الجديدتين. يبقى هذا الملف على بيانات تجريبية بالكامل إلى حين
 * إضافة endpoints مطابقة في الباك-إند. راجع GAPS.md لمزيد من التفاصيل.
 */
import {
  getSupervisorByUserId, getClassesBySupervisor, getStudentsByClass,
  getBehaviorsByStudent, getEvaluationsByStudent,
  getParentContactsByStudent, getPenaltiesByStudent,
  getClassStats, getAttendanceByClass,
  getReportsByStudent, saveStudentReport,
  BEHAVIORS, EVALUATIONS, PARENT_CONTACTS, PENALTIES, PARENT_MEETINGS,
} from "../../data/mock/supervisionData";
import { CLASSES } from "../../data/mock/supervisorsData";
import { STUDENTS } from "../../data/mock/studentsData";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

let localBehaviors = [...BEHAVIORS];
let localEvaluations = [...EVALUATIONS];
let localParentContacts = [...PARENT_CONTACTS];
let localPenalties = [...PENALTIES];
let localMeetings = [...PARENT_MEETINGS];
let nextId = 100;

export async function fetchSupervisorDashboard(userId) {
  await delay(300);
  const sup = getSupervisorByUserId(userId);
  if (!sup) return { success: false, message: "المشرف غير موجود" };

  const classes = getClassesBySupervisor(sup.id);
  const classStats = classes.map((c) => ({
    ...c,
    ...getClassStats(c.id),
    ...getAttendanceByClass(c.id),
    studentCount: STUDENTS.filter((s) => s.classId === c.id).length,
  }));

  const overallAttendance = classStats.reduce((acc, c) => ({
    total: acc.total + c.total,
    present: acc.present + c.present,
    absent: acc.absent + c.absent,
    late: acc.late + c.late,
  }), { total: 0, present: 0, absent: 0, late: 0 });
  const overallRate = overallAttendance.total ? Math.round((overallAttendance.present / overallAttendance.total) * 100) : 0;

  const allStudentIds = classes.flatMap((c) => STUDENTS.filter((s) => s.classId === c.id).map((s) => s.id));
  const recentActivities = [
    ...localBehaviors.filter((b) => allStudentIds.includes(b.studentId)).map((b) => ({ ...b, activityType: "behavior" })),
    ...localEvaluations.filter((e) => allStudentIds.includes(e.studentId)).map((e) => ({ ...e, activityType: "evaluation" })),
    ...localParentContacts.filter((c) => allStudentIds.includes(c.studentId)).map((c) => ({ ...c, activityType: "contact" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

  const totalBehaviors = classStats.reduce((s, c) => s + c.behaviorCount, 0);
  const totalPositive = classStats.reduce((s, c) => s + c.positiveCount, 0);
  const totalNegative = classStats.reduce((s, c) => s + c.negativeCount, 0);
  const totalEvaluations = classStats.reduce((s, c) => s + c.evaluationCount, 0);

  return {
    success: true,
    data: {
      ...sup,
      classes: classStats,
      stats: {
        totalClasses: classes.length,
        totalStudents: classStats.reduce((s, c) => s + c.studentCount, 0),
        totalBehaviors,
        totalPositive,
        totalNegative,
        totalEvaluations,
        attendanceRate: overallRate,
        attendancePresent: overallAttendance.present,
        attendanceAbsent: overallAttendance.absent,
        attendanceLate: overallAttendance.late,
      },
      recentActivities,
    },
  };
}

export async function fetchClassOverview(classId) {
  await delay(300);
  const cls = CLASSES.find((c) => c.id === classId);
  if (!cls) return { success: false, message: "الصف غير موجود" };

  const stats = getClassStats(classId);
  const students = getStudentsByClass(classId).map((s) => ({
    ...s,
    behaviors: getBehaviorsByStudent(s.id),
    evaluations: getEvaluationsByStudent(s.id),
    academicAverage: (() => {
      const evs = getEvaluationsByStudent(s.id);
      if (!evs.length) return null;
      return Math.round(evs.reduce((sum, e) => sum + e.academic, 0) / evs.length);
    })(),
    behaviorScore: (() => {
      const evs = getEvaluationsByStudent(s.id);
      if (!evs.length) return null;
      return Math.round(evs.reduce((sum, e) => sum + e.behavior, 0) / evs.length);
    })(),
  }));

  const recentBehaviors = localBehaviors.filter((b) =>
    students.some((s) => s.id === b.studentId)
  ).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const recentEvaluations = localEvaluations.filter((e) =>
    students.some((s) => s.id === e.studentId)
  ).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return {
    success: true,
    data: {
      ...cls,
      ...stats,
      studentCount: students.length,
      students,
      recentBehaviors,
      recentEvaluations,
    },
  };
}

export async function fetchStudentsByClass(classId) {
  await delay(200);
  const students = getStudentsByClass(classId).map((s) => ({
    ...s,
    behaviors: getBehaviorsByStudent(s.id),
    evaluations: getEvaluationsByStudent(s.id),
    parentContacts: getParentContactsByStudent(s.id),
    penalties: getPenaltiesByStudent(s.id),
    academicAverage: (() => {
      const evs = getEvaluationsByStudent(s.id);
      if (!evs.length) return null;
      return Math.round(evs.reduce((sum, e) => sum + e.academic, 0) / evs.length);
    })(),
    behaviorScore: (() => {
      const evs = getEvaluationsByStudent(s.id);
      if (!evs.length) return null;
      return Math.round(evs.reduce((sum, e) => sum + e.behavior, 0) / evs.length);
    })(),
  }));
  return { success: true, data: students };
}

export async function fetchStudentDetail(studentId) {
  await delay(200);
  const student = STUDENTS.find((s) => s.id === studentId);
  if (!student) return { success: false, message: "الطالب غير موجود" };
  return {
    success: true,
    data: {
      ...student,
      behaviors: getBehaviorsByStudent(studentId),
      evaluations: getEvaluationsByStudent(studentId),
      parentContacts: getParentContactsByStudent(studentId),
      penalties: getPenaltiesByStudent(studentId),
    },
  };
}

export async function addBehavior(studentId, type, description, recordedBy) {
  await delay(200);
  const record = { id: `bh${nextId++}`, studentId, type, description, date: new Date().toISOString().split("T")[0], recordedBy };
  localBehaviors.unshift(record);
  return { success: true, data: record };
}

export async function addEvaluation(studentId, academic, behavior, participation, notes, recordedBy) {
  await delay(200);
  const record = { id: `ev${nextId++}`, studentId, academic, behavior, participation, notes, date: new Date().toISOString().split("T")[0], recordedBy };
  localEvaluations.unshift(record);
  return { success: true, data: record };
}

export async function addParentContact(studentId, reason, type, notes, recordedBy) {
  await delay(200);
  const record = { id: `pc${nextId++}`, studentId, reason, type, date: new Date().toISOString().split("T")[0], status: "pending", notes, recordedBy };
  localParentContacts.unshift(record);
  return { success: true, data: record };
}

export async function addPenalty(studentId, type, reason, recordedBy) {
  await delay(200);
  const record = { id: `pn${nextId++}`, studentId, type, reason, date: new Date().toISOString().split("T")[0], status: "pending", recordedBy };
  localPenalties.unshift(record);
  return { success: true, data: record };
}

export async function fetchMeetings() {
  await delay(200);
  return { success: true, data: localMeetings };
}

export async function createMeeting(meeting, createdBy) {
  await delay(200);
  const record = { id: `pm${nextId++}`, ...meeting, createdBy, status: "planned" };
  localMeetings.push(record);
  return { success: true, data: record };
}

export async function fetchStudentReports(studentId) {
  await delay(200);
  const reports = getReportsByStudent(studentId);
  return { success: true, data: reports };
}

export async function saveReport(studentId, type, content, createdBy) {
  await delay(200);
  const report = saveStudentReport(studentId, type, content, createdBy);
  return { success: true, data: report };
}
