/**
 * 🌐 Centralized Axios Client
 * ============================
 * نقطة واحدة لكل نداءات الـ API الحقيقية إلى Laravel backend.
 *
 * - baseURL يُقرأ من VITE_API_BASE_URL (.env)
 * - Request interceptor: يرفق Bearer token تلقائياً حسب دور المستخدم الحالي
 *   (admin / supervisor / accountant يشتركون جميعاً في نفس آلية Sanctum Bearer token،
 *    لذلك يكفي توكن واحد مخزّن محلياً بغض النظر عن الـ guard المستخدم في الباك-إند)
 * - Response interceptor: يوحّد شكل الأخطاء، ويسجل خروج المستخدم تلقائياً عند 401
 */

import axios from "axios";
import { getFromStorage, setToStorage, removeFromStorage, STORAGE_KEYS } from "../../shared/utils/storage";

// ============================================================
// BASE URL
// ============================================================
// Vite يعرض متغيرات البيئة عبر import.meta.env ويجب أن تبدأ بـ VITE_
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// ============================================================
// TOKEN HELPERS
// ============================================================
export const getAuthToken = () => getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
export const setAuthToken = (token) => setToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
export const clearAuthToken = () => removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);

export const getAuthRole = () => getFromStorage(STORAGE_KEYS.AUTH_ROLE);
export const setAuthRole = (role) => setToStorage(STORAGE_KEYS.AUTH_ROLE, role);
export const clearAuthRole = () => removeFromStorage(STORAGE_KEYS.AUTH_ROLE);

// ============================================================
// AXIOS INSTANCE
// ============================================================
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ------------------------------------------------------------
// Request Interceptor: attach Bearer token automatically
// ------------------------------------------------------------
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ------------------------------------------------------------
// Response Interceptor: normalize errors + handle 401 globally
// ------------------------------------------------------------
let onUnauthorized = null;
/**
 * يسمح لتطبيق React (مثلاً App.jsx) بتسجيل دالة تُستدعى عند فشل المصادقة (401)
 * حتى نتمكن من تسجيل خروج المستخدم دون استيراد دائري لـ redux store هنا.
 */
export const registerUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      clearAuthToken();
      clearAuthRole();
      if (typeof onUnauthorized === "function") {
        onUnauthorized();
      }
    }

    return Promise.reject(error);
  },
);

// ============================================================
// UNIFIED REQUEST WRAPPER
// ============================================================
/**
 * دالة موحّدة تُرجع دائماً نفس الشكل: { success, data, message, statusCode, errors }
 * حتى تبقى الـ slices وصفحات React كما هي دون تغيير جذري.
 */
const getErrorMessage = (error) => {
  const data = error.response?.data;
  if (!data) {
    return error.message === "Network Error"
      ? "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت أو حالة الخادم."
      : error.message || "حدث خطأ غير متوقع";
  }

  if (typeof data === "string") return data;

  if (data.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const firstMsg = Array.isArray(data.errors[firstKey])
      ? data.errors[firstKey][0]
      : data.errors[firstKey];
    if (firstMsg) return firstMsg;
  }

  return data.message || data.error || "حدث خطأ غير متوقع";
};

export const request = async (config) => {
  try {
    const response = await axiosClient.request(config);
    return {
      success: true,
      data: response.data,
      message: response.data?.message || null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      data: error.response?.data || null,
      message: getErrorMessage(error),
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors || null,
    };
  }
};

export const apiGet = (url, config = {}) => request({ ...config, method: "GET", url });
export const apiPost = (url, body, config = {}) => request({ ...config, method: "POST", url, data: body });
export const apiPut = (url, body, config = {}) => request({ ...config, method: "PUT", url, data: body });
export const apiPatch = (url, body, config = {}) => request({ ...config, method: "PATCH", url, data: body });
export const apiDelete = (url, config = {}) => request({ ...config, method: "DELETE", url });

export default axiosClient;
