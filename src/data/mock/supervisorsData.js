export const SUPERVISORS = [
  { id: "s1", name: "أحمد علي", email: "ahmed@school.com", phone: "0501234567" },
  { id: "s2", name: "سارة محمد", email: "sara@school.com", phone: "0502345678" },
  { id: "s3", name: "خالد عبدالله", email: "khalid@school.com", phone: "0503456789" },
  { id: "s4", name: "نورة أحمد", email: "noura@school.com", phone: "0504567890" },
  { id: "s5", name: "فهد سعد", email: "fahad@school.com", phone: "0505678901" },
  { id: "s6", name: "مها فهد", email: "maha@school.com", phone: "0506789012" },
  { id: "s7", name: "عمر حسن", email: "omar@school.com", phone: "0507890123" },
  { id: "s8", name: "لمى سامي", email: "lama@school.com", phone: "0508901234" },
  { id: "s9", name: "محمد عبدالرحمن", email: "mohamed@school.com", phone: "0509012345" },
  { id: "s10", name: "هدى إبراهيم", email: "hoda@school.com", phone: "0500123456" },
  { id: "s11", name: "يوسف محمود", email: "yousif@school.com", phone: "0512345678" },
  { id: "s12", name: "منى حسن", email: "mona@school.com", phone: "0512345679" },
  { id: "s13", name: "سامي علي", email: "sami@school.com", phone: "0512345680" },
  { id: "s14", name: "ليلى عبدالله", email: "laila@school.com", phone: "0512345681" },
  { id: "s15", name: "إبراهيم نور", email: "ibrahim@school.com", phone: "0512345682" },
];

export const GRADES = [
  { id: "g7", name: "السابع الإعدادي", nameEn: "7th Preparatory" },
  { id: "g8", name: "الثامن الإعدادي", nameEn: "8th Preparatory" },
  { id: "g9", name: "التاسع الإعدادي", nameEn: "9th Preparatory" },
];

export const CLASSES = [
  { id: "c13", name: "7-أ", nameEn: "7-A", gradeId: "g7", gradeName: "السابع الإعدادي", gradeNameEn: "7th Preparatory", studentCount: 31 },
  { id: "c14", name: "7-ب", nameEn: "7-B", gradeId: "g7", gradeName: "السابع الإعدادي", gradeNameEn: "7th Preparatory", studentCount: 27 },
  { id: "c15", name: "8-أ", nameEn: "8-A", gradeId: "g8", gradeName: "الثامن الإعدادي", gradeNameEn: "8th Preparatory", studentCount: 28 },
  { id: "c16", name: "8-ب", nameEn: "8-B", gradeId: "g8", gradeName: "الثامن الإعدادي", gradeNameEn: "8th Preparatory", studentCount: 25 },
  { id: "c17", name: "9-أ", nameEn: "9-A", gradeId: "g9", gradeName: "التاسع الإعدادي", gradeNameEn: "9th Preparatory", studentCount: 30 },
  { id: "c18", name: "9-ب", nameEn: "9-B", gradeId: "g9", gradeName: "التاسع الإعدادي", gradeNameEn: "9th Preparatory", studentCount: 26 },
];

export const ASSIGNMENTS = [
  { id: "a8", classId: "c13", supervisorId: "s8", isPrimary: true },
  { id: "a9", classId: "c15", supervisorId: "s9", isPrimary: true },
  { id: "a10", classId: "c17", supervisorId: "s10", isPrimary: true },
  { id: "a11", classId: "c14", supervisorId: "s11", isPrimary: true },
  { id: "a12", classId: "c16", supervisorId: "s12", isPrimary: true },
  { id: "a13", classId: "c18", supervisorId: "s13", isPrimary: true },
];

export function getAssignmentsByClass(classId) {
  return ASSIGNMENTS.filter((a) => a.classId === classId);
}

export function getAssignmentsBySupervisor(supervisorId) {
  return ASSIGNMENTS.filter((a) => a.supervisorId === supervisorId);
}

export function getClassById(classId) {
  return CLASSES.find((c) => c.id === classId);
}

export function getSupervisorById(supervisorId) {
  return SUPERVISORS.find((s) => s.id === supervisorId);
}
