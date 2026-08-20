import { getFromStorage, STORAGE_KEYS } from "../../shared/utils/storage";

/**
 * 🌐 API Request Handler
 * ======================
 * إدارة مركزية لـ HTTP requests - Performance + Reliability
 *
 * الميزات:
 * - مسح البيانات الحساسة من logs (security)
 * - retry logic مع exponential backoff
 * - timeout handling
 * - error standardization
 */

/**
 * خيارات HTTP request
 */
const DEFAULT_OPTIONS = {
  timeout: 10000, // 10 ثوان
  retries: 2,
  backoff: 1000, // 1 ثانية
};
////
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:404";

const buildUrl = (url) => {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  const path = url.replace(/^\/+/, "");
  return `${baseUrl}/${path}`;
};

const getAuthToken = () => {
  const token = getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    return token;
  }

  const authState = getFromStorage(STORAGE_KEYS.AUTH_STATE);
  return authState?.token || null;
};

const buildHeaders = (headers) => {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
};

const parseResponseBody = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const getErrorMessage = (errorData, fallback) => {
  if (!errorData) {
    return fallback;
  }

  if (typeof errorData === "string") {
    return errorData;
  }

  return (
    errorData.message ||
    errorData.error ||
    errorData.detail ||
    errorData.errors?.[0]?.message ||
    fallback
  );
};

/**
 * تنفيذ HTTP request مع retry logic
 * @param {string} url - URL
 * @param {Object} options - {method, body, headers, timeout, retries}
 * @returns {Promise<Object>} النتيجة أو خطأ
 */
export const makeRequest = async (url, options = {}) => {
  const {
    method = "GET",
    body = null,
    headers = {},
    timeout = DEFAULT_OPTIONS.timeout,
    retries = DEFAULT_OPTIONS.retries,
  } = options;

  let lastError;
  const requestUrl = buildUrl(url);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // إنشء abort controller للـ timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(requestUrl, {
        method,
        headers: buildHeaders(headers),
        body: body ? JSON.stringify(body) : null,
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await parseResponseBody(response);

      // معالجة الأخطاء
      if (!response.ok) {
        throw new APIError(
          getErrorMessage(data, `HTTP ${response.status}`),
          response.status,
          data,
        );
      }

      return { success: true, data, status: response.status };
    } catch (error) {
      lastError = error;
      if (error instanceof APIError) {
        break;
      }

      // إذا كان آخر محاولة، ألقِ الخطأ
      if (attempt === retries) {
        break;
      }

      // انتظر قبل المحاولة التالية (exponential backoff)
      const waitTime = DEFAULT_OPTIONS.backoff * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  // معالجة الفشل
  return handleRequestError(lastError);
};

/**
 * معالج الأخطاء الموحد
 */
const handleRequestError = (error) => {
  if (error instanceof APIError) {
    return {
      success: false,
      error: error.message,
      message: error.message,
      statusCode: error.statusCode,
      data: error.data,
    };
  }

  if (error.name === "AbortError") {
    return {
      success: false,
      error: "Request timeout",
      message: "Request timeout",
      statusCode: 408,
    };
  }

  return {
    success: false,
    error: error.message || "Unknown error",
    message: error.message || "Unknown error",
    statusCode: 500,
  };
};

/**
 * فئة الخطأ المخصصة
 */
class APIError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * دوال مختصرة للـ HTTP methods
 */
export const apiGet = (url, options = {}) =>
  makeRequest(url, { ...options, method: "GET" });

export const apiPost = (url, body, options = {}) =>
  makeRequest(url, { ...options, method: "POST", body });

export const apiPut = (url, body, options = {}) =>
  makeRequest(url, { ...options, method: "PUT", body });

export const apiDelete = (url, options = {}) =>
  makeRequest(url, { ...options, method: "DELETE" });
