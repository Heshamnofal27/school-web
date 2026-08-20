export const MONTHLY_CASH_FLOW = [
  { month: "يناير", monthEn: "Jan", collected: 145000, expenses: 82000, pending: 23000 },
  { month: "فبراير", monthEn: "Feb", collected: 138000, expenses: 79000, pending: 28000 },
  { month: "مارس", monthEn: "Mar", collected: 152000, expenses: 85000, pending: 21000 },
  { month: "أبريل", monthEn: "Apr", collected: 141000, expenses: 76000, pending: 25000 },
  { month: "مايو", monthEn: "May", collected: 163000, expenses: 88000, pending: 18000 },
  { month: "يونيو", monthEn: "Jun", collected: 158000, expenses: 81000, pending: 20000 },
];

export const INVOICES = [
  { id: "inv_001", studentId: "stu_c13_1", studentName: "أحمد محمد", classId: "c13", className: "7-أ", classNameEn: "7-A", amount: 3500, paid: 3500, status: "paid", dueDate: "2026-06-01", paidDate: "2026-05-28" },
  { id: "inv_002", studentId: "stu_c13_2", studentName: "سارة علي", classId: "c13", className: "7-أ", classNameEn: "7-A", amount: 3500, paid: 2000, status: "partial", dueDate: "2026-06-01", paidDate: "2026-05-30" },
  { id: "inv_003", studentId: "stu_c13_3", studentName: "خالد عمر", classId: "c13", className: "7-أ", classNameEn: "7-A", amount: 3500, paid: 0, status: "unpaid", dueDate: "2026-06-01", paidDate: null },
  { id: "inv_004", studentId: "stu_c14_1", studentName: "نورة عبدالله", classId: "c14", className: "7-ب", classNameEn: "7-B", amount: 3500, paid: 3500, status: "paid", dueDate: "2026-06-01", paidDate: "2026-05-25" },
  { id: "inv_005", studentId: "stu_c14_2", studentName: "فهد سعد", classId: "c14", className: "7-ب", classNameEn: "7-B", amount: 3500, paid: 3500, status: "paid", dueDate: "2026-06-01", paidDate: "2026-05-20" },
  { id: "inv_006", studentId: "stu_c15_1", studentName: "مها فهد", classId: "c15", className: "8-أ", classNameEn: "8-A", amount: 3500, paid: 0, status: "unpaid", dueDate: "2026-06-01", paidDate: null },
  { id: "inv_007", studentId: "stu_c15_2", studentName: "عمر حسن", classId: "c15", className: "8-أ", classNameEn: "8-A", amount: 3500, paid: 1500, status: "partial", dueDate: "2026-06-01", paidDate: "2026-05-15" },
  { id: "inv_008", studentId: "stu_c16_1", studentName: "لمى سامي", classId: "c16", className: "8-ب", classNameEn: "8-B", amount: 3500, paid: 3500, status: "paid", dueDate: "2026-06-01", paidDate: "2026-05-10" },
  { id: "inv_009", studentId: "stu_c17_1", studentName: "محمد نور", classId: "c17", className: "9-أ", classNameEn: "9-A", amount: 4000, paid: 4000, status: "paid", dueDate: "2026-06-01", paidDate: "2026-05-22" },
  { id: "inv_010", studentId: "stu_c17_2", studentName: "هدى إبراهيم", classId: "c17", className: "9-أ", classNameEn: "9-A", amount: 4000, paid: 4000, status: "paid", dueDate: "2026-06-01", paidDate: "2026-05-18" },
  { id: "inv_011", studentId: "stu_c18_1", studentName: "يوسف محمود", classId: "c18", className: "9-ب", classNameEn: "9-B", amount: 4000, paid: 0, status: "unpaid", dueDate: "2026-06-01", paidDate: null },
  { id: "inv_012", studentId: "stu_c18_2", studentName: "منى حسن", classId: "c18", className: "9-ب", classNameEn: "9-B", amount: 4000, paid: 2000, status: "partial", dueDate: "2026-06-01", paidDate: "2026-05-12" },
];

