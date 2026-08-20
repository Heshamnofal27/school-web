# School Management System - توثيق المشروع

## 📁 هيكل المشروع

```
my-app/
├── public/
│   └── locales/
│       ├── ar/translation.json      # ترجمة عربية i18n
│       └── en/translation.json      # ترجمة إنجليزية i18n
│
├── src/
│   ├── app/
│   │   ├── providers/
│   │   │   └── AppProviders.jsx      # مزودي السمة + السياق
│   │   └── store/
│   │       └── index.jsx             # متجر Redux (سجل الشرائح هنا)
│   │
│   ├── config/
│   │   └── theme.js                  # سمة MUI (لوحات فاتحة/داكنة، تجاوزات المكونات)
│   │
│   ├── data/mock/
│   │   ├── studentsData.js           # بيانات وهمية للطلاب + منطق النقل
│   │   ├── supervisorsData.js        # المشرفون، الفصول، الصفوف، المهام
│   │   └── authorizedEmails.js       # رسائل البريد الإلكتروني المعتمدة للتسجيل
│   │
│   ├── features/
│   │   ├── admin/                    # صفحة إنشاء الحسابات
│   │   │   ├── pages/CreateAccounts.jsx
│   │   │   ├── createAccountsSlice.js
│   │   │   └── routes.jsx
│   │   │
│   │   ├── auth/                     # تسجيل الدخول، التسجيل، نسيت كلمة المرور
│   │   │   ├── pages/ (Login, Register, ForgotPassword)
│   │   │   ├── authSlice.js
│   │   │   ├── authAPI.js
│   │   │   └── routes.jsx
│   │   │
│   │   ├── classes/                  # إدارة الفصول (CRUD)
│   │   │   ├── pages/ManageClasses.jsx
│   │   │   ├── classesSlice.js
│   │   │   ├── classesAPI.js
│   │   │   └── routes.jsx
│   │   │
│   │   ├── dashboard/                # لوحة التحكم مع ApexCharts
│   │   │   ├── pages/Home.jsx
│   │   │   ├── components/ChartSection.jsx
│   │   │   ├── dashboardAPI.js
│   │   │   └── routes.jsx
│   │   │
│   │   ├── settings/                 # صفحة الإعدادات
│   │   │   ├── pages/SettingsPage.jsx
│   │   │   └── routes.jsx
│   │   │
│   │   ├── students/                 # نقل الطلاب
│   │   │   ├── pages/TransferStudents.jsx
│   │   │   ├── studentsSlice.js
│   │   │   ├── studentsAPI.js
│   │   │   └── routes.jsx
│   │   │
│   │   └── supervisors/              # تعيين المشرفين (سحب وإفلات)
│   │       ├── pages/SupervisorAssignment.jsx
│   │       ├── components/ (DraggableSupervisor, ClassDropZone)
│   │       ├── supervisorsSlice.js
│   │       ├── supervisorsAPI.js
│   │       └── routes.jsx
│   │
│   ├── layouts/
│   │   └── AppLayout.jsx             # شريط التطبيق + الشريط الجانبي + المحتوى الرئيسي
│   │
│   ├── routes/
│   │   ├── AppRouter.jsx             # الموجه الرئيسي
│   │   ├── PrivateRoute.jsx          # حارس المصادقة
│   │   └── RoleBasedRoute.jsx        # حارس الصلاحيات (غير موصل بعد)
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── constants/roles.js        # ROLES, PERMISSIONS, ROLE_PERMISSIONS, MOCK_USERS
│   │   ├── context/ThemeContext.jsx   # سياق الوضع الداكن (حفظ في localStorage)
│   │   └── utils/
│   │       ├── i18nLabels.js         # getUserTypeLabel, getStatusLabel, getDirection
│   │       └── storageManager.js     # مساعدات localStorage
│   │
│   ├── styles/
│   │   └── global.css                # إصلاحات RTL، إخفاء شريط التمرير، استيراد الخطوط
│   │
│   ├── i18n/
│   │   └── index.jsx                 # إعدادات i18next
│   │
│   ├── App.jsx                       # الجذر: ThemeModeProvider → ThemedApp
│   └── main.jsx                      # نقطة الدخول
```

---

## 🔄 نمط Redux

كل ميزة تتبع هذا النمط:

