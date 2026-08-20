/**
 * @fileOverview API functions لإدارة الـ emails المعتمدة
 * @description: جميع العمليات المتعلقة بقائمة البريد الإلكتروني المصرح به
 */

import {
  AUTHORIZED_EMAILS,
  EMAIL_STATUS,
  USER_TYPES,
  getEmailRecord,
  getEmailsByType,
  getEmailsStatistics,
  getStatsForUserType,
} from "../../data/mock/authorizedEmails";

/**
 * @description: التحقق من صحة البريد الإلكتروني المعتمد
 * @param {string} email - البريد الإلكتروني
 * @returns {Promise<Object>} نتيجة التحقق
 */
export async function validateAuthorizedEmail(email) {
  try {
    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 300));

    // البحث عن البريد الإلكتروني
    const emailRecord = getEmailRecord(email);

    // إذا لم يتم العثور على البريد
    if (!emailRecord) {
      return {
        isValid: false,
        authorized: false,
        message:
          "غير مسموح بالتسجيل. يرجى مراجعة الإدارة لإضافة بريدك الإلكتروني أولاً.",
        errorCode: "EMAIL_NOT_FOUND",
      };
    }

    // إذا كان البريد غير نشط
    if (emailRecord.status === EMAIL_STATUS.INACTIVE) {
      return {
        isValid: false,
        authorized: false,
        message: "هذا البريد الإلكتروني معطل. يرجى التواصل مع الإدارة.",
        errorCode: "EMAIL_INACTIVE",
      };
    }

    // إذا كان البريد منتهي الصلاحية
    if (emailRecord.status === EMAIL_STATUS.EXPIRED) {
      return {
        isValid: false,
        authorized: false,
        message: "انتهت صلاحية هذا البريد الإلكتروني.",
        errorCode: "EMAIL_EXPIRED",
      };
    }

    // إذا تم استخدام البريد بالفعل
    if (emailRecord.status === EMAIL_STATUS.USED) {
      return {
        isValid: false,
        authorized: false,
        message:
          "هذا البريد الإلكتروني مستخدم مسبقاً ولا يمكن تسجيل حساب آخر به.",
        errorCode: "EMAIL_ALREADY_USED",
      };
    }

    // البريد الإلكتروني صحيح ومعتمد
    return {
      isValid: true,
      authorized: true,
      userType: emailRecord.userType,
      name: emailRecord.name,
      status: emailRecord.status,
      message: "البريد الإلكتروني معتمد. يمكنك المتابعة.",
      data: emailRecord,
    };
  } catch {
    return {
      isValid: false,
      authorized: false,
      message: "حدث خطأ في التحقق من البريد الإلكتروني",
      errorCode: "VALIDATION_ERROR",
    };
  }
}

/**
 * @description: الحصول على قائمة الـ emails المعتمدة (للأدمن فقط)
 * @param {Object} params - معاملات التصفية
 * @returns {Promise<Object>} قائمة الـ emails
 */
export async function getAuthorizedEmailsList(params = {}) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = [...AUTHORIZED_EMAILS];

    // تصفية حسب النوع
    if (params.userType) {
      filtered = filtered.filter((e) => e.userType === params.userType);
    }

    // تصفية حسب الحالة
    if (params.status) {
      filtered = filtered.filter((e) => e.status === params.status);
    }

    // تصفية حسب البريد الإلكتروني
    if (params.email) {
      filtered = filtered.filter((e) =>
        e.email.toLowerCase().includes(params.email.toLowerCase()),
      );
    }

    // الفرز
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder || "desc";
    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return {
      success: true,
      data: filtered,
      total: filtered.length,
      stats: getEmailsStatistics(),
    };
  } catch {
    throw new Error("فشل جلب قائمة الـ emails المعتمدة");
  }
}

/**
 * @description: إضافة بريد إلكتروني معتمد جديد (للأدمن فقط)
 * @param {Object} emailData - بيانات البريد الإلكتروني
 * @returns {Promise<Object>} البريد المضافة
 */
