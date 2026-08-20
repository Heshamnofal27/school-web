/**
 * 🔒 Storage Manager Utility
 * ============================
 * إدارة مركزية لـ localStorage - تجنب التكرار (DRY)
 *
 * الفائدة: نقطة واحدة للتحكم في جميع عمليات التخزين
 */

// مفاتيح التخزين - ثوابت مركزية تجنب الأخطاء الإملائية
export const STORAGE_KEYS = {
  AUTH_STATE: "school_management_auth",
  AUTH_TOKEN: "school_management_token",
  AUTH_ROLE: "school_management_role",
  REMEMBER_EMAIL: "school_remember_email",
  THEME_MODE: "school_theme_mode",
  LANGUAGE: "school_language",
};

/**
 * آمن get: استرجاع بيانات من localStorage
 * @param {string} key - المفتاح
 * @param {*} defaultValue - القيمة الافتراضية إذا فشل الاسترجاع
 * @returns {*} البيانات أو القيمة الافتراضية
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.warn(`⚠️ Storage: Failed to read "${key}"`, error.message);
    return defaultValue;
  }
};

/**
 * آمن set: حفظ بيانات في localStorage
 * @param {string} key - المفتاح
 * @param {*} value - القيمة
 * @returns {boolean} نجاح العملية
 */
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`⚠️ Storage: Failed to write "${key}"`, error.message);
    return false;
  }
};

/**
 * آمن remove: حذف بيانات من localStorage
 * @param {string} key - المفتاح
 * @returns {boolean} نجاح العملية
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`⚠️ Storage: Failed to remove "${key}"`, error.message);
    return false;
  }
};

/**
 * مسح جميع البيانات المتعلقة بالتطبيق
 * @returns {boolean} نجاح العملية
 */
export const clearAllAppStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.warn("⚠️ Storage: Failed to clear storage", error.message);
    return false;
  }
};

/**
 * التحقق من توفر localStorage
 * @returns {boolean} متاح؟
 */
export const isStorageAvailable = () => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};
