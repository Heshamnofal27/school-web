<!-- نظام إدارة المدرسة الذكي - التوثيق الكامل -->

# 🎓 نظام إدارة المدرسة الذكي

نظام إدارة تعلم (LMS) حديث واحترافي مبني على React مع لوحة تحكم لإدارة المدارس، تمت إعادة هيكلته بشكل شامل لتحقيق قابلية التوسع والموثوقية وسهولة الصيانة.

---

## 🎯 نظرة عامة على المشروع

**Smart School** هو نظام متكامل لإدارة المدارس مصمم لتبسيط العمليات الأكاديمية، وتحسين مشاركة الطلاب، وتوفير تحليلات شاملة للمسؤولين والمعلمين.

### الميزات الرئيسية

- 🔐 مصادقة آمنة مع التحكم في الوصول بناءً على الأدوار
- 📊 لوحة تحكم شاملة مع تحليلات في الوقت الفعلي
- 👨‍🏫 إدارة المعلمين وتتبع الأداء
- 👥 إدارة الطلاب ومراقبة التقدم
- 📚 إدارة المقررات الدراسية والمناهج
- 📅 جدولة الفصول وتتبع الحضور
- 🌐 دعم متعدد اللغات (عربي/إنجليزي) مع دعم RTL/LTR
- 🎨 واجهة عصرية داكنة باستخدام Material-UI
- 📱 تصميم متجاوب بالكامل

---

## 🛠️ رزمة التقنيات

| الطبقة                    | التقنية           | الإصدار       |
| ------------------------- | ----------------- | ------------- |
| **إطار الواجهة الأمامية** | React             | 19.2.4        |
| **إدارة الحالة**          | Redux Toolkit     | 2.11.2        |
| **مكونات واجهة المستخدم** | Material-UI (MUI) | 7.3.9         |
| **التنسيق**               | MUI Styles & CSS  | -             |
| **التوجيه**               | React Router      | 7.14.2        |
| **النماذج والتحقق**       | أدوات مخصصة       | -             |
| **اتصالات API**           | Fetch API         | -             |
| **تصور البيانات**         | Recharts          | 1.8.5         |
| **التدويل**               | i18next           | 25.10.9       |
| **أداة البناء**           | Vite              | 8.0.2         |
| **عميل HTTP**             | Axios             | 1.13.6 (جاهز) |
| **Node.js**               | أحدث إصدار LTS    | -             |

---

## 📁 هيكل المشروع

