/**
 * @fileOverview دوال مساعدة للتحقق من الصلاحيات
 * @description: دوال utility لفحص الأدوار والصلاحيات
 */

import { ROLE_PERMISSIONS, ROLES } from "../constants/roles";

/**
 * @description: التحقق من أن المستخدم له صلاحية معينة
 * @param {string} userRole - دور المستخدم
 * @param {string} requiredPermission - الصلاحية المطلوبة
 * @returns {boolean} هل المستخدم له الصلاحية
 *
 * @example
 * hasPermission('admin', 'manage_classes') // true
 * hasPermission('supervisor', 'manage_users') // false
 */
export const hasPermission = (
  userRole,
  requiredPermission,
  userPermissions,
) => {
  if (!requiredPermission) return false;

  if (Array.isArray(userPermissions)) {
    return userPermissions.includes(requiredPermission);
  }

  if (!userRole) return false;

  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(requiredPermission);
};

/**
 * @description: التحقق من أن المستخدم له أحد الصلاحيات من قائمة
 * @param {string} userRole - دور المستخدم
 * @param {string[]} requiredPermissions - الصلاحيات المطلوبة (OR logic)
 * @returns {boolean} هل المستخدم له واحدة من الصلاحيات
 *
 * @example
 * hasAnyPermission('teacher', ['manage_grades', 'manage_assignments']) // true
 */
export const hasAnyPermission = (
  userRole,
  requiredPermissions,
  userPermissions,
) => {
  if (!Array.isArray(requiredPermissions)) return false;

  return requiredPermissions.some((permission) =>
    hasPermission(userRole, permission, userPermissions),
  );
};

/**
 * @description: التحقق من أن المستخدم له جميع الصلاحيات من قائمة
 * @param {string} userRole - دور المستخدم
 * @param {string[]} requiredPermissions - الصلاحيات المطلوبة (AND logic)
 * @returns {boolean} هل المستخدم له جميع الصلاحيات
 *
 * @example
 * hasAllPermissions('admin', ['manage_grades', 'manage_users']) // true
 */
export const hasAllPermissions = (
  userRole,
  requiredPermissions,
  userPermissions,
) => {
  if (!Array.isArray(requiredPermissions)) return false;

  return requiredPermissions.every((permission) =>
    hasPermission(userRole, permission, userPermissions),
  );
};



/**
 * @description: التحقق من أن المستخدم هو مسؤول
 * @param {string} userRole - دور المستخدم
 * @returns {boolean}
 */
export const isAdmin = (userRole) => {
  return userRole === ROLES.ADMIN;
};


