import { STUDENTS } from "./studentsData";
import { CLASSES, ASSIGNMENTS, SUPERVISORS } from "./supervisorsData";

const allStudentIds = STUDENTS.map((s) => s.id);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const dateAgo = (days) => { const d = new Date(); d.setDate(d.getDate() - days); return d.toISOString().split("T")[0]; };

const positiveDescs = [
  "مشاركة فعالة في الحصة", "مساعدة زميل في فهم الدرس", "تفوق في الاختبار الشهري",
  "تنظيم حملة نظافة الصف", "مبادرة تطوعية في المدرسة", "أخلاق عالية مع المعلمين",
  "إنجاز الواجبات في الوقت المحدد", "الالتزام بحضور الحصص", "تمثيل المدرسة في مسابقة",
  "تحسن ملحوظ في المستوى الدراسي",
];
const negativeDescs = [
  "التحدث أثناء الدرس", "عدم إنجاز الواجب", "غياب بدون عذر",
  "سلوك غير لائق مع زميل", "عدم الالتزام بقوانين الصف", "إهمال في الواجبات المدرسية",
  "تأخر عن الحصة", "عدم احترام أوامر المعلم",
];
const warningDescs = [
  "تأخر متكرر عن الحصة الأولى", "إهمال في الواجبات المدرسية",
  "تكرار عدم إحضار الكتب", "سلوك غير ملائم في الطابور",
];
const evalNotes = [
  "طالب مجتهد", "بحاجة لمتابعة", "مستوى جيد", "أخلاق عالية", "طالب ممتاز",
  "بحاجة لدعم", "مستوى مقبول", "تحسن ملحوظ", "مثابر", "محتاج تركيز أكثر", "",
];

// ─── BEHAVIORS: ~35% of students have 1-2 behaviors ───
const BEHAVIORS = [];
let bhId = 1;
for (const sid of allStudentIds) {
  const count = Math.random() < 0.35 ? rnd(1, 2) : 0;
  for (let j = 0; j < count; j++) {
    const type = pick(["positive", "positive", "positive", "negative", "warning"]);
    const descPool = type === "positive" ? positiveDescs : type === "negative" ? negativeDescs : warningDescs;
    BEHAVIORS.push({
      id: `bh${bhId++}`, studentId: sid, type, description: pick(descPool),
      date: dateAgo(rnd(0, 60)), recordedBy: "s9",
    });
  }
}

// ─── EVALUATIONS: ~65% of students have 1-2 evaluations ───
const EVALUATIONS = [];
let evId = 1;
for (const sid of allStudentIds) {
  const count = Math.random() < 0.65 ? rnd(1, 2) : 0;
  for (let j = 0; j < count; j++) {
    EVALUATIONS.push({
      id: `ev${evId++}`, studentId: sid,
      academic: rnd(45, 100), behavior: rnd(45, 100), participation: rnd(45, 100),
      notes: pick(evalNotes), date: dateAgo(rnd(0, 90)), recordedBy: "s9",
    });
  }
}

// ─── PARENT_CONTACTS: ~12% of students ───
const contactReasons = [
  "استدعاء ولي أمر", "إبلاغ عن تأخر دراسي", "دعوة لحفل التميز",
  "مناقشة سلوك الطالب", "إبلاغ عن نتائج الاختبارات",
];
const PARENT_CONTACTS = [];
let pcId = 1;
for (const sid of allStudentIds) {
  if (Math.random() < 0.12) {
    const type = pick(["phone", "summons", "invitation"]);
    PARENT_CONTACTS.push({
      id: `pc${pcId++}`, studentId: sid, reason: pick(contactReasons), type,
      date: dateAgo(rnd(0, 60)), status: pick(["done", "done", "pending"]),
      notes: "تم التواصل مع ولي الأمر بنجاح", recordedBy: "s9",
    });
  }
}

// ─── PENALTIES: ~8% of students ───
const penaltyReasons = [
  "سلوك غير لائق مع زميل", "غياب بدون عذر", "تكرار التأخر عن الحصص",
  "عدم إنجاز الواجبات المدرسية", "تجاوز قوانين المدرسة",
];
const PENALTIES = [];
let pnId = 1;
for (const sid of allStudentIds) {
  if (Math.random() < 0.08) {
    PENALTIES.push({
      id: `pn${pnId++}`, studentId: sid,
      type: pick(["warning_letter", "detention", "detention", "suspension"]),
      reason: pick(penaltyReasons), date: dateAgo(rnd(0, 60)),
      status: pick(["executed", "executed", "pending"]), recordedBy: "s9",
    });
  }
}