```
my-app/
├── public/
│   ├── fonts/           # الخطوط المخصصة
│   └── locales/         # ملفات الترجمة (ar/, en/)
├── src/
│   ├── api/             # طبقة تكامل API (مستقبلية)
│   ├── app/
│   │   ├── providers/   # غلاف مزودي التطبيق
│   │   └── store/       # مخزن Redux
│   ├── assets/          # الملفات الثابتة
│   ├── components/      # المكونات المشتركة
│   │   ├── ErrorBoundary.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── common/
│   ├── config/          # الإعدادات
│   │   └── theme.js     # سمة Material-UI
│   ├── constants/       # الثوابت العامة للتطبيق
│   │   ├── app.js       # جميع الثوابت
│   │   └── index.js     # التصدير البرميلي
│   ├── features/        # وحدات الميزات
│   │   ├── auth/        # المصادقة
│   │   │   ├── authSlice.js
│   │   │   ├── pages/
│   │   │   │   └── Login.jsx
│   │   │   └── routes.jsx
│   │   ├── dashboard/   # وحدة لوحة التحكم
│   │   │   ├── components/
│   │   │   │   ├── TimeSpendingChart.jsx
│   │   │   │   ├── ProgressChart.jsx
│   │   │   │   ├── AttendanceChart.jsx
│   │   │   │   ├── MentorsCard.jsx
│   │   │   │   ├── UpcomingCoursesCard.jsx
│   │   │   │   ├── ClassScheduleCard.jsx
│   │   │   │   ├── CourseCard.jsx
│   │   │   │   └── ChartSection.jsx
│   │   │   ├── pages/
│   │   │   │   └── Home.jsx
│   │   │   └── routes.jsx
│   │   └── counter/     # ميزة مثال
│   ├── hooks/           # هوكس React المخصصة
│   │   └── index.js
│   ├── i18n/            # التدويل
│   │   └── index.jsx
│   ├── layouts/         # مكونات التخطيط
│   │   └── AppLayout.jsx
│   ├── routes/          # إعدادات التوجيه
│   │   ├── AppRouter.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── context/
│   ├── services/        # الخدمات الخارجية
│   │   ├── api/
│   │   │   └── request.js
│   │   └── index.js
│   ├── shared/          # الأدوات المشتركة
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   └── utils/
│   ├── styles/          # الأنماط العامة
│   │   ├── app.css
│   │   └── global.css
│   ├── types/           # تعريفات الأنواع
│   │   └── index.js
│   ├── utils/           # دوال مساعدة
│   │   ├── storage.js
│   │   ├── validation.js
│   │   ├── helpers.js
│   │   ├── date.js
│   │   ├── toast.js
│   │   ├── logger.js
│   │   ├── test.js
│   │   └── index.js
│   ├── App.jsx          # المكون الرئيسي للتطبيق
│   └── main.jsx         # نقطة الدخول
├── ARCHITECTURE.md      # دليل البنية
├── REFACTORING_REPORT.md # تفاصيل إعادة الهيكلة
├── QUICK_REFERENCE.md   # دليل الاستخدام السريع
├── package.json         # التبعيات
├── vite.config.js       # إعدادات Vite
└── eslint.config.js     # إعدادات ESLint
```

---

## 🚀 بدء الاستخدام

### المتطلبات الأساسية

- Node.js (الإصدار 16 أو أحدث)
- مدير حزم npm أو yarn

### التثبيت

```bash
# استنساخ المستودع
git clone <repository-url>
cd my-app

# تثبيت التبعيات
npm install

# تثبيت حزم إضافية (إذا لزم الأمر)
npm install recharts
```

### تشغيل التطبيق

**وضع التطوير:**

```bash
npm run dev
# يفتح على http://localhost:5173
# مع HMR (الاستبدال السريع للوحدات)
```

**بناء للإنتاج:**

```bash
npm run build
```

**معاينة بناء الإنتاج:**

```bash
npm run preview
```

---

## 🔐 المصادقة

### تدفق تسجيل الدخول

1. يقوم المستخدم بإدخال البريد الإلكتروني وكلمة المرور
2. التحقق من صحة النموذج (تنسيق البريد الإلكتروني، طول كلمة المرور)
3. وظيفة "تذكرني" اختيارية
4. إجراء Redux يرسل نجاح تسجيل الدخول
5. يتم إعادة توجيه المستخدم إلى لوحة التحكم

### أدوار المستخدم والصلاحيات

- **مسؤول (Admin)**: وصول كامل لجميع الميزات
- **معلم (Teacher)**: الوصول إلى الفصول والطلاب والدرجات
- **طالب (Student)**: الوصول إلى لوحة التحكم الشخصية والمقررات
- **ولي أمر (Parent)**: الوصول إلى تقدم الطفل

### المسارات المحمية

المسارات محمية باستخدام مكون `PrivateRoute`. يتم إعادة توجيه المستخدمين غير الموثقين إلى صفحة تسجيل الدخول.

---

## 🎨 نظام السمة

### لوحة الألوان (السمة الداكنة)

- **أساسي (Primary)**: #b388ff (بنفسجي)
- **ثانوي (Secondary)**: #7c4dff (بنفسجي)
- **نجاح (Success)**: #00c853 (أخضر)
- **تحذير (Warning)**: #ff9100 (برتقالي)
- **خطأ (Error)**: #d32f2f (أحمر)
- **خلفية (Background)**: #0f0f1e (داكن جداً)
- **سطح (Surface)**: #1a1a2e (داكن)

