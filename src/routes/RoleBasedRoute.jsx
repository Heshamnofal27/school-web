/**
 * @component RoleBasedRoute
 * @description: مكون يحمي المسارات بناءً على دور المستخدم والصلاحيات
 *
 * يوفر طرقاً مختلفة للتحقق من الصلاحيات:
 * 1. requiredRole - دور واحد
 * 2. requiredRoles - عدة أدوار (OR logic)
 * 3. requiredPermission - صلاحية واحدة
 * 4. requiredPermissions - عدة صلاحيات (AND/OR logic)
 */

import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
} from "../shared/utils/permissionHelpers";

/**
 * @component RoleBasedRoute
 * @param {Object} props
 * @param {React.ReactNode} props.children - المحتوى المراد عرضه
 * @param {string} props.requiredRole - دور واحد مطلوب
 * @param {string[]} props.requiredRoles - عدة أدوار (أي واحد منها يكفي)
 * @param {string} props.requiredPermission - صلاحية واحدة
 * @param {string[]} props.requiredPermissions - عدة صلاحيات (جميعها مطلوبة)
 * @param {string[]} props.anyPermissions - صلاحيات (أي واحدة منها تكفي)
 * @param {React.ReactNode} props.fallback - محتوى بديل عند عدم وجود الصلاحية
 * @returns {JSX.Element}
 *
 * @example
 * // حماية بدور واحد
 * <RoleBasedRoute requiredRole="admin">
 *   <AdminPanel />
 * </RoleBasedRoute>
 *
 * // حماية بعدة أدوار
 * <RoleBasedRoute requiredRoles={['admin', 'teacher']}>
 *   <ManageStudents />
 * </RoleBasedRoute>
 *
 * // حماية بصلاحية
 * <RoleBasedRoute requiredPermission="manage_grades">
 *   <GradesManager />
 * </RoleBasedRoute>
 */
export default function RoleBasedRoute({
  children,
  requiredRole,
  requiredRoles = [],
  requiredPermission,
  requiredPermissions = [],
  anyPermissions = [],
  fallback = null,
}) {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  // إذا لم يكن المستخدم مصرحاً، أعده لتسجيل الدخول
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const userRole = user?.role;
  const userPermissions = user?.permissions || [];

  // فحص الدور الواحد المطلوب
  if (requiredRole && userRole !== requiredRole) {
    return fallback || <Navigate to="/" replace />;
  }

  // فحص عدة أدوار (OR logic)
  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    return fallback || <Navigate to="/" replace />;
  }

  // فحص صلاحية واحدة
  if (
    requiredPermission &&
    !hasPermission(userRole, requiredPermission, userPermissions)
  ) {
    return fallback || <Navigate to="/" replace />;
  }

  // فحص عدة صلاحيات (AND logic - جميعها مطلوبة)
  if (
    requiredPermissions.length > 0 &&
    !hasAllPermissions(userRole, requiredPermissions, userPermissions)
  ) {
    return fallback || <Navigate to="/" replace />;
  }

  // فحص أي صلاحية (OR logic - أي واحدة تكفي)
  if (
    anyPermissions.length > 0 &&
    !hasAnyPermission(userRole, anyPermissions, userPermissions)
  ) {
    return fallback || <Navigate to="/" replace />;
  }

  return children;
}