### 1. طبقة API (`*API.js`)
```js
// دوال وهمية غير متزامنة مع تأخير
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchData() {
  await delay(300);
  return { success: true, data: [...ITEMS] };
}

export async function createItem(payload) {
  await delay(300);
  // تغيير النسخة المحلية
  return { success: true, data: newItem };
}
```

### 2. الشريحة (`*Slice.js`)
```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./someAPI";

export const fetchThunk = createAsyncThunk("slice/fetch", async (_, { rejectWithValue }) => {
  const res = await api.fetchData();
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

const initialState = { items: [], loading: false, error: null, success: null };

const slice = createSlice({
  name: "slice",
  initialState,
  reducers: { clearError: (s) => { s.error = null; }, clearSuccess: (s) => { s.success = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThunk.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchThunk.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
```

### 3. التسجيل في المتجر (`src/app/store/index.jsx`)
```js
import sliceReducer from "../../features/slice/slice";
export const store = configureStore({
  reducer: { slice: sliceReducer, ... },
});
```

---

## 🎨 نظام سمة MUI

### إنشاء السمة (`src/config/theme.js`)
```js
export const createAppTheme = (direction = "rtl", mode = "light") => {
  const colors = mode === "dark" ? darkColors : lightColors;
  return createTheme({
    direction,
    palette: {
      mode,
      primary: { main: colors.primary },   // #2855AE فاتح / #6B8FD4 داكن
      secondary: { main: colors.secondary }, // #7292CF / #8BAAD9
      background: {
        default: colors.background.default,  // #F5F7FA / #0D0D1A
        paper: colors.background.paper,      // #E8ECF4 / #1E1E2E
      },
      text: { primary: colors.text.primary }, // #313131 / #E8E8F0
    },
    components: { /* تجاوزات MuiAppBar, MuiButton, MuiCard, MuiPaper */ },
  });
};
```

### التزجيج (مستخدم في كل مكان)
```js
const glassCard = (th) => ({
  bgcolor: alpha(th.palette.background.paper, 0.3),
  backdropFilter: "blur(24px)",
  border: `2px solid ${alpha(th.palette.primary.main, 0.5)}`,
  borderRadius: 3,
});
```

أنماط الاستخدام:
- **مباشر**: `<Card sx={glassCard}>`
- **استدعاء**: `<Card sx={(th) => ({ ...glassCard(th), p: 3 })}>`
- **مشترك**: `const sharedPaper = { backgroundColor: alpha(theme.palette.background.paper, 0.3), backdropFilter: "blur(24px)" }`

---

## 🌐 i18n (react-i18next)

### الهيكل
```json
{
  "nav": { "dashboard": "لوحة التحكم", "classes": "إدارة الشعب" },
  "common": { "email": "البريد الإلكتروني", "name": "الاسم" },
  "students": { "transferTitle": "نقل الطلاب", "sourceClass": "الصف المصدر" }
}
```

### الاستخدام
```js
const { t } = useTranslation();
t("nav.dashboard");         // "لوحة التحكم"
t("common.name");           // "الاسم"
t("students.transferTitle"); // "نقل الطلاب"
```

### معالجة RTL
- `document.documentElement.dir` يُضبط عبر `useEffect` في `App.jsx`
- `theme.direction` يُمرر إلى `createAppTheme(direction, mode)`
- CSS في `global.css` لإصلاحات RTL لـ InputLabel/NotchedOutline
- دالة `getDirection(lang)` ترجع `"rtl"` للعربية، `"ltr"` للإنجليزية

---

## 🧩 الأدوار والصلاحيات

### معرفة في `src/shared/constants/roles.js`
```js
export const ROLES = { ADMIN: "admin", ACCOUNTING: "accounting", SUPERVISION: "supervision" };

export const PERMISSIONS = {
  MANAGE_CLASSES: "manage_classes",
  MANAGE_SUPERVISORS: "manage_supervisors",
  MANAGE_STUDENTS: "manage_students",
  // ... جميع الصلاحيات
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [ PERMISSIONS.MANAGE_CLASSES, PERMISSIONS.MANAGE_STUDENTS, ... ],
  [ROLES.ACCOUNTING]: [ PERMISSIONS.VIEW_INVOICES, ... ],
  [ROLES.SUPERVISION]: [ PERMISSIONS.VIEW_ATTENDANCE, PERMISSIONS.RECORD_ATTENDANCE, ... ],
};
```

