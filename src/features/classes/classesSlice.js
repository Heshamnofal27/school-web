import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./classesAPI";

export const fetchAllClasses = createAsyncThunk(
  "classes/fetchAllClasses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchAllClasses();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAllGrades = createAsyncThunk(
  "classes/fetchAllGrades",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchAllGrades();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createClass = createAsyncThunk(
  "classes/createClass",
  async (classData, { rejectWithValue }) => {
    try {
      const res = await api.createClass(classData);
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateClass = createAsyncThunk(
  "classes/updateClass",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const res = await api.updateClass(id, data);
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteClass = createAsyncThunk(
  "classes/deleteClass",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.deleteClass(id);
      if (!res.success) return rejectWithValue(res.message);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  classes: [],
  grades: [],
  loading: false,
  error: null,
  success: null,
};

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
    clearSuccess(state) { state.success = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllClasses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllClasses.fulfilled, (state, action) => { state.loading = false; state.classes = action.payload; })
      .addCase(fetchAllClasses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAllGrades.fulfilled, (state, action) => { state.grades = action.payload; })
      .addCase(createClass.fulfilled, (state, action) => {
        state.classes.push(action.payload);
        state.success = "تم إضافة الشعبة بنجاح";
        state.error = null;
      })
      .addCase(createClass.rejected, (state, action) => { state.error = action.payload; })
      .addCase(updateClass.fulfilled, (state, action) => {
        const idx = state.classes.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.classes[idx] = action.payload;
        state.success = "تم تعديل الشعبة بنجاح";
        state.error = null;
      })
      .addCase(updateClass.rejected, (state, action) => { state.error = action.payload; })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter((c) => c.id !== action.payload);
        state.success = "تم حذف الشعبة بنجاح";
        state.error = null;
      })
      .addCase(deleteClass.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearError, clearSuccess } = classesSlice.actions;
export default classesSlice.reducer;
