# 🔗 دليل ربط Frontend مع Backend APIs

## 🎯 نظرة عامة

هذا الملف يشرح كيفية تغيير `authAPI.js` من استخدام بيانات وهمية (Mock Data) إلى استخدام APIs حقيقية من الخادم.

---

## 📦 التكيف الأول: استخدام Axios

### 1. تثبيت Axios

```bash
npm install axios
```

### 2. إنشاء Axios Instance

**ملف جديد: `src/api/axiosInstance.js`**

```javascript
import axios from "axios";
import store from "../app/store";
import { logout } from "../features/auth/authSlice";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// إنشاء instance من Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة التوكن للـ Request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// معالجة الأخطاء والـ Response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // إذا كان الخطأ 401 (انتهاء التوكن)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // تسجيل الخروج عند فشل التحديث
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
```

---

## 🔄 تحديث authAPI.js

### الملف الجديد: `src/features/auth/authAPI.js`

```javascript
/**
 * @fileOverview دوال API للمصادقة - ربط حقيقي مع الخادم
 * @description: تسجيل الدخول وجلب بيانات المستخدم من الخادم الحقيقي
 */

import axiosInstance from "../../api/axiosInstance";

/**
 * @description: تسجيل الدخول مع الخادم
 * @param {string} email - بريد المستخدم
 * @param {string} password - كلمة المرور
 * @returns {Promise<Object>} بيانات المستخدم والتوكن
 * @throws {Error} إذا فشل تسجيل الدخول
 */
export async function loginWithEmail(email, password) {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    const { token, refreshToken } = response.data.data;

    // حفظ التوكنات في localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "حدث خطأ أثناء تسجيل الدخول";

    throw new Error(errorMessage);
  }
}

/**
 * @description: جلب بيانات المستخدم الحالي من الخادم
 * @returns {Promise<Object>} بيانات المستخدم
 * @throws {Error} إذا فشل جلب البيانات
 */
export async function getCurrentUser() {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "فشل جلب بيانات المستخدم";

    throw new Error(errorMessage);
  }
}

/**
 * @description: تحديث التوكن
 * @param {string} refreshToken
 * @returns {Promise<Object>} توكن جديد
 */
export async function refreshUserToken(refreshToken) {
  try {
    const response = await axiosInstance.post("/auth/refresh", {
      refreshToken,
    });

    const { token, refreshToken: newRefreshToken } = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", newRefreshToken);

    return { token, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error("فشل تحديث التوكن");
  }
}

/**
 * @description: تسجيل الخروج
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await axiosInstance.post("/auth/logout", {});

    // حذف التوكنات من localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  } catch (error) {
    console.error("خطأ في تسجيل الخروج:", error);
    // حذف التوكنات حتى في حالة الخطأ
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }
}

/**
 * @description: الحصول على جميع المستخدمين (للإدارة)
 * @param {Object} params - معاملات البحث والتصفية
 * @returns {Promise<Object>} قائمة المستخدمين مع Pagination
 */
export async function getAllUsers(params = {}) {
  try {
    const response = await axiosInstance.get("/users", { params });
    return response.data;
  } catch (error) {
    throw new Error("فشل جلب المستخدمين");
  }
}

/**
 * @description: الحصول على مستخدم محدد
 * @param {number} userId - معرف المستخدم
 * @returns {Promise<Object>} بيانات المستخدم
 */
export async function getUserById(userId) {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    throw new Error("فشل جلب بيانات المستخدم");
  }
}

/**
 * @description: إنشاء مستخدم جديد
 * @param {Object} userData - بيانات المستخدم الجديد
 * @returns {Promise<Object>} المستخدم المُنشأ
 */
export async function createUser(userData) {
  try {
    const response = await axiosInstance.post("/users", userData);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "فشل إنشاء المستخدم";

    throw new Error(errorMessage);
  }
}

/**
 * @description: تعديل بيانات المستخدم
 * @param {number} userId - معرف المستخدم
 * @param {Object} userData - البيانات المراد تحديثها
 * @returns {Promise<Object>} المستخدم المحدث
 */
export async function updateUser(userId, userData) {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data.data;
  } catch (error) {
    throw new Error("فشل تحديث بيانات المستخدم");
  }
}

/**
 * @description: حذف مستخدم
 * @param {number} userId - معرف المستخدم
 * @returns {Promise<void>}
 */
export async function deleteUser(userId) {
  try {
    await axiosInstance.delete(`/users/${userId}`);
  } catch (error) {
    throw new Error("فشل حذف المستخدم");
  }
}
```

---

## 🔑 تحديث authSlice.js

**إضافة حالات جديدة لمعالجة الـ API:**

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginWithEmail, logout, getCurrentUser } from "./authAPI";
import { ROLE_PERMISSIONS } from "../../shared/constants/roles";

