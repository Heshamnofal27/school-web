/**
 * 🔐 Auth Storage Manager
 * =======================
 * إدارة متخصصة لحالة المصادقة - يستخدم storage utility المركزي
 *
 * مثال الأداء:
 * - قبل: كل ملف يعيد كتابة try-catch
 * - بعد: نقطة واحدة للتحكم + error handling موحد
 */

import {
  getFromStorage,
  setToStorage,
  removeFromStorage,
  STORAGE_KEYS,
} from "./storage";

/**
 * استرجاع حالة المصادقة المحفوظة
 * @returns {Object|null} حالة المستخدم أو null
 */
export const loadAuthState = () => {
  const state = getFromStorage(STORAGE_KEYS.AUTH_STATE);
  return state;
};

/**
 * حفظ حالة المصادقة
 * @param {Object} state - حالة المستخدم
 * @returns {boolean} نجاح العملية
 */
export const saveAuthState = (state) => {
  return setToStorage(STORAGE_KEYS.AUTH_STATE, state);
};

export const loadAuthToken = () => {
  return getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
};

export const saveAuthToken = (token) => {
  if (!token) {
    return false;
  }

  return setToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const clearAuthToken = () => {
  return removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * مسح حالة المصادقة (تسجيل الخروج)
 * @returns {boolean} نجاح العملية
 */
export const clearAuthState = () => {
  const clearedState = removeFromStorage(STORAGE_KEYS.AUTH_STATE);
  const clearedToken = clearAuthToken();
  return clearedState && clearedToken;
};

/**
 * حفظ البريد الإلكتروني للتذكر
 * @param {string} email - البريد الإلكتروني
 * @returns {boolean} نجاح العملية
 */
export const saveRememberedEmail = (email) => {
  if (!email || typeof email !== "string") {
    console.warn("⚠️ Invalid email for storage");
    return false;
  }
  return setToStorage(STORAGE_KEYS.REMEMBER_EMAIL, email);
};

/**
 * استرجاع البريد الإلكتروني المحفوظ
 * @returns {string|null} البريد أو null
 */
export const loadRememberedEmail = () => {
  return getFromStorage(STORAGE_KEYS.REMEMBER_EMAIL);
};

/**
 * مسح البريد الإلكتروني المحفوظ
 * @returns {boolean} نجاح العملية
 */
export const clearRememberedEmail = () => {
  return removeFromStorage(STORAGE_KEYS.REMEMBER_EMAIL);
};