### التخصيص

قم بتعديل `src/config/theme.js` لتغيير ألوان السمة والطباعة.

---

## 🌍 التدويل

### اللغات المدعومة

- **العربية** - تخطيط RTL
- **الإنجليزية** - تخطيط LTR

### ملفات الترجمة

توجد في `public/locales/{ar,en}/translation.json`

### استخدام الترجمات

```javascript
import { useTranslation } from "react-i18next";

export default function Component() {
  const { t } = useTranslation();
  return <h1>{t("auth.loginButton")}</h1>;
}
```

### إضافة ترجمات جديدة

1. أضف المفاتيح إلى `public/locales/ar/translation.json`
2. أضف الترجمة الإنجليزية المقابلة
3. استخدم `t('key')` في المكونات

---

## 📊 إدارة الحالة

### هيكل مخزن Redux

```
auth/
├── isAuthenticated: boolean
├── user: {
│   id, name, email, role, permissions, avatar
│ }
├── isLoading: boolean
└── error: string|null

dashboard/
├── stats: object
├── isLoading: boolean
└── error: string|null

counter/ (مثال)
└── value: number
```

### مواقع شرائح Redux

- `src/features/auth/authSlice.js`
- `src/features/dashboard/dashboardSlice.js`
- `src/features/counter/counterSlice.jsx`

---

## 🔌 تكامل API

### إجراء استدعاءات API

```javascript
import { apiGet, apiPost, apiPut, apiDelete } from "services";

// طلب GET
const response = await apiGet("/api/users");

// طلب POST
const response = await apiPost("/api/users", {
  name: "John Doe",
  email: "john@example.com",
});

// مع خيارات
const response = await apiGet("/api/users", {
  timeout: 15000,
  retries: 3,
});
```

### تنسيق الاستجابة

```javascript
{
  success: boolean,
  data: any,
  status: number,
  error?: string
}
```

### معالجة الأخطاء

- إعادة محاولة تلقائية مع تراجع أسي (الافتراضي: محاولتان)
- معالجة مهلة الطلب (الافتراضي: 10 ثوانٍ)
- تنسيق خطأ موحد

---

## 🧪 الأدوات المساعدة

### إدارة التخزين

```javascript
import { getFromStorage, setToStorage, removeFromStorage } from "utils";

setToStorage("key", value);
const value = getFromStorage("key", defaultValue);
removeFromStorage("key");
```

### التحقق من صحة النماذج

```javascript
import { isValidEmail, isValidPassword, isEmpty } from "utils";

if (isValidEmail(email) && isValidPassword(password)) {
  // نموذج صحيح
}
```

### دوال السلاسل النصية

```javascript
import { capitalize, truncate, camelCaseToTitleCase } from "utils";

capitalize("hello"); // 'Hello'
truncate("Long text", 10); // 'Long te...'
camelCaseToTitleCase("firstName"); // 'First Name'
```

### دوال التاريخ

```javascript
import { formatDate, getRelativeTime, isPastDate } from "utils";

formatDate(new Date(), "ar", "long");
getRelativeTime(date, "ar"); // 'قبل ساعتين'
isPastDate(date); // true/false
```

### الإشعارات

```javascript
import { toast, logger } from "utils";

toast.success("تمت العملية بنجاح!");
toast.error("حدث خطأ ما");
logger.info("إجراء المستخدم", userData);
logger.error("حدث خطأ", error);
```

---

## 🪝 الهوكس المخصصة

### useLocalStorage

حفظ الحالة في localStorage مع مزامنة تلقائية.

```javascript
const [user, setUser] = useLocalStorage("user", null);
```

### useForm

إدارة حالة النموذج مع دعم التحقق.

```javascript
const form = useForm({ email: "", password: "" }, handleSubmit);
```

### useAsync

معالجة العمليات غير المتزامنة مع حالات التحميل/الخطأ.