export const TUITION_PLANS = [
  { gradeId: "g7", gradeName: "السابع الإعدادي", gradeNameEn: "7th Preparatory", tuition: 3500 },
  { gradeId: "g8", gradeName: "الثامن الإعدادي", gradeNameEn: "8th Preparatory", tuition: 3500 },
  { gradeId: "g9", gradeName: "التاسع الإعدادي", gradeNameEn: "9th Preparatory", tuition: 4000 },
];

export const INSTALLMENT_PLANS = [
  { id: "ip1", gradeId: "g7", label: "القسط الأول", labelEn: "Installment 1", percentage: 50, dueDay: 1, dueMonth: 10, order: 1 },
  { id: "ip2", gradeId: "g7", label: "القسط الثاني", labelEn: "Installment 2", percentage: 50, dueDay: 1, dueMonth: 2, order: 2 },
  { id: "ip3", gradeId: "g8", label: "القسط الأول", labelEn: "Installment 1", percentage: 50, dueDay: 1, dueMonth: 10, order: 1 },
  { id: "ip4", gradeId: "g8", label: "القسط الثاني", labelEn: "Installment 2", percentage: 50, dueDay: 1, dueMonth: 2, order: 2 },
  { id: "ip5", gradeId: "g9", label: "القسط الأول", labelEn: "Installment 1", percentage: 50, dueDay: 1, dueMonth: 10, order: 1 },
  { id: "ip6", gradeId: "g9", label: "القسط الثاني", labelEn: "Installment 2", percentage: 50, dueDay: 1, dueMonth: 2, order: 2 },
];

let tuitionPlans = [...TUITION_PLANS];
let installmentPlans = [...INSTALLMENT_PLANS];

export function getTuitionSettings() {
  return { tuitionPlans, installmentPlans };
}

export function saveTuitionPlans(plans) {
  tuitionPlans = plans;
  return { success: true, data: tuitionPlans };
}

export function saveInstallmentPlans(plans) {
  installmentPlans = plans;
  return { success: true, data: installmentPlans };
}

export const RECENT_TRANSACTIONS = [
  { id: "tx_001", studentName: "أحمد محمد", className: "7-أ", classNameEn: "7-A", amount: 3500, type: "payment", method: "نقدي", date: "2026-06-08", status: "completed", description: "رسوم الفصل الدراسي الثاني", descriptionEn: "Second semester tuition" },
  { id: "tx_002", studentName: "سارة علي", className: "7-أ", classNameEn: "7-A", amount: 2000, type: "payment", method: "تحويل بنكي", date: "2026-06-07", status: "completed", description: "دفعة من رسوم الفصل", descriptionEn: "Tuition installment" },
  { id: "tx_003", studentName: "نورة عبدالله", className: "7-ب", classNameEn: "7-B", amount: 3500, type: "payment", method: "بطاقة ائتمان", date: "2026-06-06", status: "completed", description: "رسوم الفصل الدراسي الثاني", descriptionEn: "Second semester tuition" },
  { id: "tx_004", studentName: "المدرسة", className: "—", classNameEn: "—", amount: 2500, type: "expense", method: "نقدي", date: "2026-06-05", status: "completed", description: "مستلزمات مكتبية", descriptionEn: "Office supplies" },
  { id: "tx_005", studentName: "عمر حسن", className: "8-أ", classNameEn: "8-A", amount: 1500, type: "payment", method: "نقدي", date: "2026-06-04", status: "completed", description: "دفعة من رسوم الفصل", descriptionEn: "Tuition installment" },
  { id: "tx_006", studentName: "المدرسة", className: "—", classNameEn: "—", amount: 5000, type: "expense", method: "تحويل بنكي", date: "2026-06-03", status: "completed", description: "صيانة المرافق", descriptionEn: "Facility maintenance" },
  { id: "tx_007", studentName: "فهد سعد", className: "7-ب", classNameEn: "7-B", amount: 3500, type: "payment", method: "نقدي", date: "2026-06-02", status: "completed", description: "رسوم الفصل الدراسي الثاني", descriptionEn: "Second semester tuition" },
  { id: "tx_008", studentName: "محمد نور", className: "9-أ", classNameEn: "9-A", amount: 4000, type: "payment", method: "تحويل بنكي", date: "2026-06-01", status: "completed", description: "رسوم الفصل الدراسي الثاني", descriptionEn: "Second semester tuition" },
];

