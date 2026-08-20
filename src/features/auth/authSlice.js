/**
 * @fileOverview Redux Slice للمصادقة والصلاحيات
 * @description: إدارة حالة تسجيل الدخول والمستخدم والصلاحيات
 */

import { createSlice } from "@reduxjs/toolkit";
import {
  loadAuthToken,
  saveAuthState,
  saveAuthToken,
  clearAuthState,
} from "../../shared/utils/storageManager";

/**
 * @description: بنية بيانات المستخدم الكاملة
 * {
 *   id: number,
 *   name: string,
 *   email: string,
 *   role: 'admin' | 'accountant' | 'supervisor',
 *   permissions: string[],
 *   avatar?: string,
 * }
 */
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: "idle", // idle | pending | succeeded | failed
  error: null,
};

const buildAuthPayload = (payload) => {
  if (!payload) {
    return { user: null, token: null };
  }

  if (payload?.user) {
    return {
      user: { ...payload.user },
      token: payload.token || payload.accessToken || null,
    };
  }

  const { token, accessToken, ...user } = payload || {};
  return {
    user,
    token: token || accessToken || null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * @description: تحديث حالة المستخدم بعد تسجيل الدخول الناجح
     * @param {Object} action.payload - بيانات المستخدم
     * @param {string} action.payload.role - دور المستخدم
     * @param {string[]} action.payload.permissions - صلاحيات المستخدم
     */
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      const { user, token } = buildAuthPayload(action.payload);
      const userData = user ?? null;

      state.user = userData;
      state.token = token;
      state.error = null;

      // حفظ الحالة في localStorage
      saveAuthState({
        isAuthenticated: state.isAuthenticated,
        user: userData,
        token,
      });

      if (token) {
        saveAuthToken(token);
      }
    },

    /**
     * @description: تسجيل خروج المستخدم
     */
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;

      // مسح الحالة من localStorage
      clearAuthState();
    },

    /**
     * @description: تحديث بيانات المستخدم
     */
    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    /**
     * @description: تعيين حالة التحميل
     */
    setLoading(state, action) {
      state.loading = action.payload;
    },

    /**
     * @description: تعيين الخطأ
     */
    setError(state, action) {
      state.error = action.payload;
      state.loading = "failed";
    },

    /**
     * @description: مسح الخطأ
     */
    clearError(state) {
      state.error = null;
    },

    /**
     * @description: استعادة حالة المستخدم من localStorage
     */
    restoreAuthState(state, action) {
      const savedState = action.payload;
      if (savedState) {
        state.isAuthenticated = savedState.isAuthenticated;
        state.user = savedState.user;
        state.token = savedState.token || loadAuthToken();
      }
    },
  },
});

export const {
  loginSuccess,
  logout,
  updateUser,
  setLoading,
  setError,
  clearError,
  restoreAuthState,
} = authSlice.actions;

export default authSlice.reducer;
