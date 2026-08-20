<!-- يوثق هذا الملف بنية تطبيق Smart School -->

# 🏗️ Smart School - بنية المشروع

## 📁 نظرة عامة على هيكل المجلدات

```
src/
├── api/                    # 🌐 طبقة تكامل API (استخدام مستقبلي)
├── app/                    # 🎛️ مخزن Redux والمزودون
│   ├── providers/         # مزودو التطبيق لـ Redux و i18n والسمة
│   └── store/            # إعدادات مخزن Redux
├── assets/                # 📦 الملفات الثابتة (صور، SVGs)
├── components/            # 🎨 المكونات المشتركة/القابلة لإعادة الاستخدام
│   ├── ErrorBoundary.jsx  # غلاف معالجة الأخطاء
│   ├── LoadingSpinner.jsx # مؤشر التحميل
│   └── common/           # مكونات واجهة المستخدم الشائعة
├── config/               # ⚙️ ملفات الإعدادات
│   └── theme.js         # إعدادات سمة Material-UI
├── constants/            # 📋 الثوابت العامة للتطبيق
│   └── app.js           # المسارات، الأدوار، الصلاحيات، الرسائل
├── features/             # 🔧 وحدات الميزات (المصادقة، لوحة التحكم، إلخ)
│   ├── auth/            # وحدة المصادقة
│   │   ├── authSlice.js
│   │   ├── routes.jsx
│   │   └── pages/
│   ├── dashboard/       # وحدة لوحة التحكم
│   │   ├── components/  # مكونات خاصة بلوحة التحكم
│   │   ├── routes.jsx
│   │   └── pages/
│   └── counter/         # ميزة نموذجية
├── hooks/                # 🪝 هوكس React المخصصة
│   └── index.js         # useLocalStorage, useForm, useAsync, إلخ
├── i18n/                 # 🌍 التدويل (i18next)
├── layouts/              # 🎭 مكونات التخطيط الرئيسية
│   └── AppLayout.jsx    # التخطيط الرئيسي للتطبيق مع AppBar و Drawer
├── routes/               # 🛣️ إعدادات التوجيه
│   ├── AppRouter.jsx    # إعداد المسار الرئيسي
│   └── PrivateRoute.jsx # المسارات المحمية
├── services/             # 🌐 الخدمات الخارجية واستدعاءات API
│   └── api/
│       └── request.js   # عميل HTTP مع منطق إعادة المحاولة
├── shared/               # 🔄 الأدوات المشتركة والسياق
│   ├── components/      # مكونات واجهة مستخدم مشتركة
│   ├── context/        # سياق React (السمة، إلخ)
│   ├── data/           # البيانات الثابتة والإعدادات
│   └── utils/          # دوال مساعدة
├── styles/               # 🎨 الأنماط العامة
├── types/               # 📄 تعريفات الأنواع لدعم بيئة التطوير
├── utils/               # 🛠️ دوال مساعدة
│   ├── storage.js      # إدارة localStorage
│   ├── validation.js   # دوال التحقق من صحة النماذج
│   └── index.js       # التصديرات البرميلية
└── App.jsx & main.jsx   # نقاط دخول التطبيق
```

## 🎯 مبادئ التصميم الرئيسية

### 1️⃣ **مبدأ DRY (لا تكرر نفسك)**

- ✅ إدارة تخزين مركزية: `src/utils/storage.js`
- ✅ دوال تحقق مشتركة: `src/utils/validation.js`
- ✅ إدارة الثوابت: `src/constants/app.js`
- ✅ هوكس مخصصة للأنماط الشائعة: `src/hooks/index.js`

### 2️⃣ **تحسين الأداء**

- ✅ منطق إعادة محاولة طلبات API مع تراجع أسي
- ✅ هوكس مخصصة لتأخير الاستدعاءات وإدارة النماذج
- ✅ تحميل بطيء للمكونات الكبيرة (جاهز للتطبيق)
- ✅ تخزين مؤقت لسمة Material-UI

### 3️⃣ **قابلية التوسع**

- ✅ هيكل مجلدات قائم على الميزات لسهولة التوسع
- ✅ تصدير برميلي لاستيرادات نظيفة
- ✅ ثوابت مركزية تمنع السلاسل النصية العشوائية
- ✅ تجريد طبقة الخدمة لاستدعاءات API

### 4️⃣ **الموثوقية والمتانة**