// ─── ATTENDANCE: all students, today + 30-day history ───
const ATTENDANCE = [];
let atId = 1;
for (const sid of allStudentIds) {
  // Today's attendance
  const status = pick(["present", "present", "present", "present", "absent", "late"]);
  ATTENDANCE.push({ id: `at${atId++}`, studentId: sid, date: dateAgo(0), status });
  // 30-day history (random subset)
  if (Math.random() < 0.5) {
    ATTENDANCE.push({ id: `at${atId++}`, studentId: sid, date: dateAgo(rnd(1, 30)), status: pick(["present", "present", "absent", "late"]) });
  }
}

// ─── STUDENT_REPORTS: pre-filled for demo ───
const reportTypes = ["semester", "semester", "yearly"];
const reportContents = [
  "الطالب مجتهد ومنضبط، يشارك في الحصص ويحترم زملائه. أتمنى الاستمرار على هذا المستوى مع التركيز على تحسين مهارات الكتابة.",
  "مستوى الطالب جيد ويحتاج لمتابعة منزلية أكبر. أظهر تحسناً في الفترة الأخيرة خصوصاً في مادة الرياضيات.",
  "طالب ممتاز علمياً وسلوكياً. يشرفني تدريسه هذا العام. أتمنى له دوام التوفيق.",
  "بحاجة للالتزام بالحضور المنتظم وتحسين السلوك الصفي. تم التواصل مع ولي الأمر عدة مرات.",
  "مستواه الأكاديمي مقبول ولكن يحتاج لتحسين في السلوك والتعامل مع الزملاء.",
  "من أوائل الصف في المواد العلمية. أخلاقه عالية ومحبوب من زملائه.",
  "تحسن مستواه بشكل ملحوظ هذا الفصل. نشكر ولي الأمر على المتابعة المستمرة.",
  "طالب هادئ ومثابر. ينجز واجباته في الوقت المحدد. يحتاج للمشاركة أكثر في النقاشات الصفية.",
];
const STUDENT_REPORTS = [];
let rpId = 1;
const reportStudentIds = allStudentIds.filter(() => Math.random() < 0.07);
for (const sid of reportStudentIds) {
  const count = rnd(1, 3);
  for (let j = 0; j < count; j++) {
    STUDENT_REPORTS.push({
      id: `rp${rpId++}`, studentId: sid, type: pick(reportTypes),
      content: pick(reportContents), date: dateAgo(rnd(0, 120)), recordedBy: "s9",
    });
  }
}

// ─── PARENT_MEETINGS ───
const PARENT_MEETINGS = [
  { id: "pm1", title: "اجتماع أولياء أمور الصف 7-أ", titleEn: "Parent Meeting Class 7-A", classId: "c13", date: "2026-06-10", time: "10:00", location: "قاعة الاجتماعات", locationEn: "Meeting Room", notes: "مناقشة نتائج الفصل الدراسي الأول", notesEn: "Discussing first semester results", createdBy: "s8", status: "planned" },
  { id: "pm2", title: "اجتماع أولياء أمور الصف 7-ب", titleEn: "Parent Meeting Class 7-B", classId: "c14", date: "2026-06-10", time: "11:00", location: "قاعة الاجتماعات", locationEn: "Meeting Room", notes: "مناقشة نتائج الفصل الدراسي الأول", notesEn: "Discussing first semester results", createdBy: "s9", status: "planned" },
  { id: "pm3", title: "اجتماع أولياء أمور الصف 8-أ", titleEn: "Parent Meeting Class 8-A", classId: "c15", date: "2026-06-11", time: "10:00", location: "قاعة الاجتماعات", locationEn: "Meeting Room", notes: "مناقشة نتائج الفصل الدراسي الأول", notesEn: "Discussing first semester results", createdBy: "s9", status: "planned" },
  { id: "pm4", title: "اجتماع أولياء أمور الصف 8-ب", titleEn: "Parent Meeting Class 8-B", classId: "c16", date: "2026-06-11", time: "11:00", location: "قاعة الاجتماعات", locationEn: "Meeting Room", notes: "مناقشة نتائج الفصل الدراسي الأول", notesEn: "Discussing first semester results", createdBy: "s9", status: "planned" },
  { id: "pm5", title: "اجتماع أولياء أمور الصف 9-أ", titleEn: "Parent Meeting Class 9-A", classId: "c17", date: "2026-06-12", time: "10:00", location: "قاعة الاجتماعات", locationEn: "Meeting Room", notes: "مناقشة نتائج الفصل الدراسي الأول", notesEn: "Discussing first semester results", createdBy: "s10", status: "planned" },
  { id: "pm6", title: "اجتماع أولياء أمور الصف 9-ب", titleEn: "Parent Meeting Class 9-B", classId: "c18", date: "2026-06-12", time: "11:00", location: "قاعة الاجتماعات", locationEn: "Meeting Room", notes: "مناقشة نتائج الفصل الدراسي الأول", notesEn: "Discussing first semester results", createdBy: "s10", status: "planned" },
];