```javascript
const { data, loading, error } = useAsync(fetchData, []);
```

### useResponsive

تتبع حجم الشاشة للتخطيطات المتجاوبة.

```javascript
const { isMobile, isTablet, isDesktop } = useResponsive();
```

### useDebounce

تأخير استدعاءات الدوال لتحسين الأداء.

```javascript
const debouncedSearch = useDebounce(handleSearch, 500);
```

---

## 📈 المكونات

### ErrorBoundary

يلتقط أخطاء مكونات React ويعرض واجهة احتياطية.

```javascript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### LoadingSpinner

يعرض مؤشر التحميل مع رسالة اختيارية.

```javascript
<LoadingSpinner open={isLoading} message="جارٍ التحميل..." />
```

### مكونات الرسوم البيانية

- TimeSpendingChart - رسم بياني خطي يوضح الساعات المستغرقة
- ProgressChart - رسم بياني دائري يوضح التقدم
- AttendanceChart - رسم بياني شريطي يوضح الحضور
- ClassScheduleCard - عرض التقويم
- MentorsCard - قائمة المرشدين
- UpcomingCoursesCard - جدول المقررات
- CourseCard - بطاقة تقدم المقرر

---

## 🧠 المبادئ الأساسية المطبقة

### 1. مبدأ DRY (لا تكرر نفسك)

- أدوات مركزية تقلل من تكرار الكود
- هوكس مخصصة قابلة لإعادة الاستخدام
- مكونات مشتركة
- ثوابت عامة

### 2. تحسين الأداء

- منطق إعادة محاولة API مع تراجع أسي
- هوكس مخصصة تمنع عمليات إعادة التصيير غير الضرورية
- التحميل البطيء للمكونات الثقيلة
- تنظيف مناسب في useEffect/useAsync

### 3. قابلية التوسع

- هيكل مجلدات قائم على الميزات
- تصدير برميلي لاستيرادات نظيفة
- تعريفات أنواع لدعم بيئة التطوير
- جاهز للنمو دون إعادة هيكلة

### 4. الموثوقية والمتانة

- ErrorBoundary يلتقط أعطال المكونات
- التحقق من صحة النماذج مع رسائل خطأ واضحة
- Try-catch في جميع العمليات غير المتزامنة
- نظام إشعارات لتغذية راجعة للمستخدم

### 5. سهولة القراءة

- توثيق JSDoc شامل
- تسمية واضحة ووصفية
- تنظيم متسق للكود
- توثيق كامل للبنية

---

## 🧪 الاختبارات

### اختبارات الوحدة

جميع الدوال المساعدة جاهزة لاختبارات الوحدة:

```javascript
// أمثلة في src/utils/test.js
import { createMockUser, wait } from "utils";

const mockUser = createMockUser({ role: "teacher" });
```

### أدوات الاختبار

```javascript
createMockUser(); // كائن مستخدم وهمي
createMockAuthState(); // حالة مصادقة وهمية
wait(ms); // انتظار العمليات غير المتزامنة
mockAPICall(data, delay); // محاكاة استجابات API
```

---

## 🐛 التصحيح

### تفعيل سجل التصحيح

```javascript
import { logger } from "utils";

