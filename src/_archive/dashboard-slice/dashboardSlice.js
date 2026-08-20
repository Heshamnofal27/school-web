import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardStats } from "./dashboardAPI";

export const getDashboardStats = createAsyncThunk(
  "dashboard/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchDashboardStats();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getDashboardStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
      .addCase(getDashboardStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
