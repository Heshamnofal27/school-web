/**
 * @fileOverview Hooks للتحقق من الصلاحيات
 * @description: hooks مخصصة لاستخدام نظام الصلاحيات في المكونات
 */

import { useSelector } from "react-redux";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessPage,
  isAdmin,
  isTeacher,
  isStudent,
} from "../utils/permissionHelpers";

/**
 * @hook useUserRole
 * @description: الحصول على دور المستخدم الحالي
 * @returns {string|null} دور المستخدم
 *
 * @example
 * const role = useUserRole();
 */
export function useUserRole() {
  const user = useSelector((state) => state.auth.user);
  return user?.role || null;
}

/**
 * @hook usePermission
 * @description: التحقق من صلاحية محددة
 * @param {string} permission - الصلاحية المطلوبة
 * @returns {boolean}
 *
 * @example
 * const canManageGrades = usePermission('manage_grades');
 * if (canManageGrades) {
 *   // عرض زر إدارة الدرجات
 * }
 */
export function usePermission(permission) {
  const user = useUserInfo();
  return hasPermission(user?.role, permission, user?.permissions || []);
}

/**
 * @hook useAnyPermission
 * @description: التحقق من أن المستخدم له أحد الصلاحيات
 * @param {string[]} permissions - الصلاحيات المطلوبة
 * @returns {boolean}
 *
 * @example
 * const canModify = useAnyPermission(['manage_grades', 'manage_assignments']);
 */
export function useAnyPermission(permissions) {
  const user = useUserInfo();
  return hasAnyPermission(user?.role, permissions, user?.permissions || []);
}

/**
 * @hook useAllPermissions
 * @description: التحقق من أن المستخدم له جميع الصلاحيات
 * @param {string[]} permissions - الصلاحيات المطلوبة
 * @returns {boolean}
 *
 * @example
 * const canDoEverything = useAllPermissions(['manage_users', 'manage_settings']);
 */
export function useAllPermissions(permissions) {
  const user = useUserInfo();
  return hasAllPermissions(user?.role, permissions, user?.permissions || []);
}

/**
 * @hook useCanAccess
 * @description: التحقق من أمكانية الوصول لصفحة معينة
 * @param {string} pagePath - مسار الصفحة
 * @returns {boolean}
 *
 * @example
 * const canAccessStudents = useCanAccess('/students');
 */
export function useCanAccess(pagePath) {
  const role = useUserRole();
  return canAccessPage(role, pagePath);
}

/**
 * @hook useIsAdmin
 * @description: التحقق من أن المستخدم مسؤول
 * @returns {boolean}
 *
 * @example
 * if (useIsAdmin()) {
 *   // عرض أدوات الإدارة
 * }
 */
export function useIsAdmin() {
  const role = useUserRole();
  return isAdmin(role);
}

/**
 * @hook useIsTeacher
 * @description: التحقق من أن المستخدم معلم
 * @returns {boolean}
 */
export function useIsTeacher() {
  const role = useUserRole();
  return isTeacher(role);
}

/**
 * @hook useIsStudent
 * @description: التحقق من أن المستخدم طالب
 * @returns {boolean}
 */
export function useIsStudent() {
  const role = useUserRole();
  return isStudent(role);
}

/**
 * @hook useUserPermissions
 * @description: الحصول على جميع صلاحيات المستخدم
 * @returns {string[]} قائمة الصلاحيات
 *
 * @example
 * const permissions = useUserPermissions();
 * console.log(permissions); // ['view_grades', 'manage_grades', ...]
 */
export function useUserPermissions() {
  const user = useSelector((state) => state.auth.user);
  return user?.permissions || [];
}

/**
 * @hook useUserInfo
 * @description: الحصول على بيانات المستخدم الكاملة
 * @returns {Object} بيانات المستخدم
 *
 * @example
 * const { name, email, role } = useUserInfo();
 */
export function useUserInfo() {
  const user = useSelector((state) => state.auth.user);
  return user || null;
}