export function getStudentFinancialRecords() {
  return invoices.map((inv) => ({
    ...inv,
    remaining: inv.amount - inv.paid,
    statusLabel:
      inv.status === "paid" ? "مسدد بالكامل" :
      inv.status === "partial" ? "مسدد جزئياً" : "متأخر",
  }));
}

// ─── Mutable copies for runtime mutations ───
let invoices = [...INVOICES];
let transactions = [...RECENT_TRANSACTIONS];

// grade mapping from class name first digit
function gradeIdFromClassName(name) {
  const n = name?.charAt(0) ?? "7";
  return `g${n}`;
}

export function getStudentBilling(studentId) {
  const invoice = invoices.find((i) => i.studentId === studentId);
  if (!invoice) return null;
  const gid = gradeIdFromClassName(invoice.className);
  const plan = installmentPlans
    .filter((p) => p.gradeId === gid)
    .sort((a, b) => a.order - b.order)
    .map((p) => ({
      ...p,
      amount: Math.round((invoice.amount * p.percentage) / 100),
      paid: 0, // simplified
    }));
  const txHistory = transactions
    .filter((t) => t.studentName === invoice.studentName && t.type === "payment")
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return {
    invoice: { ...invoice, remaining: invoice.amount - invoice.paid },
    installmentPlan: plan,
    transactions: txHistory,
  };
}

export function getAllStudentOptions() {
  return invoices.map((inv) => ({
    studentId: inv.studentId,
    studentName: inv.studentName,
    className: inv.className,
    classNameEn: inv.classNameEn,
  }));
}

let receiptCounter = 100;

export function recordPayment(studentId, amount, method) {
  const inv = invoices.find((i) => i.studentId === studentId);
  if (!inv) return { success: false, message: "الطالب غير موجود" };
  const remaining = inv.amount - inv.paid;
  if (amount <= 0 || amount > remaining) {
    return { success: false, message: "المبلغ غير صالح" };
  }
  inv.paid += amount;
  inv.status = inv.paid >= inv.amount ? "paid" : "partial";
  inv.paidDate = new Date().toISOString().slice(0, 10);

  const tx = {
    id: `tx_${Date.now()}`,
    studentName: inv.studentName,
    className: inv.className,
    classNameEn: inv.classNameEn,
    amount,
    type: "payment",
    method,
    date: new Date().toISOString().slice(0, 10),
    status: "completed",
    description: "دفعة جديدة",
    descriptionEn: "New payment",
  };
  transactions.unshift(tx);

  const receipt = {
    receiptId: `RCP-${++receiptCounter}`,
    date: tx.date,
    studentName: inv.studentName,
    className: inv.className,
    classNameEn: inv.classNameEn,
    amount,
    method,
    totalPaid: inv.paid,
    remaining: inv.amount - inv.paid,
    status: inv.status,
  };
  return { success: true, data: receipt };
}

export function getAccountingDashboard() {
  const totalCollected = invoices.reduce((s, i) => s + i.paid, 0);
  const totalExpected = invoices.reduce((s, i) => s + i.amount, 0);
  const totalRemaining = totalExpected - totalCollected;
  const fullyPaid = invoices.filter((i) => i.status === "paid").length;
  const totalStudents = invoices.length;

  return {
    stats: {
      totalCollected,
      totalRemaining,
      fullyPaid,
      totalStudents,
      monthlyCollected: MONTHLY_CASH_FLOW[MONTHLY_CASH_FLOW.length - 1].collected,
      monthlyPending: MONTHLY_CASH_FLOW[MONTHLY_CASH_FLOW.length - 1].pending,
    },
    cashFlow: MONTHLY_CASH_FLOW,
    invoices: invoices,
    recentTransactions: transactions,
  };
}