logger.debug("رسالة تصحيح", data);
logger.info("رسالة معلومات", data);
logger.warn("رسالة تحذير", data);
logger.error("رسالة خطأ", error);
```

### مراقبة الأداء

```javascript
await logger.time("اسم العملية", async () => {
  // العملية الخاصة بك
});
// الإخراج: ⏱️ اسم العملية استغرقت 245.32ms
```

---

## 📚 ملفات التوثيق

1. **ARCHITECTURE.md** - بنية المشروع الكاملة
2. **REFACTORING_REPORT.md** - تقرير التحسينات المفصل
3. **QUICK_REFERENCE.md** - دليل الاستخدام السريع والأمثلة
4. **README.md** - هذا الملف
5. **تعليقات JSDoc** - في كل دالة مساعدة

---

## 🚨 المشكلات الشائعة والحلول

### المنفذ قيد الاستخدام بالفعل

```bash
# الحل: npm run dev سيحاول المنفذ التالي تلقائياً
# أو قم بإنهاء العملية: lsof -ti:5173 | xargs kill
```

### localStorage لا يحفظ البيانات

استخدم أدوات التخزين المتوفرة بدلاً من استدعاءات localStorage المباشرة.

### التحقق من صحة النموذج لا يعمل

تأكد من استخدام دالة التحقق الصحيحة وحالة الخطأ.

### المكونات لا يتم تحميلها

تحقق من التصديرات البرميلية في ملفات index.js.

---

## 🔄 سير عمل التطوير

### إضافة ميزة جديدة

1. أنشئ مجلد الميزة في `src/features/`
2. أنشئ شريحة Redux لإدارة الحالة
3. أنشئ الصفحات والمكونات
4. حدد المسارات
5. حدث الثوابت إذا لزم الأمر

### إضافة أداة مساعدة جديدة

1. أنشئ الدالة في الملف المناسب داخل `src/utils/`
2. أضف تعليقات JSDoc
3. قم بالتصدير من `src/utils/index.js`
4. استخدم الاستيراد البرميلي في المكونات

### إضافة مكون مشترك جديد

1. أنشئ المكون في `src/components/`
2. أضف تعليقات JSDoc
3. قم بالتصدير من `src/components/index.js`
4. استخدم الاستيراد البرميلي في جميع أنحاء التطبيق

---

## 📦 التبعيات

### التبعيات الأساسية

- react@19.2.4
- redux@latest
- @reduxjs/toolkit@2.11.2
- @mui/material@7.3.9
- react-router@7.14.2
- i18next@25.10.9
- recharts@1.8.5

### تبعيات التطوير

- vite@8.0.2
- eslint@latest
- prettier@latest

---

## 🎓 مصادر التعلم

### React

- [توثيق React Hooks](https://react.dev/reference/react)
- [دليل الهوكس المخصصة](https://react.dev/learn/reusing-logic-with-custom-hooks)

### Redux

- [دليل Redux Toolkit](https://redux-toolkit.js.org/)
- [توثيق Slice](https://redux-toolkit.js.org/api/createSlice)

### Material-UI

- [مكتبة المكونات](https://mui.com/)
- [دليل التنسيق](https://mui.com/material-ui/guides/styling/)

### React Router

- [دليل التوجيه](https://reactrouter.com/)
- [المسارات المحمية](https://reactrouter.com/en/main/start/overview)

### i18n

- [توثيق i18next](https://www.i18next.com/)
- [روابط React](https://react.i18next.com/)

---

## 📝 الترخيص

هذا المشروع جزء من نظام إدارة المدرسة الذكي.

---

## 👥 المساهمة

عند المساهمة، يرجى اتباع:

1. اتفاقيات التسمية (PascalCase للمكونات، camelCase للدوال)
2. إضافة تعليقات JSDoc لجميع الدوال
3. استخدام الاستيرادات البرميلية من utils/constants/components
4. اختبار التغييرات قبل التقديم

---

## 📞 الدعم

للاستفسارات أو المشكلات:

1. راجع QUICK_REFERENCE.md للمهام الشائعة
2. راجع ARCHITECTURE.md لنظرة عامة على الهيكل
3. راجع تعليقات JSDoc في ملفات الأدوات المساعدة
4. راجع أمثلة المكونات

---

## 🎉 شكر وتقدير

بني باستخدام أفضل الممارسات الحديثة في:

- تنظيم الكود
- تحسين الأداء
- معالجة الأخطاء
- تجربة المطور
- سهولة الصيانة
- قابلية التوسع

**الحالة**: ✅ جاهز للإنتاج

---

**آخر تحديث**: الجلسة الحالية
**الإصدار**: 1.0.0
