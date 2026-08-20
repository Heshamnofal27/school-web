# ملاحظات الربط بين الواجهة الأمامية والباك-إند (GAPS.md)

هذا الملف يوثّق بشكل شفاف كل فجوة أو قرار هندسي اتُّخذ أثناء ربط الواجهة الأمامية
(React) بالباك-إند، حتى لا تُفاجَأ لاحقاً بسلوك غير متوقع.

## ⚙️ تحديث مهم (نسخة الباك-إند الثانية)
تم استلام نسخة محدّثة من الباك-إند وتحديث الواجهة الأمامية بناءً عليها. أهم تغييرين:

1. **تسجيل الدخول والخروج أصبحا موحّدين لكل الأدوار**: بدل 3 نقاط نهاية منفصلة
   (`/admin/login`, `/supervisors/login`, `/accountants/login`) أصبح هناك نقطة
   نهاية واحدة فقط: `POST /login` (و `POST /logout`)، والباك-إند يكتشف دور
   المستخدم تلقائياً ويُعيده ضمن حقل `role` في الاستجابة. تم تحديث
   `src/features/auth/authAPI.js` و `src/services/api/endpoints.js` (`AUTH_UNIFIED`,
   `AUTH_PROFILE`) بناءً على ذلك. الواجهة ترفض صراحةً أي دور غير
   admin/supervisor/accountant حتى لو كانت بيانات الدخول صحيحة (لأن الباك-إند
   الموحّد يسمح تقنياً بدخول طالب/معلم/ولي أمر أيضاً، وهذا خارج نطاق هذا التطبيق).
   نقاط نهاية "الملف الشخصي" (`/admin/profile`, `/supervisors/profile`,
   `/accountants/profile`) بقيت كما هي، مقسّمة حسب الدور.

2. **إعادة تسمية عمود ربط الشعبة بالصف الدراسي**: `class_rooms.grade_id` أصبح
   `class_rooms.grade_level_id` (كان الاسم القديم يسبب خطأ SQL فعلياً في الباك-إند
   القديم لأن العمود لم يكن موجوداً أصلاً). تم تحديث كل الأماكن التي تُنشئ/تُعدّل
   شعبة أو تقرأ `gradeId` منها في: `classesAPI.js`, `studentsAPI.js`,
   `supervisorsAPI.js`. ملاحظة: حقول `grade_id` / `from_grade_id` / `to_grade_id`
   المُستخدمة في تعيين/نقل/إلغاء تعيين المشرفين (`GradeSupervisorController`) لم
   تتغيّر — فهي تشير إلى `grade_levels.id` مباشرة وليست عمود الشعبة، فبقيت كما هي.

3. **إصلاح عطل ApexCharts** (`Cannot read properties of null (reading 'node')`):
   السبب الجذري كان *lazy loading مزدوج* — `Home.jsx` يُحمّل `ChartSection.jsx`
   بشكل كسول عبر `Suspense`، وكان `ChartSection.jsx` نفسه يُحمّل مكتبة
   `react-apexcharts` بشكل كسول مرة أخرى مع `Suspense` داخلي منفصل. هذا التداخل
   بين حدّي Suspense كان يجعل React يُبدّل الرسم البياني بين حالتي
   التحميل/الجاهزية بسرعة، فتُطلق ApexCharts رسمة أنيميشن (`animateDraw` عبر
   `requestAnimationFrame`) تشير إلى عنصر DOM أُزيل بالفعل. تم الإصلاح في
   `ChartSection.jsx` عبر:
   - استيراد `react-apexcharts` مباشرة (بلا `lazy`/`Suspense` داخلي إضافي) — يبقى
     التحميل الكسول مطبّقاً مرة واحدة فقط على مستوى `ChartSection` من `Home.jsx`.
   - تعطيل الأنيميشن الأولي (`animations.enabled: false`) على كل الرسوم البيانية
     الأربعة، لتفادي أي سباق مشابه مستقبلاً.
   - إضافة حارس `if (!stats) return <Skeleton .../>` في أعلى المكوّن.
   - نفس تعطيل الأنيميشن طُبّق وقائياً على رسم `FinancialDashboard.jsx` (صفحة
     المحاسب) رغم أنه لم يكن متداخلاً بنفس الطريقة (تحميل كسول من مستوى واحد فقط)،
     لأن الأنيميشن الافتراضي في ApexCharts معرّض لنفس نوع السباق عند إزالة/تركيب
     المكوّن بسرعة.