export async function addAuthorizedEmail(emailData) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // التحقق من عدم تكرار البريد
    const existing = getEmailRecord(emailData.email);
    if (existing) {
      return {
        success: false,
        message: "البريد الإلكتروني مستخدم مسبقاً ولا يمكن تكراره.",
        errorCode: "EMAIL_DUPLICATE",
      };
    }

    // التحقق من البيانات المطلوبة
    if (!emailData.email || !emailData.userType || !emailData.name) {
      return {
        success: false,
        message: "البيانات المطلوبة ناقصة",
        errorCode: "MISSING_FIELDS",
      };
    }

    // إنشاء سجل جديد
    const newEmail = {
      id: Math.max(...AUTHORIZED_EMAILS.map((e) => e.id), 0) + 1,
      email: emailData.email,
      userType: emailData.userType,
      name: emailData.name,
      status: EMAIL_STATUS.PENDING,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: emailData.adminId || 1,
      expiresAt: emailData.expiresAt,
      notes: emailData.notes || "",
      ...emailData,
    };

    // إضافة إلى القائمة
    AUTHORIZED_EMAILS.push(newEmail);

    return {
      success: true,
      message: "تم إضافة البريد الإلكتروني بنجاح",
      data: newEmail,
    };
  } catch {
    return {
      success: false,
      message: "فشل إضافة البريد الإلكتروني",
      errorCode: "ADD_ERROR",
    };
  }
}

/**
 * @description: تعديل بريد إلكتروني معتمد (للأدمن فقط)
 * @param {number} id - معرف السجل
 * @param {Object} updates - البيانات المراد تحديثها
 * @returns {Promise<Object>} البريد المحدثة
 */
export async function updateAuthorizedEmail(id, updates) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const emailRecord = AUTHORIZED_EMAILS.find((e) => e.id === id);
    if (!emailRecord) {
      return {
        success: false,
        message: "البريد الإلكتروني غير موجود",
        errorCode: "EMAIL_NOT_FOUND",
      };
    }

    // منع تغيير البريد الإلكتروني إلى بريد موجود
    if (updates.email && updates.email !== emailRecord.email) {
      const existing = getEmailRecord(updates.email);
      if (existing) {
        return {
          success: false,
          message: "البريد الإلكتروني الجديد مستخدم مسبقاً",
          errorCode: "EMAIL_DUPLICATE",
        };
      }
    }

    // تحديث البيانات
    Object.assign(emailRecord, updates, {
      updatedAt: new Date().toISOString().split("T")[0],
    });

    return {
      success: true,
      message: "تم تحديث البريد الإلكتروني بنجاح",
      data: emailRecord,
    };
  } catch {
    return {
      success: false,
      message: "فشل تحديث البريد الإلكتروني",
      errorCode: "UPDATE_ERROR",
    };
  }
}

/**
 * @description: حذف بريد إلكتروني معتمد (للأدمن فقط)
 * @param {number} id - معرف السجل
 * @returns {Promise<Object>} نتيجة الحذف
 */
export async function deleteAuthorizedEmail(id) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = AUTHORIZED_EMAILS.findIndex((e) => e.id === id);
    if (index === -1) {
      return {
        success: false,
        message: "البريد الإلكتروني غير موجود",
        errorCode: "EMAIL_NOT_FOUND",
      };
    }

    const deleted = AUTHORIZED_EMAILS.splice(index, 1)[0];

    return {
      success: true,
      message: "تم حذف البريد الإلكتروني بنجاح",
      data: deleted,
    };
  } catch {
    return {
      success: false,
      message: "فشل حذف البريد الإلكتروني",
      errorCode: "DELETE_ERROR",
    };
  }
}

/**
 * @description: تفعيل/تعطيل بريد إلكتروني (للأدمن فقط)
 * @param {number} id - معرف السجل
 * @param {string} newStatus - الحالة الجديدة
 * @returns {Promise<Object>} نتيجة التحديث
 */
