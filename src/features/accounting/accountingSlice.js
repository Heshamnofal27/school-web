import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./accountingAPI";

export const fetchStudentOptions = createAsyncThunk(
  "accounting/fetchStudentOptions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchStudentOptions();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchStudentBilling = createAsyncThunk(
  "accounting/fetchStudentBilling",
  async (studentId, { rejectWithValue }) => {
    try {
      const res = await api.fetchStudentBilling(studentId);
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const submitPayment = createAsyncThunk(
  "accounting/submitPayment",
  async ({ studentId, amount, method }, { rejectWithValue }) => {
    try {
      const res = await api.submitPayment(studentId, amount, method);
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchFinancialDashboard = createAsyncThunk(
  "accounting/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchFinancialDashboard();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchTuitionSettings = createAsyncThunk(
  "accounting/fetchTuitionSettings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchTuitionSettings();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateTuitionPlans = createAsyncThunk(
  "accounting/updateTuitionPlans",
  async (plans, { rejectWithValue }) => {
    try {
      const res = await api.updateTuitionPlans(plans);
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateInstallmentPlans = createAsyncThunk(
  "accounting/updateInstallmentPlans",
  async (plans, { rejectWithValue }) => {
    try {
      const res = await api.updateInstallmentPlans(plans);
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchStudentFinancialRecords = createAsyncThunk(
  "accounting/fetchStudentRecords",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchStudentFinancialRecords();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  stats: null,
  cashFlow: [],
  invoices: [],
  recentTransactions: [],
  tuitionPlans: [],
  installmentPlans: [],
  studentRecords: [],
  studentOptions: [],
  billing: null,
  receipt: null,
  loading: false,
  saving: false,
  error: null,
  success: null,
};

const accountingSlice = createSlice({
  name: "accounting",
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
    clearSuccess(state) { state.success = null; },
    clearReceipt(state) { state.receipt = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancialDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.cashFlow = action.payload.cashFlow;
        state.invoices = action.payload.invoices;
        state.recentTransactions = action.payload.recentTransactions;
      })
      .addCase(fetchFinancialDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTuitionSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTuitionSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.tuitionPlans = action.payload.tuitionPlans;
        state.installmentPlans = action.payload.installmentPlans;
      })
      .addCase(fetchTuitionSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTuitionPlans.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateTuitionPlans.fulfilled, (state, action) => {
        state.saving = false;
        state.tuitionPlans = action.payload;
        state.success = "تم حفظ خطط الرسوم";
      })
      .addCase(updateTuitionPlans.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateInstallmentPlans.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateInstallmentPlans.fulfilled, (state, action) => {
        state.saving = false;
        state.installmentPlans = action.payload;
        state.success = "تم حفظ خطط الأقساط";
      })
      .addCase(updateInstallmentPlans.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentFinancialRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentFinancialRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.studentRecords = action.payload;
      })
      .addCase(fetchStudentFinancialRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentOptions.fulfilled, (state, action) => {
        state.studentOptions = action.payload;
      })
      .addCase(fetchStudentBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.billing = null;
        state.receipt = null;
      })
      .addCase(fetchStudentBilling.fulfilled, (state, action) => {
        state.loading = false;
        state.billing = action.payload;
      })
      .addCase(fetchStudentBilling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitPayment.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.receipt = null;
      })
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.saving = false;
        state.receipt = action.payload;
        state.billing.invoice.remaining = action.payload.remaining;
        state.billing.invoice.paid = action.payload.totalPaid;
        state.billing.invoice.status = action.payload.status;
        state.billing.transactions.unshift({
          id: `tx_${Date.now()}`,
          amount: action.payload.amount,
          method: action.payload.method,
          date: action.payload.date,
          type: "payment",
          status: "completed",
          description: "دفعة جديدة",
        });
        state.success = "تم تسجيل الدفعة بنجاح";
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearReceipt } = accountingSlice.actions;
export default accountingSlice.reducer;
