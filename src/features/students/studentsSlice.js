import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./studentsAPI";

export const fetchAllStudents = createAsyncThunk("students/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await api.fetchAllStudents();
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchAllClasses = createAsyncThunk("students/fetchClasses", async (_, { rejectWithValue }) => {
  try {
    const res = await api.fetchAllClasses();
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchAllGrades = createAsyncThunk("students/fetchGrades", async (_, { rejectWithValue }) => {
  try {
    const res = await api.fetchAllGrades();
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  } catch (err) { return rejectWithValue(err.message); }
});

export const transferStudents = createAsyncThunk("students/transfer", async ({ studentIds, fromClassId, toClassId }, { rejectWithValue }) => {
  try {
    const res = await api.executeTransfer(studentIds, fromClassId, toClassId);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchTransferHistory = createAsyncThunk("students/fetchHistory", async (_, { rejectWithValue }) => {
  try {
    const res = await api.fetchTransferHistory();
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  } catch (err) { return rejectWithValue(err.message); }
});

const initialState = {
  students: [],
  classes: [],
  grades: [],
  history: [],
  loading: false,
  error: null,
  success: null,
};

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = null; },
  },
  extraReducers: (builder) => {
    const setLoading = (state) => { state.loading = true; state.error = null; state.success = null; };
    const setError = (state, action) => { state.loading = false; state.error = action.payload; };
    builder
      .addCase(fetchAllStudents.pending, setLoading)
      .addCase(fetchAllStudents.fulfilled, (state, action) => { state.loading = false; state.students = action.payload; })
      .addCase(fetchAllStudents.rejected, setError)

      .addCase(fetchAllClasses.pending, setLoading)
      .addCase(fetchAllClasses.fulfilled, (state, action) => { state.loading = false; state.classes = action.payload; })
      .addCase(fetchAllClasses.rejected, setError)

      .addCase(fetchAllGrades.pending, setLoading)
      .addCase(fetchAllGrades.fulfilled, (state, action) => { state.loading = false; state.grades = action.payload; })
      .addCase(fetchAllGrades.rejected, setError)

      .addCase(transferStudents.pending, setLoading)
      .addCase(transferStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.success = `تم نقل الطلاب بنجاح`;
        state.history.unshift(action.payload);
      })
      .addCase(transferStudents.rejected, setError)

      .addCase(fetchTransferHistory.pending, setLoading)
      .addCase(fetchTransferHistory.fulfilled, (state, action) => { state.loading = false; state.history = action.payload; })
      .addCase(fetchTransferHistory.rejected, setError);
  },
});

export const { clearError, clearSuccess } = studentsSlice.actions;
export default studentsSlice.reducer;
