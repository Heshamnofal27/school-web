# 🔐 نظام الأدوار والصلاحيات (Roles & Permissions System)

## 🎯 نظرة عامة

نظام متكامل لإدارة الأدوار والصلاحيات في التطبيق، يسمح بـ:

- ✅ حماية المسارات (Routes) بناءً على الأدوار
- ✅ إظهار/إخفاء المحتوى بناءً على الصلاحيات
- ✅ فحص الصلاحيات مباشرة في المكونات
- ✅ دعم 3 أدوار افتراضية (Admin, Accounting, Supervision) ⭐
- ✅ إمكانية التوسع بأدوار وصلاحيات إضافية
- ✅ نظام التحقق من البريد الإلكتروني قبل التسجيل ⭐

---

## 📋 الأدوار الحالية

### 👨‍💼 Admin (مسؤول المدرسة)

- **الوصول:** صلاحيات كاملة
- **الصفحات:** `/dashboard-admin`, `/school-settings`, `/student-accounts`, `/classes`, `/users-management`, `/authorized-emails`
- **الصلاحيات:** 18 صلاحية (تم إضافة 5 صلاحيات جديدة لإدارة الـ emails) ⭐
- **البيانات الاختبارية:**
  - Email: `admin@school.com`
  - Password: أي شيء

### 💰 Accounting (قسم المحاسبة)

- **الوصول:** إدارة الشؤون المالية فقط
- **الصفحات:** `/dashboard-accounting`, `/invoices`, `/treasury`, `/expenses`, `/financial-reports`, `/payment-methods`
- **الصلاحيات:** 18 صلاحية
  - إدارة الفواتير (عرض، إضافة، تعديل، حذف)
  - إدارة الخزنة والمقبوضات
  - إدارة المصاريف
  - إنشاء التقارير المالية
  - إدارة طرق الدفع
- **البيانات الاختبارية:**
  - Email: `accounting@school.com`
  - Password: أي شيء

### 📋 Supervision (الإشراف الأكاديمي)

- **الوصول:** الإشراف الأكاديمي والسلوكي
- **الصفحات:** `/dashboard-supervision`, `/attendance`, `/behavior`, `/schedules`, `/academic-reports`, `/student-progress`
- **الصلاحيات:** 17 صلاحية
  - تسجيل الحضور والغياب
  - تقييم السلوك والانضباط
  - إدارة الجداول الدراسية
  - إنشاء التقارير الإشرافية
  - متابعة تقدم الطلاب الأكاديمي
- **البيانات الاختبارية:**
  - Email: `supervision@school.com`
  - Password: أي شيء

---

## ⭐ نظام الـ Emails المعتمدة (جديد)

### الغرض:

السماح فقط للبريد الإلكتروني المعتمد من قبل الأدمن بإنشاء حساب جديد.

### الحالات:

- **PENDING**: البريد جاهز للاستخدام في التسجيل
- **USED**: تم استخدام البريد لإنشاء حساب
- **INACTIVE**: تم تعطيل البريد من قبل الأدمن
- **EXPIRED**: انتهت صلاحية البريد

### الصلاحيات الجديدة (5):

1. `manage_authorized_emails` - التحكم الكامل
2. `view_authorized_emails` - عرض القائمة فقط
3. `add_authorized_email` - إضافة بريد جديد
4. `edit_authorized_email` - تعديل البيانات
5. `delete_authorized_email` - حذف البريد

### الملفات المتعلقة:

- `src/data/mock/authorizedEmails.js` - البيانات الاختبارية
- `src/features/auth/authorizedEmailsAPI.js` - واجهة API

---

## 🗂️ بنية الملفات

```
src/
├── shared/
│   ├── constants/
│   │   └── roles.js                    # تعريف الأدوار والصلاحيات
│   ├── utils/
│   │   └── permissionHelpers.js        # دوال التحقق من الصلاحيات
│   ├── hooks/
│   │   └── usePermission.js            # Hooks للصلاحيات
│   └── components/
│       └── ProtectedContent/
│           └── ProtectedContent.jsx    # مكون إظهار/إخفاء المحتوى
│
├── routes/
│   ├── RoleBasedRoute.jsx              # مكون حماية المسارات
│   └── PrivateRoute.jsx                # (محدّث) حماية المصادقة
│
└── features/
    └── auth/
        ├── authSlice.js                # (محدّث) Redux مع الصلاحيات
        ├── authAPI.js                  # (جديد) API وبيانات اختبارية
        ├── pages/
        │   └── Login.jsx               # (محدّث) مع الأدوار
        └── PERMISSIONS_GUIDE.js        # دليل شامل
```

