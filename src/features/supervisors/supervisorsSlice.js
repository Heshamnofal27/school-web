import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./supervisorsAPI";

export const fetchClasses = createAsyncThunk(
  "supervisors/fetchClasses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchClasses();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchGrades = createAsyncThunk(
  "supervisors/fetchGrades",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchGrades();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchSupervisors = createAsyncThunk(
  "supervisors/fetchSupervisors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchSupervisors();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAssignments = createAsyncThunk(
  "supervisors/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchAssignments();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const assignSupervisor = createAsyncThunk(
  "supervisors/assignSupervisor",
  async ({ classId, supervisorId }, { rejectWithValue }) => {
    try {
      const res = await api.assignSupervisor(classId, supervisorId);
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const moveSupervisor = createAsyncThunk(
  "supervisors/moveSupervisor",
  async ({ assignmentId, toClassId }, { rejectWithValue }) => {
    try {
      const res = await api.moveSupervisor(assignmentId, toClassId);
      if (!res.success) return rejectWithValue(res.message);
      return { assignmentId, toClassId, message: res.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const unassignSupervisor = createAsyncThunk(
  "supervisors/unassignSupervisor",
  async (assignmentId, { rejectWithValue }) => {
    try {
      const res = await api.unassignSupervisor(assignmentId);
      if (!res.success) return rejectWithValue(res.message);
      return assignmentId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  classes: [],
  grades: [],
  supervisors: [],
  assignments: [],
  loading: false,
  error: null,
  success: null,
};

const supervisorsSlice = createSlice({
  name: "supervisors",
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
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.grades = action.payload;
      })
      .addCase(fetchSupervisors.fulfilled, (state, action) => {
        state.supervisors = action.payload;
      })
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignSupervisor.fulfilled, (state, action) => {
        state.assignments.push(action.payload);
        state.success = "assignSuccess";
        state.error = null;
      })
      .addCase(assignSupervisor.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(moveSupervisor.fulfilled, (state, action) => {
        const { assignmentId, toClassId } = action.payload;
        const target = state.assignments.find((a) => a.id === assignmentId);
        if (target) target.classId = toClassId;
        state.success = "assignSuccess";
        state.error = null;
      })
      .addCase(moveSupervisor.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(unassignSupervisor.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(
          (a) => a.id !== action.payload,
        );
        state.success = "unassignSuccess";
        state.error = null;
      })
      .addCase(unassignSupervisor.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = supervisorsSlice.actions;
export default supervisorsSlice.reducer;
