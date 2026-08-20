import { CLASSES } from "./supervisorsData";

const arabicNames = [
  "أحمد محمد", "سارة علي", "خالد عمر", "نورة عبدالله", "فهد سعد",
  "مها فهد", "عمر حسن", "لمى سامي", "محمد نور", "هدى إبراهيم",
  "يوسف محمود", "منى حسن", "سامي علي", "ليلى عبدالله", "إبراهيم نور",
  "عبدالرحمن فهد", "نوال سعد", "ماجد أحمد", "رنا خالد", "بسام علي",
  "تهاني محمد", "وليد عمر", "أمل عبدالله", "زياد سعد", "حنان فهد",
  "راشد حسن", "مريم سامي", "سلطان نور", "عهود إبراهيم", "ناصر محمود",
];

export const STUDENTS = CLASSES.flatMap((cls) => {
  const count = cls.studentCount || 25;
  return Array.from({ length: Math.min(count, 30) }, (_, i) => {
    const idx = (parseInt(cls.id.replace("c", ""), 10) * 10 + i) % arabicNames.length;
    const studentId = `stu_${cls.id}_${i + 1}`;
    return {
      id: studentId,
      name: arabicNames[idx],
      email: `${arabicNames[idx].replace(/\s/g, ".").toLowerCase()}@school.com`,
      classId: cls.id,
      gradeId: cls.gradeId,
      className: cls.name,
      classNameEn: cls.nameEn,
      gradeName: cls.gradeName,
      gradeNameEn: cls.gradeNameEn,
    };
  });
});

export const TRANSFER_HISTORY = [];

export function getStudentsByClass(classId) {
  return STUDENTS.filter((s) => s.classId === classId);
}

export function getStudentsByGrade(gradeId) {
  return STUDENTS.filter((s) => s.gradeId === gradeId);
}

export function transferStudents(studentIds, fromClassId, toClassId) {
  const targetClass = CLASSES.find((c) => c.id === toClassId);
  if (!targetClass) return { success: false, message: "الصف الهدف غير موجود" };
  if (fromClassId === toClassId) return { success: false, message: "لا يمكن نقل الطالب إلى نفس الصف" };

  const fromGrade = CLASSES.find((c) => c.id === fromClassId)?.gradeId;
  if (fromGrade !== targetClass.gradeId) return { success: false, message: "لا يمكن النقل بين صفوف من مراحل دراسية مختلفة" };

  studentIds.forEach((sid) => {
    const student = STUDENTS.find((s) => s.id === sid);
    if (student) {
      student.classId = toClassId;
      student.gradeId = targetClass.gradeId;
      student.className = targetClass.name;
      student.classNameEn = targetClass.nameEn;
      student.gradeName = targetClass.gradeName;
      student.gradeNameEn = targetClass.gradeNameEn;
    }
  });

  const fromClass = CLASSES.find((c) => c.id === fromClassId);
  const record = {
    id: `tr_${Date.now()}`,
    studentIds,
    fromClassId,
    toClassId,
    fromClassName: fromClass?.name,
    fromClassNameEn: fromClass?.nameEn,
    toClassName: targetClass.name,
    toClassNameEn: targetClass.nameEn,
    timestamp: new Date().toISOString(),
  };
  TRANSFER_HISTORY.push(record);

  return { success: true, data: record, message: `تم نقل ${studentIds.length} طالب بنجاح` };
}