---

## 🚀 طرق الاستخدام

### 1️⃣ حماية المسارات (Route-Level)

```jsx
import RoleBasedRoute from "../routes/RoleBasedRoute";
import AdminPanel from "../pages/AdminPanel";

<Routes>
  {/* حماية بدور واحد */}
  <Route
    path="/admin"
    element={
      <RoleBasedRoute requiredRole="admin">
        <AdminPanel />
      </RoleBasedRoute>
    }
  />

  {/* حماية بعدة أدوار */}
  <Route
    path="/manage"
    element={
      <RoleBasedRoute requiredRoles={["admin", "teacher"]}>
        <ManagePanel />
      </RoleBasedRoute>
    }
  />

  {/* حماية بصلاحية */}
  <Route
    path="/grades"
    element={
      <RoleBasedRoute requiredPermission="view_grades">
        <GradesPage />
      </RoleBasedRoute>
    }
  />
</Routes>;
```

### 2️⃣ إظهار/إخفاء المحتوى (Component-Level)

```jsx
import ProtectedContent from "../shared/components/ProtectedContent/ProtectedContent";

export default function Dashboard() {
  return (
    <div>
      {/* إظهار الزر فقط للمستخدمين المصرحين */}
      <ProtectedContent permission="manage_grades">
        <button>إدارة الدرجات</button>
      </ProtectedContent>

      {/* عدة صلاحيات مطلوبة (AND) */}
      <ProtectedContent permissions={["manage_users", "view_reports"]}>
        <AdminPanel />
      </ProtectedContent>

      {/* أي صلاحية واحدة (OR) */}
      <ProtectedContent anyPermission={["manage_grades", "manage_assignments"]}>
        <EditButton />
      </ProtectedContent>

      {/* مع محتوى بديل */}
      <ProtectedContent
        permission="admin_only"
        fallback={<p>ليس لديك الصلاحية</p>}
      >
        <AdminContent />
      </ProtectedContent>
    </div>
  );
}
```

### 3️⃣ فحص الصلاحيات المباشر (Hook-Based)

```jsx
import {
  usePermission,
  useAnyPermission,
  useAllPermissions,
  useIsAdmin,
  useIsTeacher,
  useIsStudent,
  useUserInfo,
} from "../shared/hooks/usePermission";

export default function UserMenu() {
  // فحص صلاحية واحدة
  const canManageGrades = usePermission("manage_grades");

  // فحص أي صلاحية من القائمة
  const canModify = useAnyPermission(["manage_grades", "manage_assignments"]);

  // فحص جميع الصلاحيات
  const isFullAdmin = useAllPermissions(["manage_users", "manage_settings"]);

  // فحص الدور
  const isAdmin = useIsAdmin();
  const isTeacher = useIsTeacher();
  const isStudent = useIsStudent();

  // معلومات المستخدم
  const user = useUserInfo();

  return (
    <menu>
      {canManageGrades && <MenuItem>إدارة الدرجات</MenuItem>}
      {isAdmin && <MenuItem>الإعدادات</MenuItem>}
      {isTeacher && <MenuItem>لوحة المعلم</MenuItem>}
      {isStudent && <MenuItem>دراستي</MenuItem>}
      <p>مرحباً {user?.name}</p>
    </menu>
  );
}
```

---

## 🔑 المكونات الرئيسية

### `RoleBasedRoute`

مكون لحماية المسارات بناءً على الأدوار والصلاحيات.

```jsx
<RoleBasedRoute
  requiredRole="admin" // دور واحد
  requiredRoles={["admin", "teacher"]} // عدة أدوار (OR)
  requiredPermission="manage_users" // صلاحية واحدة
  requiredPermissions={["a", "b"]} // عدة صلاحيات (AND)
  anyPermissions={["a", "b"]} // أي صلاحية (OR)
  fallback={<NotFound />} // محتوى بديل
>
  <YourComponent />
</RoleBasedRoute>
```

### `ProtectedContent`

مكون لإظهار/إخفاء المحتوى بناءً على الصلاحيات.

```jsx
<ProtectedContent
  permission="manage_grades" // صلاحية واحدة
  permissions={["a", "b"]} // عدة صلاحيات (AND)
  anyPermission={["a", "b"]} // أي صلاحية (OR)
  fallback={null} // محتوى بديل
>
  <YourContent />
</ProtectedContent>
```