// Async Thunks
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await loginWithEmail(email, password);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.isAuthenticated = true;
        const userData = action.payload;

        // تأكد من وجود الصلاحيات
        if (userData.role && !userData.permissions) {
          userData.permissions = ROLE_PERMISSIONS[userData.role];
        }

        state.user = userData;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Fetch Current User
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = "idle";
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
        // لا نزال نسجل خروج المستخدم حتى لو فشل الطلب
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
```

---

## 🔌 تحديث Login Component

**ملف: `src/features/auth/pages/Login.jsx`**

```javascript
import { useDispatch, useSelector } from "react-redux";
import { login } from "../authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Dispatch الإجراء
    const result = await dispatch(login({ email, password }));

    if (result.type === login.fulfilled.type) {
      // تسجيل دخول ناجح
      navigate("/dashboard-admin"); // أو حسب الدور
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="البريد الإلكتروني"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="كلمة المرور"
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading === "pending"}>
        {loading === "pending" ? "جاري التحميل..." : "دخول"}
      </button>
    </form>
  );
}
```

---

## 🌍 متغيرات البيئة

**ملف: `.env`**

```env
# Development
REACT_APP_API_URL=http://localhost:3001/api

# Production
# REACT_APP_API_URL=https://api.school.com/api
```

---

## 📝 أمثلة استخدام الـ APIs الجديدة

### مثال 1: جلب المستخدمين

```javascript
import { getAllUsers } from "../features/auth/authAPI";

// في مكون React
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers({
        page: 1,
        limit: 10,
        role: "admin",
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  fetchUsers();
}, []);
```

### مثال 2: إنشاء فاتورة جديدة

**ملف جديد: `src/features/accounting/invoiceAPI.js`**

```javascript
import axiosInstance from "../../api/axiosInstance";

export async function createInvoice(invoiceData) {
  try {
    const response = await axiosInstance.post(
      "/accounting/invoices",
      invoiceData,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "فشل إنشاء الفاتورة");
  }
}

export async function getInvoices(params = {}) {
  try {
    const response = await axiosInstance.get("/accounting/invoices", {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error("فشل جلب الفواتير");
  }
}

export async function updateInvoice(invoiceId, invoiceData) {
  try {
    const response = await axiosInstance.put(
      `/accounting/invoices/${invoiceId}`,
      invoiceData,
    );
    return response.data.data;
  } catch (error) {
    throw new Error("فشل تحديث الفاتورة");
  }
}

export async function deleteInvoice(invoiceId) {
  try {
    await axiosInstance.delete(`/accounting/invoices/${invoiceId}`);
  } catch (error) {
    throw new Error("فشل حذف الفاتورة");
  }
}

export async function approveInvoice(invoiceId) {
  try {
    const response = await axiosInstance.put(
      `/accounting/invoices/${invoiceId}/approve`,
      {},
    );
    return response.data.data;
  } catch (error) {
    throw new Error("فشل موافقة الفاتورة");
  }
}
```

### مثال 3: تسجيل الحضور

**ملف جديد: `src/features/supervision/attendanceAPI.js`**

```javascript
import axiosInstance from "../../api/axiosInstance";

export async function recordAttendance(attendanceData) {
  try {
    const response = await axiosInstance.post(
      "/supervision/attendance",
      attendanceData,
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "فشل تسجيل الحضور");
  }
}

export async function getAttendance(params = {}) {
  try {
    const response = await axiosInstance.get("/supervision/attendance", {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error("فشل جلب الحضور");
  }
}
```

---

## 🧪 اختبار التوصيل

### 1. اختبر تسجيل الدخول

```javascript
// في console
fetch("http://localhost:3001/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@school.com",
    password: "password123",
  }),
})
  .then((r) => r.json())
  .then((d) => console.log(d));
```

### 2. اختبر الصلاحيات

```javascript
// تحقق من الـ token في localStorage
console.log(localStorage.getItem("token"));

// فك التشفير (base64)
const token = localStorage.getItem("token");
const payload = token.split(".")[1];
const decoded = JSON.parse(atob(payload));
console.log(decoded);
```

---

## ⚠️ ملاحظات مهمة

1. **تخزين التوكن بأمان:**
   - ✅ يمكن تخزينه في localStorage (للبساطة)
   - 🔒 الأفضل: تخزينه في HttpOnly Cookie

2. **معالجة الأخطاء:**
   - تأكد من معالجة جميع حالات الخطأ
   - عرض رسائل واضحة للمستخدم

3. **الأداء:**
   - استخدم caching حيث يكون مناسباً
   - قلل عدد الطلبات غير الضرورية

4. **الأمان:**
   - تحقق من CORS على الخادم
   - استخدم HTTPS في الإنتاج
   - لا تخزن البيانات الحساسة في localStorage

---

**بعد تطبيق هذه الخطوات، سيكون التطبيق متصلاً بالخادم الحقيقي! ✅**