export async function updateEmailStatus(id, newStatus) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const emailRecord = AUTHORIZED_EMAILS.find((e) => e.id === id);
    if (!emailRecord) {
      return {
        success: false,
        message: "البريد الإلكتروني غير موجود",
        errorCode: "EMAIL_NOT_FOUND",
      };
    }

    emailRecord.status = newStatus;
    emailRecord.statusUpdatedAt = new Date().toISOString().split("T")[0];

    return {
      success: true,
      message: "تم تحديث حالة البريد الإلكتروني",
      data: emailRecord,
    };
  } catch {
    return {
      success: false,
      message: "فشل تحديث حالة البريد الإلكتروني",
      errorCode: "STATUS_UPDATE_ERROR",
    };
  }
}

/**
 * @description: الحصول على إحصائيات الـ emails (للأدمن فقط)
 * @returns {Promise<Object>} الإحصائيات
 */
export async function getEmailsStats() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const stats = {
      overall: getEmailsStatistics(),
      byUserType: {
        students: getStatsForUserType(USER_TYPES.STUDENT),
        teachers: getStatsForUserType(USER_TYPES.TEACHER),
        parents: getStatsForUserType(USER_TYPES.PARENT),
        supervisors: getStatsForUserType(USER_TYPES.SUPERVISOR),
        accountants: getStatsForUserType(USER_TYPES.ACCOUNTANT),
      },
    };

    return {
      success: true,
      data: stats,
    };
  } catch {
    throw new Error("فشل جلب الإحصائيات");
  }
}

/**
 * @description: تسجيل استخدام البريد الإلكتروني (يتم استدعاؤها عند التسجيل الناجح)
 * @param {string} email - البريد الإلكتروني
 * @param {number} userId - معرف المستخدم الجديد
 * @returns {Promise<Object>} نتيجة التسجيل
 */
export async function markEmailAsUsed(email, userId) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const emailRecord = getEmailRecord(email);
    if (!emailRecord) {
      return {
        success: false,
        message: "البريد الإلكتروني غير معتمد",
        errorCode: "EMAIL_NOT_AUTHORIZED",
      };
    }

    emailRecord.status = EMAIL_STATUS.USED;
    emailRecord.usedAt = new Date().toISOString();
    emailRecord.usedBy = userId;

    return {
      success: true,
      message: "تم تسجيل استخدام البريد الإلكتروني",
      data: emailRecord,
    };
  } catch {
    return {
      success: false,
      message: "فشل تسجيل استخدام البريد الإلكتروني",
      errorCode: "MARK_USED_ERROR",
    };
  }
}

/**
 * @description: استيراج قائمة emails من ملف CSV (للأدمن فقط)
 * @param {Array} emailsArray - قائمة الـ emails المراد استيرادها
 * @returns {Promise<Object>} نتيجة الاستيراج
 */
export async function bulkAddEmails(emailsArray) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const results = {
      imported: 0,
      failed: 0,
      duplicates: 0,
      errors: [],
    };

    for (const emailData of emailsArray) {
      const existing = getEmailRecord(emailData.email);

      if (existing) {
        results.duplicates++;
        results.errors.push({
          email: emailData.email,
          error: "مستخدم مسبقاً",
        });
        continue;
      }

      if (!emailData.email || !emailData.userType || !emailData.name) {
        results.failed++;
        results.errors.push({
          email: emailData.email,
          error: "بيانات ناقصة",
        });
        continue;
      }

      const newEmail = {
        id: Math.max(...AUTHORIZED_EMAILS.map((e) => e.id), 0) + 1,
        ...emailData,
        status: EMAIL_STATUS.PENDING,
        createdAt: new Date().toISOString().split("T")[0],
      };

      AUTHORIZED_EMAILS.push(newEmail);
      results.imported++;
    }

    return {
      success: true,
      message: `تم استيراد ${results.imported} من أصل ${emailsArray.length}`,
      results,
    };
  } catch {
    return {
      success: false,
      message: "فشل استيراد الـ emails",
      errorCode: "BULK_IMPORT_ERROR",
    };
  }
}

// Re-export getEmailsByType from mock data
export { getEmailsByType };
