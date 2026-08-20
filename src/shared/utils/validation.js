/**
 * 📝 Form Validation Utility
 * ==========================
 * دوال تحقق مركزية - تجنب إعادة كتابة regex وvalidation في كل مكان (DRY)
 */

/**
 * التحقق من صحة البريد الإلكتروني
 * @param {string} email - البريد المراد التحقق منه
 * @returns {boolean} صحيح؟
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * التحقق من صحة كلمة المرور (قوة الكلمة)
 * الحد الأدنى: 6 أحرف
 * @param {string} password - كلمة المرور
 * @returns {boolean} صحيحة؟
 */
export const isValidPassword = (password) => {
  if (!password || typeof password !== "string") return false;
  return password.length >= 6;
};

/**
 * الحصول على قوة كلمة المرور
 * @param {string} password - كلمة المرور
 * @returns {Object} {strength: string, score: number (0-3)}
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { strength: "weak", score: 0 };
  }

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;

  const strengthMap = {
    0: "weak",
    1: "weak",
    2: "medium",
    3: "strong",
  };

  return { strength: strengthMap[score], score };
};

/**
 * تقليص المسافات الزائدة والتحقق من عدم الفراغ
 * @param {string} value - القيمة
 * @returns {string} القيمة المنظفة
 */
export const trimAndValidate = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

/**
 * التحقق من أن القيمة ليست فارغة
 * @param {string} value - القيمة
 * @returns {boolean} فارغة؟
 */
export const isEmpty = (value) => {
  return !value || trimAndValidate(value).length === 0;
};

/**
 * الحصول على أول كلمة من البريد (اسم المستخدم)
 * مثال: admin@school.com → admin
 * @param {string} email - البريد الإلكتروني
 * @returns {string} اسم المستخدم
 */
export const extractUsernameFromEmail = (email) => {
  if (!email || typeof email !== "string") return "User";
  const [username] = email.split("@");
  return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
};