export {
  BEHAVIORS, EVALUATIONS, PARENT_CONTACTS, PENALTIES, ATTENDANCE, STUDENT_REPORTS, PARENT_MEETINGS,
};

// ─── HELPERS ───

export function getSupervisorByUserId(userId) {
  const mapping = { 3: "s9" };
  const supId = mapping[userId] || "s9";
  return SUPERVISORS.find((s) => s.id === supId);
}

export function getClassesBySupervisor(supervisorId) {
  const classIds = ASSIGNMENTS.filter((a) => a.supervisorId === supervisorId).map((a) => a.classId);
  return CLASSES.filter((c) => classIds.includes(c.id));
}

export function getStudentsByClass(classId) {
  return STUDENTS.filter((s) => s.classId === classId);
}

export function getBehaviorsByStudent(studentId) {
  return (BEHAVIORS || []).filter((b) => b.studentId === studentId).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getBehaviorsByClass(classId) {
  const ids = STUDENTS.filter((s) => s.classId === classId).map((s) => s.id);
  return BEHAVIORS.filter((b) => ids.includes(b.studentId));
}

export function getEvaluationsByStudent(studentId) {
  return (EVALUATIONS || []).filter((e) => e.studentId === studentId).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getParentContactsByStudent(studentId) {
  return (PARENT_CONTACTS || []).filter((c) => c.studentId === studentId);
}

export function getPenaltiesByStudent(studentId) {
  return (PENALTIES || []).filter((p) => p.studentId === studentId);
}

export function getEvaluationsByClass(classId) {
  const ids = STUDENTS.filter((s) => s.classId === classId).map((s) => s.id);
  return EVALUATIONS.filter((e) => ids.includes(e.studentId));
}

export function getReportsByStudent(studentId) {
  return (STUDENT_REPORTS || []).filter((r) => r.studentId === studentId).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function saveStudentReport(studentId, type, content, createdBy) {
  const report = { id: `rp${STUDENT_REPORTS.length + 1}`, studentId, type, content, date: new Date().toISOString().split("T")[0], createdBy };
  STUDENT_REPORTS.unshift(report);
  return report;
}

export function getAttendanceByClass(classId, date) {
  const ids = STUDENTS.filter((s) => s.classId === classId).map((s) => s.id);
  const target = date || new Date().toISOString().split("T")[0];
  const records = ATTENDANCE.filter((a) => ids.includes(a.studentId) && a.date === target);
  const total = records.length;
  const present = records.filter((a) => a.status === "present").length;
  const absent = records.filter((a) => a.status === "absent").length;
  const late = records.filter((a) => a.status === "late").length;
  return { total, present, absent, late, rate: total ? Math.round((present / total) * 100) : 0 };
}

export function getClassStats(classId) {
  const behaviors = getBehaviorsByClass(classId);
  const evaluations = getEvaluationsByClass(classId);
  const ids = STUDENTS.filter((s) => s.classId === classId).map((s) => s.id);
  return {
    behaviorCount: behaviors.length,
    positiveCount: behaviors.filter((b) => b.type === "positive").length,
    negativeCount: behaviors.filter((b) => b.type === "negative").length,
    warningCount: behaviors.filter((b) => b.type === "warning").length,
    evaluationCount: evaluations.length,
    avgAcademic: evaluations.length ? Math.round(evaluations.reduce((s, e) => s + e.academic, 0) / evaluations.length) : null,
    avgBehavior: evaluations.length ? Math.round(evaluations.reduce((s, e) => s + e.behavior, 0) / evaluations.length) : null,
    avgParticipation: evaluations.length ? Math.round(evaluations.reduce((s, e) => s + e.participation, 0) / evaluations.length) : null,
    contactCount: PARENT_CONTACTS.filter((c) => ids.includes(c.studentId)).length,
    penaltyCount: PENALTIES.filter((p) => ids.includes(p.studentId)).length,
  };
}
