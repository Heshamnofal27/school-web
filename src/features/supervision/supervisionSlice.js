import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./supervisionAPI";

export const fetchSupervisorDashboard = createAsyncThunk("supervision/fetchDashboard", async (userId, { rejectWithValue }) => {
  const res = await api.fetchSupervisorDashboard(userId);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const fetchStudentsByClass = createAsyncThunk("supervision/fetchStudents", async (classId, { rejectWithValue }) => {
  const res = await api.fetchStudentsByClass(classId);
  if (!res.success) return rejectWithValue(res.message);
  return { classId, students: res.data };
});

export const fetchStudentDetail = createAsyncThunk("supervision/fetchStudentDetail", async (studentId, { rejectWithValue }) => {
  const res = await api.fetchStudentDetail(studentId);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const addBehavior = createAsyncThunk("supervision/addBehavior", async ({ studentId, type, description, recordedBy }, { rejectWithValue }) => {
  const res = await api.addBehavior(studentId, type, description, recordedBy);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const addEvaluation = createAsyncThunk("supervision/addEvaluation", async ({ studentId, academic, behavior, participation, notes, recordedBy }, { rejectWithValue }) => {
  const res = await api.addEvaluation(studentId, academic, behavior, participation, notes, recordedBy);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const addParentContact = createAsyncThunk("supervision/addParentContact", async ({ studentId, reason, type, notes, recordedBy }, { rejectWithValue }) => {
  const res = await api.addParentContact(studentId, reason, type, notes, recordedBy);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const addPenalty = createAsyncThunk("supervision/addPenalty", async ({ studentId, type, reason, recordedBy }, { rejectWithValue }) => {
  const res = await api.addPenalty(studentId, type, reason, recordedBy);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const fetchMeetings = createAsyncThunk("supervision/fetchMeetings", async (_, { rejectWithValue }) => {
  const res = await api.fetchMeetings();
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const createMeeting = createAsyncThunk("supervision/createMeeting", async ({ meeting, createdBy }, { rejectWithValue }) => {
  const res = await api.createMeeting(meeting, createdBy);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const fetchClassOverview = createAsyncThunk("supervision/fetchClassOverview", async (classId, { rejectWithValue }) => {
  const res = await api.fetchClassOverview(classId);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const fetchStudentReports = createAsyncThunk("supervision/fetchReports", async (studentId, { rejectWithValue }) => {
  const res = await api.fetchStudentReports(studentId);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const saveStudentReport = createAsyncThunk("supervision/saveReport", async ({ studentId, type, content, createdBy }, { rejectWithValue }) => {
  const res = await api.saveReport(studentId, type, content, createdBy);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

const initialState = {
  supervisor: null,
  stats: null,
  recentActivities: [],
  currentClassId: null,
  classOverview: null,
  students: [],
  studentDetail: null,
  reports: [],
  meetings: [],
  loading: false,
  error: null,
  success: null,
};

const supervisionSlice = createSlice({
  name: "supervision",
  initialState,
  reducers: {
    setCurrentClass: (state, action) => { state.currentClassId = action.payload; },
    clearStudentDetail: (state) => { state.studentDetail = null; },
    clearClassOverview: (state) => { state.classOverview = null; },
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = null; },
  },
  extraReducers: (builder) => {
    const p = (s) => { s.loading = true; s.error = null; s.success = null; };

    builder
      .addCase(fetchSupervisorDashboard.pending, p)
      .addCase(fetchSupervisorDashboard.fulfilled, (s, a) => {
        s.loading = false;
        s.supervisor = a.payload;
        s.stats = a.payload.stats;
        s.recentActivities = a.payload.recentActivities;
      })
      .addCase(fetchSupervisorDashboard.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchStudentsByClass.pending, p)
      .addCase(fetchStudentsByClass.fulfilled, (s, a) => { s.loading = false; s.currentClassId = a.payload.classId; s.students = a.payload.students; })
      .addCase(fetchStudentsByClass.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchStudentDetail.pending, p)
      .addCase(fetchStudentDetail.fulfilled, (s, a) => { s.loading = false; s.studentDetail = a.payload; })
      .addCase(fetchStudentDetail.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(addBehavior.pending, p)
      .addCase(addBehavior.fulfilled, (s, a) => {
        s.loading = false; s.success = "تم تسجيل الملاحظة";
        if (s.studentDetail) s.studentDetail.behaviors.unshift(a.payload);
      })
      .addCase(addBehavior.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(addEvaluation.pending, p)
      .addCase(addEvaluation.fulfilled, (s, a) => {
        s.loading = false; s.success = "تم حفظ التقييم";
        if (s.studentDetail) s.studentDetail.evaluations.unshift(a.payload);
      })
      .addCase(addEvaluation.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(addParentContact.pending, p)
      .addCase(addParentContact.fulfilled, (s, a) => {
        s.loading = false; s.success = "تم تسجيل التواصل";
        if (s.studentDetail) s.studentDetail.parentContacts.unshift(a.payload);
      })
      .addCase(addParentContact.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(addPenalty.pending, p)
      .addCase(addPenalty.fulfilled, (s, a) => {
        s.loading = false; s.success = "تم تسجيل العقوبة";
        if (s.studentDetail) s.studentDetail.penalties.unshift(a.payload);
      })
      .addCase(addPenalty.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchClassOverview.pending, p)
      .addCase(fetchClassOverview.fulfilled, (s, a) => { s.loading = false; s.classOverview = a.payload; })
      .addCase(fetchClassOverview.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchMeetings.pending, p)
      .addCase(fetchMeetings.fulfilled, (s, a) => { s.loading = false; s.meetings = a.payload; })
      .addCase(fetchMeetings.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createMeeting.pending, p)
      .addCase(createMeeting.fulfilled, (s, a) => { s.loading = false; s.success = "تم إنشاء الاجتماع"; s.meetings.unshift(a.payload); })
      .addCase(createMeeting.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchStudentReports.pending, p)
      .addCase(fetchStudentReports.fulfilled, (s, a) => { s.loading = false; s.reports = a.payload; })
      .addCase(fetchStudentReports.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(saveStudentReport.pending, p)
      .addCase(saveStudentReport.fulfilled, (s, a) => {
        s.loading = false; s.success = "تم حفظ التقرير";
        s.reports.unshift(a.payload);
      })
      .addCase(saveStudentReport.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { setCurrentClass, clearStudentDetail, clearClassOverview, clearError, clearSuccess } = supervisionSlice.actions;
export default supervisionSlice.reducer;