### المستخدمون الوهميون
```js
export const MOCK_USERS = {
  admin: { name: "محمد السيسي", email: "admin@school.com", role: ROLES.ADMIN, permissions: ROLE_PERMISSIONS[ROLES.ADMIN] },
  supervision: { name: "خالد الحربي", email: "supervision@school.com", role: ROLES.SUPERVISION, ... },
};
```

### التنقل الجانبي (مقيد بالصلاحيات)
```jsx
// في AppLayout.jsx
if (permissions.includes("manage_students")) {
  items.push({ label: t("nav.transferStudents"), path: "/transfer-students", icon: SwapHorizIcon });
}
```

---

## 🚦 التوجيه

### `src/routes/AppRouter.jsx`
```jsx
<BrowserRouter>
  <Routes>
    {authRoutes.map(r => <Route path={r.path} element={r.element} />)}
    <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
      {dashboardRoutes.map(...)}        // index: الرئيسية
      {adminRoutes.map(...)}            // "create-accounts"
      {supervisorRoutes.map(...)}       // "assign-supervisors"
      {classesRoutes.map(...)}          // "manage-classes"
      {studentsRoutes.map(...)}         // "transfer-students"
      {settingsRoutes.map(...)}         // "settings"
    </Route>
  </Routes>
</BrowserRouter>
```

### نمط تصدير مسارات الميزات
```js
// تصدير مسمى للميزات ذات مسارات متعددة
export const featureRoutes = [{ path: "some-path", element: <Page />, permission: "some_permission" }];

// تصدير افتراضي للميزات ذات مسار واحد
const routes = [{ path: "some-path", element: <Page /> }];
export default routes;
```

---

## 📦 ملخص تدفق البيانات

```
إجراء المستخدم → dispatch(thunk) → API (تأخير وهمي) → مختزل الشريحة (تحديث الحالة) → إعادة عرض المكون (useSelector)
```

- **حالة التحميل**: يتم عرض `<CircularProgress />` عندما يكون `loading === true`
- **حالة الخطأ**: يتم عرض `<Alert>` أو `<Snackbar>` من `error` في الحالة
- **حالة النجاح**: يتم عرض `<Snackbar>` أو `<Alert>` من `success`، ويتم مسحها عبر `clearSuccess()`

---

## 🎯 نظام التصميم

| العنصر | النمط |
|---------|-------|
| primary | `#2855AE` (فاتح) / `#6B8FD4` (داكن) |
| secondary | `#7292CF` (فاتح) / `#8BAAD9` (داكن) |
| text | `#313131` (فاتح) / `#E8E8F0` (داكن) |
| خلفية الصفحة | `#F5F7FA` (فاتح) / `#0D0D1A` (داكن) |
| خلفية الورق | `#E8ECF4` (فاتح) / `#1E1E2E` (داكن) |
| شفافية التزجيج | `alpha(paper, 0.3)` |
| ضبابية التزجيج | `blur(24px)` |
| حدود التزجيج | `2px solid alpha(primary, 0.5)` |
| الخط | Alexandria (900 عريض فقط) |
| الاتجاه | RTL (عربي) / LTR (إنجليزي) |

---

## 📐 قائمة مراجعة إنشاء ميزة جديدة

1. **البيانات**: أضف بيانات وهمية في `src/data/mock/` (إذا لزم الأمر)
2. **API**: أنشئ `src/features/{name}/{name}API.js`
3. **الشريحة**: أنشئ `{name}Slice.js` (thunks + مختزل)
4. **الصفحة**: أنشئ `pages/{name}.jsx`
5. **المسارات**: أنشئ `routes.jsx`
6. **التسجيل**: أضف الشريحة إلى `store/index.jsx`
7. **التسجيل**: أضف المسارات إلى `AppRouter.jsx`
8. **التنقل**: أضف عنصراً في `AppLayout.jsx` (مع التحقق من الصلاحية)
9. **الصلاحية**: أضف ثابتاً إلى `roles.js` إذا كانت جديدة
10. **i18n**: أضف مفاتيح إلى كلا ملفي `translation.json`
11. **البناء**: `npm run build` للتحقق
