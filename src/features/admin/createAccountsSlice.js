import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as accountsAPI from "./adminAccountsAPI";

// جلب المشرفين المضافين سابقاً من الـ LocalStorage لتجنب مسحهم عند الـ Refresh
const loadSavedSupervisors = () => {
  try {
    const saved = localStorage.getItem("supervisorsAddedThisSession");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  accountants: [],
  supervisorsAddedThisSession: loadSavedSupervisors(),
  loading: false,
  error: null,
  success: null,
};

export const fetchAccountants = createAsyncThunk(
  "createAccounts/fetchAccountants",
  async (_, { rejectWithValue }) => {
    try {
      return await accountsAPI.listAccountants();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const addSupervisorAccount = createAsyncThunk(
  "createAccounts/addSupervisorAccount",
  async ({ email, name }, { rejectWithValue }) => {
    try {
      if (!email || !name) {
        throw new Error("البريد الإلكتروني والاسم مطلوبان لإضافة مشرف");
      }
      const result = await accountsAPI.addSupervisorEmail({ email, name });
      return { email, name, ...result };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const addAccountantAccount = createAsyncThunk(
  "createAccounts/addAccountantAccount",
  async ({ email }, { rejectWithValue, dispatch }) => {
    try {
      if (!email) {
        throw new Error("البريد الإلكتروني مطلوب لإضافة محاسب");
      }
      const result = await accountsAPI.addAccountantEmail({ email });
      dispatch(fetchAccountants());
      return result;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const deleteAccountantAccount = createAsyncThunk(
  "createAccounts/deleteAccountantAccount",
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      await accountsAPI.deleteAccountant(id);
      dispatch(fetchAccountants());
      return { id };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const deleteSupervisorAccount = createAsyncThunk(
  "createAccounts/deleteSupervisorAccount",
  async ({ email }, { rejectWithValue }) => {
    try {
      await accountsAPI.deleteSupervisorByEmail(email);
      return { email };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const createAccountsSlice = createSlice({
  name: "createAccounts",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountants.fulfilled, (state, action) => {
        state.loading = false;
        // ⚠️ معالجة آمنة لهيكل البيانات القادم من الباك-إند سواء كان Array مباشر أو داخل Object
        const rawPayload = action.payload;
        if (Array.isArray(rawPayload)) {
          state.accountants = rawPayload;
        } else if (rawPayload && Array.isArray(rawPayload.data)) {
          state.accountants = rawPayload.data;
        } else if (rawPayload && Array.isArray(rawPayload.accountants)) {
          state.accountants = rawPayload.accountants;
        } else {
          state.accountants = [];
        }
      })
      .addCase(fetchAccountants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addSupervisorAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addSupervisorAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.supervisorsAddedThisSession.push(action.payload);
        // حفظ القائمة في LocalStorage لمنع مسحها عند Refresh
        localStorage.setItem(
          "supervisorsAddedThisSession",
          JSON.stringify(state.supervisorsAddedThisSession)
        );
        state.success = "تم إضافة بريد المشرف بنجاح — بإمكانه الآن إكمال التسجيل عبر صفحة التسجيل.";
      })
      .addCase(addSupervisorAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addAccountantAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addAccountantAccount.fulfilled, (state) => {
        state.loading = false;
        state.success = "تم إضافة بريد المحاسب بنجاح — بإمكانه الآن إكمال التسجيل عبر صفحة التسجيل.";
      })
      .addCase(addAccountantAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAccountantAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteAccountantAccount.fulfilled, (state) => {
        state.loading = false;
        state.success = "تم حذف المحاسب بنجاح";
      })
      .addCase(deleteAccountantAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteSupervisorAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteSupervisorAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.supervisorsAddedThisSession = state.supervisorsAddedThisSession.filter(
          (s) => s.email !== action.payload.email,
        );
        // تحديث LocalStorage بعد الحذف
        localStorage.setItem(
          "supervisorsAddedThisSession",
          JSON.stringify(state.supervisorsAddedThisSession)
        );
        state.success = "تم حذف المشرف بنجاح";
      })
      .addCase(deleteSupervisorAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = createAccountsSlice.actions;
export default createAccountsSlice.reducer;