- ✅ مكون ErrorBoundary لمعالجة الأخطاء
- ✅ Try-catch في عمليات التخزين
- ✅ التحقق من صحة النماذج مع رسائل خطأ واضحة
- ✅ احتياطيات أنيقة للبيانات المفقودة

### 5️⃣ **سهولة القراءة**

- ✅ تعليقات JSDoc على جميع الدوال المساعدة
- ✅ أسماء متغيرات ذات معنى (بدون أحرف مفردة)
- ✅ نمط تنظيم ملفات متسق
- ✅ تعريفات أنواع للإكمال التلقائي في بيئة التطوير

## 📝 أمثلة الاستيراد

### قبل (استيرادات مبعثرة)

```javascript
import { loadAuthState } from "../../../shared/utils/storageManager";
import { isValidEmail } from "../../../shared/utils/validators";
import { ROLE_PERMISSIONS } from "../../../shared/constants/roles";
```

### بعد (تصديرات برميلية مركزية)

```javascript
import { loadAuthState, isValidEmail } from "@/utils";
import { ROLE_PERMISSIONS, ROUTES } from "@/constants";
import { useLocalStorage, useForm } from "@/hooks";
import { ErrorBoundary, LoadingSpinner } from "@/components";
```

## 🔄 تدفق البيانات

```
إدخال المستخدم
    ↓
المكون (useForm hook)
    ↓
التحقق (utils/validation.js)
    ↓
إجراء Redux / استدعاء API (services/api/request.js)
    ↓
localStorage (utils/storage.js)
    ↓
تحديث المكون (عبر محدد Redux)
    ↓
تصيير واجهة المستخدم
```

## 🚀 توسيع التطبيق

### إضافة ميزة جديدة

```
features/new-feature/
├── slice.js           # إدارة حالة Redux
├── routes.jsx         # مسارات الميزة
├── pages/
│   ├── ListPage.jsx
│   └── DetailsPage.jsx
├── components/
│   ├── ItemCard.jsx
│   └── ItemForm.jsx
└── services/          # استدعاءات API خاصة بالميزة
    └── itemService.js
```

### إضافة مكون مشترك جديد

1. أنشئ المكون في `src/components/`
2. أضف التصدير في `src/components/index.js`
3. استورد باستخدام: `import { ComponentName } from 'components'`

### إضافة أداة مساعدة جديدة

1. أنشئ الدالة في `src/utils/` أو المجلد المناسب
2. أضف تعليقات JSDoc
3. قم بالتصدير من `src/utils/index.js`
4. استورد باستخدام: `import { functionName } from 'utils'`

## 🧪 إرشادات الاختبار

- اختبار دوال التحقق: `src/utils/validation.js`
- اختبار طبقة API: `src/services/api/request.js`
- اختبار الهوكس المخصصة: `src/hooks/index.js`
- اختبار عمليات التخزين: `src/utils/storage.js`

## 📖 مفاتيح الترجمة

جميع مفاتيح الترجمة تتبع هذا النمط:

- `auth.login` → وحدة المصادقة، ميزة تسجيل الدخول
- `validation.invalidEmail` → أخطاء التحقق
- `app.name` → سلاسل نصية عامة للتطبيق

راجع `public/locales/ar/translation.json` للمفاتيح المتاحة.

## 🔐 ملاحظات أمنية

- ✅ localStorage يُستخدم فقط للبيانات غير الحساسة
- ✅ كلمات المرور لا تُخزن محلياً أبداً
- ✅ متغيرات البيئة للإعدادات الحساسة (TODO)
- ✅ التحقق من الإدخال على جميع مدخلات المستخدم
- ✅ حماية XSS عبر التهريب المدمج في React

## 📊 إدارة الحالة

- **Redux**: مصادقة المستخدم، حالة التطبيق العامة
- **localStorage**: تفضيلات المستخدم، تذكرني
- **حالة المكون**: مدخلات النماذج، حالة واجهة المستخدم
- **السياق (Context)**: تبديل السمة (مستقبلاً: سيستخدم Redux)

## 🎨 نظام السمة

مركز في `src/config/theme.js`:

- أساسي: #b388ff (بنفسجي)
- ثانوي: #7c4dff (بنفسجي)
- خلفية: #0f0f1e (داكن جداً)
- سطح: #1a1a2e (داكن)

استخدم ثابت `THEME_COLORS` من `src/constants/app.js` للحفاظ على الاتساق.