4. **توجيه الأدوار (Role-based routing) بعد الدخول**: كان موجوداً وصحيحاً مسبقاً
   (`RoleRedirect.jsx`, `RoleBasedRoute.jsx`, `PrivateRoute.jsx`) ولم يحتج تعديلاً —
   كل دور يُعاد توجيهه تلقائياً للوحة تحكمه الصحيحة بعد الدخول
   (`ROLE_INFO[role].dashboardPath`)، والمسارات غير المصرح بها تُعيد التوجيه لـ `/`.
   الإضافة الفعلية للحماية جاءت من رفض تسجيل الدخول نفسه لأي دور خارج
   admin/supervisor/accountant (نقطة 1 أعلاه) — وهي حماية أقوى من مجرد إخفاء
   المسارات، لأن الحساب لا يحصل على token صالح لهذا التطبيق من الأساس.

## نطاق العمل
تم الالتزام حرفياً بحصر التكامل والواجهات على 3 أدوار فقط: **Admin, Supervisor,
Accountant**. لم تُبنَ أو تُعدَّل أي واجهة خاصة بـ Student / Teacher / Parent
(Guardian) — علماً أن صفحة `CreateAccounts` القديمة (التي تدير الأنواع الخمسة معاً
بشكل تجريبي/mock) تُركت كما هي دون أي تعديل احترازاً، وأُضيفت بدلاً منها صفحة جديدة
مستقلة `StaffAccountsManager` (`/admin/staff-accounts`) خاصة فقط بالمشرفين والمحاسبين
ومربوطة فعلياً بالباك-إند.

## ما تم ربطه بالكامل بالباك-إند الحقيقي ✅
| الميزة | الصفحة | Endpoint(s) |
|---|---|---|
| تسجيل الدخول (موحّد لكل الأدوار، يكتشف الدور تلقائياً) | Login | `POST /login` |
| تسجيل الخروج (موحّد) | AppLayout | `POST /logout` |
| الملف الشخصي الحالي | (عند الحاجة) | `/{role}/profile` |
| إدارة الشعب (Classes) CRUD | ManageClasses | `GET/POST/PUT/DELETE /admin/classes` |
| قائمة الصفوف الدراسية | عدة صفحات | `GET /admin/Get/grades` |
| نقل طالب بين الشعب | TransferStudents | `POST /admin/students/transfer` |
| سجل نقل طالب واحد | TransferStudents | `GET /admin/students/{id}/transfers` |
| تعيين/نقل/إلغاء تعيين مشرف (على مستوى **الصف** كاملاً، راجع الملاحظة أدناه) | SupervisorAssignment | `POST /admin/supervisors/assign|move|unassign` |
| إدارة التخصصات (جديد) | SpecializationsManager | `GET/POST/PUT/DELETE /admin/specializations` |
| عرض الشكاوى (قراءة فقط، جديد) | ComplaintsView | `GET /admin/complaints` |
| إضافة حافلة + عرض طلابها (جديد) | BusesManager | `POST /admin/buses`, `GET /admin/bus/{id}/students` |
| إدارة حسابات المحاسبين (قائمة كاملة + حذف/تعديل/إضافة) (جديد) | StaffAccountsManager | `GET/POST/PUT/DELETE /admin/accountants*` |
| إضافة/حذف بريد مشرف (بدون قائمة، راجع الملاحظة) (جديد) | StaffAccountsManager | `POST /admin/supervisors/add-email`, `DELETE /admin/supervisors/delete-email` |
| تسجيل/إلغاء/عرض الحضور والغياب (جديد) | AttendanceManager | `POST/DELETE/GET /supervisors/attendance/*` |
| إنشاء/عرض الرحلات المدرسية + الطلاب المؤكدون (جديد) | SchoolTripsManager | `POST/GET /supervisors/trips`, `/supervisors/school-trips*` |
| قائمة الدفعات المستحقة + إنشاء دفعة + قوالب الدفع حسب الشعبة + التقارير + تحديث الغرامات (جديد) | DuePaymentsManager | `GET/POST /accountants/Getpayments|Addpayments|class-rooms/{id}/due-payment-templates|report/*|due-payments/update-penalties` |

## فجوات حقيقية في الباك-إند الحالي (لا يوجد Endpoint مطابق) ⚠️
تم إبقاء هذه الأجزاء على بيانات تجريبية (mock) بشكل موثّق وواضح في الكود
(علامة `_mock: true` في نتيجة كل دالة، وتعليقات في أعلى كل ملف):

