import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import AppLayout from "../layouts/AppLayout";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import RoleRedirect from "./RoleRedirect";
import { authRoutes } from "../features/auth/routes";

// Admin Components
import Home from "../features/dashboard/pages/Home";
import CreateAccounts from "../features/admin/pages/CreateAccounts";
// import StaffAccountsManager from "../features/admin/pages/StaffAccountsManager";
import SpecializationsManager from "../features/admin/pages/SpecializationsManager";
import ComplaintsView from "../features/admin/pages/ComplaintsView";
import BusesManager from "../features/admin/pages/BusesManager";
import SupervisorAssignment from "../features/supervisors/pages/SupervisorAssignment";
import ManageClasses from "../features/classes/pages/ManageClasses";
import TransferStudents from "../features/students/pages/TransferStudents";

// Supervision Components
import SupervisionDashboard from "../features/supervision/pages/SupervisionDashboard";
import ClassOverview from "../features/supervision/pages/ClassOverview";
import StudentList from "../features/supervision/pages/StudentList";
import StudentProfile from "../features/supervision/pages/StudentProfile";
import SupervisorClassStudents from "../features/supervision/pages/SupervisorClassStudents";
import AttendanceManager from "../features/supervision/pages/AttendanceManager";
import SchoolTripsManager from "../features/supervision/pages/SchoolTripsManager";
import MeetingsManager from "../features/supervision/pages/MeetingsManager";

// Accounting Components
import FinancialDashboard from "../features/accounting/pages/FinancialDashboard";
import TuitionSettings from "../features/accounting/pages/TuitionSettings";
import StudentFinancialDirectory from "../features/accounting/pages/StudentFinancialDirectory";
import StudentBillingPage from "../features/accounting/pages/StudentBillingPage";
import DuePaymentsManager from "../features/accounting/pages/DuePaymentsManager";

// Shared / Settings
import { settingsRoutes } from "../features/settings/routes";
import { ROLES } from "../shared/constants/roles";

// مكون محلي مؤقت للصفحات القادمة لتجنب مشاكل الـ Import
function PagePlaceholder({ title }) {
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        هذه الصفحة قيد التطوير حالياً.
      </Typography>
    </Box>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {authRoutes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<RoleRedirect />} />

          {/* ─── Admin Routes ─── */}
          <Route
            path="admin/dashboard"
            element={<RoleBasedRoute requiredRole={ROLES.ADMIN}><Home /></RoleBasedRoute>}
          />
          <Route
            path="admin/authorized-emails"
            element={<RoleBasedRoute requiredRole={ROLES.ADMIN}><CreateAccounts /></RoleBasedRoute>}
          />
          <Route
            path="admin/create-accounts"
            element={<RoleBasedRoute requiredRole={ROLES.ADMIN}><CreateAccounts /></RoleBasedRoute>}
          />
          <Route
            path="admin/manage-classes"
            element={<RoleBasedRoute requiredRole={ROLES.ADMIN}><ManageClasses /></RoleBasedRoute>}
          />
          <Route
            path="admin/transfer-students"
            element={<RoleBasedRoute requiredRole={ROLES.ADMIN}><TransferStudents /></RoleBasedRoute>}
          />
          <Route
            path="admin/assign-supervisors"
            element={<RoleBasedRoute requiredRole={ROLES.ADMIN}><SupervisorAssignment /></RoleBasedRoute>}
          />
          <Route
            path="admin/announcements-approval"
            element={<RoleBasedRoute requiredRole={ROLES.ADMIN}><PagePlaceholder title="الموافقة على الإعلانات" /></RoleBasedRoute>}
          />
          <Route
            path="admin/teachers"
            element={<RoleBasedRoute requiredRole={ROLES.ADMIN}><SpecializationsManager /></RoleBasedRoute>}
          />
          <Route
            path="admin/specializations"
            element={<RoleBasedRoute requiredRole={ROLES.ADMIN}><SpecializationsManager /></RoleBasedRoute>}
          />
          <Route
            path="admin/complaints"
            element={<RoleBasedRoute requiredRole={ROLES.ADMIN}><ComplaintsView /></RoleBasedRoute>}
          />
          <Route
            path="admin/buses"
            element={<RoleBasedRoute requiredRole={ROLES.ADMIN}><BusesManager /></RoleBasedRoute>}
          />

          {/* ─── Supervisor Routes ─── */}
          <Route
            path="supervisor/dashboard"
            element={<RoleBasedRoute requiredRole={ROLES.SUPERVISION}><SupervisionDashboard /></RoleBasedRoute>}
          />
          <Route
            path="supervisor/class-students"
            element={<RoleBasedRoute requiredRole={ROLES.SUPERVISION}><SupervisorClassStudents /></RoleBasedRoute>}
          />
          <Route
            path="supervisor/attendance"
            element={<RoleBasedRoute requiredRole={ROLES.SUPERVISION}><AttendanceManager /></RoleBasedRoute>}
          />
          <Route
            path="supervisor/behavioral-notes"
            element={<RoleBasedRoute requiredRole={ROLES.SUPERVISION}><PagePlaceholder title="الملاحظات والتقارير السلوكية" /></RoleBasedRoute>}
          />
          <Route
            path="supervisor/trips"
            element={<RoleBasedRoute requiredRole={ROLES.SUPERVISION}><SchoolTripsManager /></RoleBasedRoute>}
          />
          <Route
            path="supervisor/meetings"
            element={<RoleBasedRoute requiredRole={ROLES.SUPERVISION}><MeetingsManager /></RoleBasedRoute>}
          />
          <Route
            path="supervisor/class/:classId"
            element={<RoleBasedRoute requiredRole={ROLES.SUPERVISION}><ClassOverview /></RoleBasedRoute>}
          />
          <Route
            path="supervisor/students/:classId"
            element={<RoleBasedRoute requiredRole={ROLES.SUPERVISION}><StudentList /></RoleBasedRoute>}
          />
          <Route
            path="supervisor/student/:studentId"
            element={<RoleBasedRoute requiredRole={ROLES.SUPERVISION}><StudentProfile /></RoleBasedRoute>}
          />

          {/* ─── Accounting Routes ─── */}
          <Route
            path="accounting/dashboard"
            element={<RoleBasedRoute requiredRole={ROLES.ACCOUNTING}><FinancialDashboard /></RoleBasedRoute>}
          />
          <Route
            path="accounting/student-directory"
            element={<RoleBasedRoute requiredRole={ROLES.ACCOUNTING}><StudentFinancialDirectory /></RoleBasedRoute>}
          />
          <Route
            path="accounting/tuition-settings"
            element={<RoleBasedRoute requiredRole={ROLES.ACCOUNTING}><TuitionSettings /></RoleBasedRoute>}
          />
          <Route
            path="accounting/due-payments"
            element={<RoleBasedRoute requiredRole={ROLES.ACCOUNTING}><DuePaymentsManager /></RoleBasedRoute>}
          />
          <Route
            path="accounting/student-billing"
            element={<RoleBasedRoute requiredRole={ROLES.ACCOUNTING}><StudentBillingPage /></RoleBasedRoute>}
          />

          {/* ─── Settings (shared) ─── */}
          {settingsRoutes.map((r, idx) => (
            <Route key={r.path ?? idx} path={r.path} element={r.element} />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}