### Hooks

#### `usePermission(permission)`

التحقق من صلاحية محددة.

```jsx
const canManageGrades = usePermission("manage_grades");
```

#### `useAnyPermission(permissions[])`

التحقق من أي صلاحية من القائمة.

```jsx
const canModify = useAnyPermission(["manage_grades", "manage_assignments"]);
```

#### `useAllPermissions(permissions[])`

التحقق من جميع الصلاحيات.

```jsx
const isFullAdmin = useAllPermissions(["manage_users", "manage_settings"]);
```

#### `useIsAdmin()`, `useIsTeacher()`, `useIsStudent()`

فحص سريع للدور.

```jsx
const isAdmin = useIsAdmin();
```

#### `useUserInfo()`

الحصول على بيانات المستخدم.

```jsx
const user = useUserInfo();
```

---

## 📝 إضافة أدوار وصلاحيات جديدة

### 1. أضف الدور والصلاحيات إلى `roles.js`:

```javascript
// في src/shared/constants/roles.js

export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  MANAGER: "manager", // دور جديد
};

export const PERMISSIONS = {
  // صلاحيات قديمة...
  MANAGE_REPORTS: "manage_reports", // صلاحية جديدة
};

export const ROLE_PERMISSIONS = {
  [ROLES.MANAGER]: [PERMISSIONS.VIEW_REPORTS, PERMISSIONS.MANAGE_REPORTS],
};
```

### 2. استخدمه في الكود:

```jsx
<RoleBasedRoute requiredRoles={["admin", "manager"]}>
  <ReportsPage />
</RoleBasedRoute>
```

---

## 🧪 الاختبار

### تجربة بيانات اختبارية

1. افتح صفحة تسجيل الدخول
2. استخدم أحد البيانات الاختبارية:
   - `admin@school.com`
   - `teacher@school.com`
   - `student@school.com`
3. أي كلمة مرور تعمل

### اختبر كل دور:

```javascript
// تسجيل الدخول بـ admin
// → شاهد جميع الصفحات

// تسجيل الدخول بـ teacher
// → شاهد صفحات المعلم فقط

// تسجيل الدخول بـ student
// → شاهد صفحات الطالب فقط
```

---

## 🔗 التكامل مع المصادقة الحقيقية

عند ربط API حقيقي:

```javascript
// في src/features/auth/authAPI.js

export async function loginWithEmail(email, password) {
  // بدلاً من المحاكاة، استدعِ API الحقيقي
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  // تأكد أن الرد يحتوي على:
  return {
    id: response.data.id,
    name: response.data.name,
    email: response.data.email,
    role: response.data.role, // يجب أن يكون موجود
    permissions: response.data.permissions, // أو احسبه من الدور
  };
}
```

---

## ✅ قائمة المراجعة

- [ ] تم فهم الأدوار الثلاثة
- [ ] تم اختبار كل دور بتسجيل الدخول
- [ ] تم استخدام `RoleBasedRoute` للمسارات الحساسة
- [ ] تم استخدام `ProtectedContent` للعناصر الاختيارية
- [ ] تم استخدام Hooks للفحوصات المباشرة
- [ ] تم ربط الصلاحيات بـ bussiness logic
- [ ] تم التحقق من الأمان على الخادم

---

## 🎓 مراجع إضافية

- [دليل الأدوار والصلاحيات](./PERMISSIONS_GUIDE.js)
- [مساعدات الصلاحيات](../shared/utils/permissionHelpers.js)
- [Hooks](../shared/hooks/usePermission.js)
- [مكون RoleBasedRoute](./routes/RoleBasedRoute.jsx)
- [مكون ProtectedContent](../shared/components/ProtectedContent/ProtectedContent.jsx)

---

## 🚀 الخطوات التالية

1. **تخصيص الأدوار:**
   - أضف أدوار محددة لتطبيقك
   - عدّل الصلاحيات حسب الحاجة

2. **ربط API:**
   - استبدل المحاكاة بـ API الحقيقي
   - تأكد من إرجاع `role` و `permissions`

3. **حماية المسارات:**
   - حدد المسارات التي تحتاج حماية
   - طبق `RoleBasedRoute`

4. **الواجهة الأمامية:**
   - استخدم `ProtectedContent` لإظهار/إخفاء العناصر
   - استخدم Hooks للفحوصات المباشرة

---

**🎉 نظام أدوار وصلاحيات متكامل وجاهز للاستخدام!**