1. **لا يوجد `GET /admin/students`** لعرض كل الطلاب، ولا `GET /admin/students?class_id=`
   لعرض طلاب شعبة معينة. الموجود فقط `POST` للإنشاء/التعديل و transfer/history لكل طالب
   بمفرده. → `studentsAPI.js: fetchAllStudents, fetchStudentsByClass, fetchTransferHistory`.
2. **لا يوجد `GET` لعرض قائمة كل المشرفين** ولا قائمة التعيينات الحالية
   (Grade↔Supervisor). الموجود فقط عمليات الكتابة (إضافة/تعديل/حذف/تعيين/نقل/إلغاء).
   → `supervisorsAPI.js: fetchSupervisors, fetchAssignments` و
   `staffAccountsAPI.js` (المشرفون المُضافون يُعرضون فقط خلال الجلسة الحالية).
3. **عدم تطابق النموذج**: نظام تعيين المشرفين في الباك-إند (`GradeSupervisorController`)
   يعمل على مستوى **الصف الدراسي كاملاً** (Grade)، بينما تصميم الواجهة (سحب وإفلات)
   مبني على تعيين مشرف لكل **شعبة** (Class) بمفردها. تم حل هذا عملياً بجعل عملية
   "تعيين مشرف على شعبة 7-أ" تُطبَّق فعلياً في الخادم على **كل** شعب الصف السابع.
   → موثّق بالتفصيل في تعليق أعلى `supervisorsAPI.js`.
4. **لا توجد endpoints لإدارة أولياء الأمور (Guardians)** من هذه الواجهة أصلاً (وهذا
   متعمّد حسب نطاق العمل المطلوب، وليس فجوة يجب سدّها).
5. **لا يوجد endpoint لإحصائيات لوحة تحكم المدير** (نمو الطلاب، توزيع المستخدمين...).
   → `dashboardAPI.js` بالكامل على mock.
6. **نظام "الفوترة لكل طالب" و"خطط الأقساط/الرسوم القابلة للتعديل"** في صفحات
   FinancialDashboard / TuitionSettings / StudentBillingPage / StudentFinancialDirectory
   غير موجود في الباك-إند، الذي يعمل بمنطق مختلف تماماً: "دفعات مستحقة على ولي الأمر"
   (Guardian) مبنية على قوالب دفع (Due Payment Templates) لكل شعبة. لذلك تم:
   - إبقاء الصفحات الأربع القديمة تعمل بالكامل بيانات تجريبية (mock) دون كسرها.
   - **إضافة صفحة جديدة منفصلة `DuePaymentsManager`** تعمل بالكامل على الـ endpoints
     الحقيقية بمنطق الباك-إند الصحيح (guardian-based)، بدلاً من محاولة تحوير الصفحات
     القديمة بشكل قد يُنتج بيانات مالية غير دقيقة.
7. **سلوك الطلاب، التقييمات، التواصل مع أولياء الأمور، العقوبات، اجتماعات أولياء
   الأمور** (ملف `supervisionAPI.js` بالكامل) — لا يقابلها أي endpoint في الباك-إند.
   بقيت بالكامل mock وموثّقة كذلك.

## توصيات لإغلاق الفجوات مستقبلاً (على مستوى الباك-إند)
- إضافة `GET /admin/students` (مع فلترة اختيارية `?class_room_id=`).
- إضافة `GET /admin/supervisors` و `GET /admin/supervisors/assignments`.
- إضافة `GET /admin/dashboard/stats`.
- توضيح/توسعة `GradeSupervisorController` ليدعم التعيين على مستوى الشعبة وليس الصف فقط،
  أو توثيق أن هذا هو السلوك المقصود.
- توحيد نموذج الفوترة (طالب أو ولي أمر) بين ما تتوقعه الواجهة القديمة وما يقدّمه الباك-إند.

## بنية الربط الجديدة في الكود
- `src/services/api/axiosClient.js` — نسخة Axios مركزية + interceptors (إرفاق Bearer
  token تلقائياً، تسجيل خروج تلقائي عند 401).
- `src/services/api/endpoints.js` — كل مسارات الـ API في مكان واحد.
- `src/services/api/responseHelpers.js` — دوال مساعدة لتطبيع أشكال استجابة Laravel
  المختلفة.
- كل نتيجة استدعاء API تُرجع دائماً الشكل: `{ success, data, message, statusCode?,
  errors?, _mock? }` — العلامة `_mock: true` تعني أن البيانات ما زالت تجريبية بسبب
  فجوة موثّقة أعلاه.
