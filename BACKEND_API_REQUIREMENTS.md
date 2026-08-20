# 📋 متطلبات APIs الخادم - نظام إدارة المدرسة

## 🎯 نظرة عامة

هذه الوثيقة تحتوي على جميع الـ APIs المطلوبة من الـ Backend لتطبيق نظام إدارة المدرسة.

**التطبيق يحتاج إلى 3 مجموعات رئيسية:**

1. **المجموعة أ (الأدمن)** - إدارة المدرسة
2. **المجموعة ب (المحاسبة)** - الفواتير والخزنة والمصاريف
3. **المجموعة ج (الإشراف)** - الغياب والسلوك والجداول

---

## 🔐 APIs المصادقة

### 1. تسجيل الدخول

```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "admin@school.com",
  "password": "password123"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "محمد السيسي",
    "email": "admin@school.com",
    "phone": "+966501234567",
    "role": "admin",
    "department": "الإدارة",
    "permissions": [
      "manage_school_settings",
      "manage_academic_year",
      "manage_classes",
      "manage_users",
      ...
    ],
    "status": "نشط",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "message": "تم تسجيل الدخول بنجاح"
}

Response (401 Unauthorized):
{
  "success": false,
  "error": "بيانات تسجيل الدخول غير صحيحة"
}
```

---

### 2. جلب بيانات المستخدم الحالي

```
GET /api/auth/me
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "محمد السيسي",
    "email": "admin@school.com",
    "phone": "+966501234567",
    "role": "admin",
    "department": "الإدارة",
    "permissions": [...],
    "status": "نشط"
  }
}

Response (401 Unauthorized):
{
  "success": false,
  "error": "التوكن غير صالح أو منتهي الصلاحية"
}
```

---

### 3. تحديث التوكن

```
POST /api/auth/refresh
Content-Type: application/json

Request Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

### 4. تسجيل الخروج

```
POST /api/auth/logout
Authorization: Bearer {token}
Content-Type: application/json

Request Body: {}

Response (200 OK):
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

## 👥 APIs إدارة المستخدمين

### 1. قائمة جميع المستخدمين

```
GET /api/users
Authorization: Bearer {token}
Query Parameters:
  - page: 1
  - limit: 10
  - role: "admin" | "accounting" | "supervision"
  - status: "نشط" | "غير نشط"

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "محمد السيسي",
      "email": "admin@school.com",
      "phone": "+966501234567",
      "role": "admin",
      "department": "الإدارة",
      "status": "نشط",
      "createdAt": "2024-01-15T10:30:00Z",
      "lastLogin": "2024-05-27T14:20:00Z"
    },
    ...
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 45,
    "itemsPerPage": 10
  }
}
```

---

### 2. إنشاء مستخدم جديد

```
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json
Required Permission: manage_users

Request Body:
{
  "name": "أحمد محمد",
  "email": "ahmed@school.com",
  "phone": "+966504567890",
  "role": "accounting",
  "department": "المحاسبة",
  "password": "SecurePassword123!",
  "status": "نشط"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 4,
    "name": "أحمد محمد",
    "email": "ahmed@school.com",
    "phone": "+966504567890",
    "role": "accounting",
    "department": "المحاسبة",
    "status": "نشط",
    "permissions": [...]
  },
  "message": "تم إنشاء المستخدم بنجاح"
}
```

---

### 3. تعديل بيانات المستخدم

```
PUT /api/users/{userId}
Authorization: Bearer {token}
Content-Type: application/json
Required Permission: manage_users

Request Body:
{
  "name": "أحمد محمد محسن",
  "phone": "+966504567890",
  "status": "نشط"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 4,
    "name": "أحمد محمد محسن",
    ...
  },
  "message": "تم تحديث بيانات المستخدم"
}
```

---

### 4. حذف مستخدم

```
DELETE /api/users/{userId}
Authorization: Bearer {token}
Required Permission: manage_users

Response (200 OK):
{
  "success": true,
  "message": "تم حذف المستخدم بنجاح"
}
```

---

## 📧 APIs البريد الإلكتروني المعتمد

### الوصف العام:

نظام التحكم في إنشاء الحسابات عبر البريد الإلكتروني من قبل الأدمن فقط.
المستخدمون (أساتذة، طلاب، موظفين) لا يستطيعون التسجيل إلا ببريد إلكتروني معتمد مسبقاً.

### 1. التحقق من صحة البريد الإلكتروني المعتمد

```
POST /api/auth/validate-email
Content-Type: application/json
No Authorization Required

Request Body:
{
  "email": "student.ali@school.com"
}

Response (200 OK) - Email Authorized:
{
  "success": true,
  "data": {
    "isValid": true,
    "authorized": true,
    "userType": "طالب",
    "name": "علي محمد",
    "status": "معلق",
    "classLevel": "الأول الابتدائي أ",
    "message": "البريد الإلكتروني معتمد. يمكنك المتابعة."
  }
}

Response (400 Bad Request) - Email Not Authorized:
{
  "success": false,
  "data": {
    "isValid": false,
    "authorized": false,
    "message": "غير مسموح بالتسجيل. يرجى مراجعة الإدارة لإضافة بريدك الإلكتروني أولاً.",
    "errorCode": "EMAIL_NOT_FOUND"
  }
}

Response (400 Bad Request) - Email Already Used:
{
  "success": false,
  "data": {
    "isValid": false,
    "authorized": false,
    "message": "هذا البريد الإلكتروني مستخدم مسبقاً ولا يمكن تسجيل حساب آخر به.",
    "errorCode": "EMAIL_ALREADY_USED"
  }
}
```

### 2. قائمة البريد الإلكتروني المعتمد (للأدمن فقط)

```
GET /api/admin/authorized-emails
Authorization: Bearer {token}
Required Permission: view_authorized_emails
Query Parameters:
  - page: 1
  - limit: 10
  - userType: "طالب" | "أستاذ" | "ولي أمر" | "موظف"
  - status: "معلق" | "مستخدم" | "غير نشط"
  - email: البحث عن بريد معين

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "dr.fatima@school.com",
      "userType": "أستاذ",
      "name": "د. فاطمة الأحمد",
      "status": "معلق",
      "subject": "اللغة العربية",
      "createdAt": "2024-01-15",
      "createdBy": 1,
      "expiresAt": "2025-12-31",
      "notes": "معلمة اللغة العربية"
    },
    ...
  ],
  "total": 45,
  "stats": {
    "total": 45,
    "pending": 30,
    "used": 14,
    "inactive": 1,
    "available": 31
  },
  "pagination": {...}
}
```

### 3. إضافة بريد إلكتروني معتمد جديد (للأدمن فقط)

```
POST /api/admin/authorized-emails
Authorization: Bearer {token}
Required Permission: add_authorized_email
Content-Type: application/json

Request Body:
{
  "email": "teacher.new@school.com",
  "userType": "أستاذ",
  "name": "أ. محمد سعيد",
  "subject": "العلوم",
  "expiresAt": "2025-12-31",
  "notes": "معلم العلوم الجديد"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 11,
    "email": "teacher.new@school.com",
    "userType": "أستاذ",
    "name": "أ. محمد سعيد",
    "status": "معلق",
    "subject": "العلوم",
    "createdAt": "2024-05-27",
    "createdBy": 1,
    "expiresAt": "2025-12-31",
    "notes": "معلم العلوم الجديد"
  },
  "message": "تم إضافة البريد الإلكتروني بنجاح"
}

Response (400 Bad Request) - Email Already Exists:
{
  "success": false,
  "message": "البريد الإلكتروني مستخدم مسبقاً ولا يمكن تكراره.",
  "errorCode": "EMAIL_DUPLICATE"
}
```

### 4. تعديل بريد إلكتروني معتمد (للأدمن فقط)

```
PUT /api/admin/authorized-emails/{emailId}
Authorization: Bearer {token}
Required Permission: edit_authorized_email
Content-Type: application/json

Request Body:
{
  "name": "أ. محمد سعيد محسن",
  "status": "غير نشط",
  "expiresAt": "2025-06-30",
  "notes": "تحديث البيانات"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 11,
    "email": "teacher.new@school.com",
    ...
  },
  "message": "تم تحديث البريد الإلكتروني بنجاح"
}
```

### 5. حذف بريد إلكتروني معتمد (للأدمن فقط)

```
DELETE /api/admin/authorized-emails/{emailId}
Authorization: Bearer {token}
Required Permission: delete_authorized_email

Response (200 OK):
{
  "success": true,
  "message": "تم حذف البريد الإلكتروني بنجاح"
}
```

### 6. تغيير حالة البريد الإلكتروني (للأدمن فقط)

```
PUT /api/admin/authorized-emails/{emailId}/status
Authorization: Bearer {token}
Required Permission: edit_authorized_email
Content-Type: application/json

Request Body:
{
  "status": "غير نشط"  // أو "معلق" أو "منتهي الصلاحية"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "dr.fatima@school.com",
    "status": "غير نشط",
    "statusUpdatedAt": "2024-05-27"
  },
  "message": "تم تحديث حالة البريد الإلكتروني"
}
```

### 7. الإحصائيات (للأدمن فقط)

```
GET /api/admin/authorized-emails/stats
Authorization: Bearer {token}
Required Permission: view_authorized_emails

Response (200 OK):
{
  "success": true,
  "data": {
    "overall": {
      "total": 45,
      "pending": 30,
      "used": 14,
      "inactive": 1,
      "available": 31
    },
    "byUserType": {
      "students": {
        "userType": "طالب",
        "total": 20,
        "pending": 16,
        "used": 4,
        "inactive": 0
      },
      "teachers": {
        "userType": "أستاذ",
        "total": 15,
        "pending": 10,
        "used": 5,
        "inactive": 0
      },
      "parents": {
        "userType": "ولي أمر",
        "total": 8,
        "pending": 3,
        "used": 5,
        "inactive": 0
      },
      "staff": {
        "userType": "موظف",
        "total": 2,
        "pending": 1,
        "used": 0,
        "inactive": 1
      }
    }
  }
}
```

### 8. استيراد قائمة بريد إلكتروني من ملف CSV (للأدمن فقط)

```
POST /api/admin/authorized-emails/bulk-import
Authorization: Bearer {token}
Required Permission: manage_authorized_emails
Content-Type: application/json

Request Body:
{
  "emails": [
    {
      "email": "bulk.student1@school.com",
      "userType": "طالب",
      "name": "الطالب الأول",
      "classLevel": "الأول الابتدائي أ",
      "expiresAt": "2024-06-30"
    },
    {
      "email": "bulk.student2@school.com",
      "userType": "طالب",
      "name": "الطالب الثاني",
      "classLevel": "الأول الابتدائي ب",
      "expiresAt": "2024-06-30"
    }
  ]
}

Response (200 OK):
{
  "success": true,
  "message": "تم استيراد 2 من أصل 2",
  "results": {
    "imported": 2,
    "failed": 0,
    "duplicates": 0,
    "errors": []
  }
}

Response (200 OK - With Errors):
{
  "success": true,
  "message": "تم استيراد 1 من أصل 3",
  "results": {
    "imported": 1,
    "failed": 1,
    "duplicates": 1,
    "errors": [
      {
        "email": "duplicate@school.com",
        "error": "مستخدم مسبقاً"
      },
      {
        "email": "invalid@school.com",
        "error": "بيانات ناقصة"
      }
    ]
  }
}
```

---

## �📊 APIs المجموعة أ (الأدمن)

### 1. إدارة إعدادات المدرسة

```
GET /api/admin/settings
Authorization: Bearer {token}
Required Permission: manage_school_settings

Response (200 OK):
{
  "success": true,
  "data": {
    "schoolName": "مدرسة النموذج الأهلية",
    "schoolCode": "SCH-001",
    "address": "الرياض - حي السليمانية",
    "phone": "+966112345678",
    "email": "info@school.com",
    "website": "www.school.com",
    "principalName": "د. محمد علي",
    "principalPhone": "+966501234567",
    "foundedYear": 2010,
    "schoolType": "أهلية",
    "educationLevels": ["ابتدائي", "متوسط", "ثانوي"]
  }
}

PUT /api/admin/settings
Authorization: Bearer {token}
Required Permission: manage_school_settings
Content-Type: application/json

Request Body:
{
  "schoolName": "مدرسة النموذج الأهلية - المقر الجديد",
  "address": "الرياض - حي القيروان",
  "phone": "+966112345679"
}

Response (200 OK):
{
  "success": true,
  "message": "تم تحديث الإعدادات"
}
```

---

### 2. إدارة السنة الدراسية

```
GET /api/admin/academic-year
Authorization: Bearer {token}
Required Permission: manage_academic_year

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "year": "1445-1446",
    "startDate": "2024-09-01",
    "endDate": "2025-06-30",
    "status": "نشطة",
    "semesters": [
      {
        "id": 1,
        "name": "الفصل الأول",
        "startDate": "2024-09-01",
        "endDate": "2024-12-31",
        "status": "نشط"
      },
      {
        "id": 2,
        "name": "الفصل الثاني",
        "startDate": "2025-01-01",
        "endDate": "2025-04-30",
        "status": "مجدول"
      }
    ]
  }
}

POST /api/admin/academic-year
Authorization: Bearer {token}
Required Permission: manage_academic_year

Request Body:
{
  "year": "1446-1447",
  "startDate": "2025-09-01",
  "endDate": "2026-06-30",
  "semesters": [
    {
      "name": "الفصل الأول",
      "startDate": "2025-09-01",
      "endDate": "2025-12-31"
    },
    {
      "name": "الفصل الثاني",
      "startDate": "2026-01-01",
      "endDate": "2026-04-30"
    }
  ]
}

Response (201 Created):
{
  "success": true,
  "data": {...}
}
```

---

### 3. إدارة الفصول الدراسية

```
GET /api/admin/classes
Authorization: Bearer {token}
Required Permission: manage_classes
Query Parameters:
  - academicYearId: 1
  - grade: "الأول" | "الثاني" | ...

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "الأول الابتدائي أ",
      "grade": "الأول",
      "level": "ابتدائي",
      "academicYearId": 1,
      "classroomNumber": "101",
      "capacity": 35,
      "studentsCount": 32,
      "supervisorId": 5,
      "supervisorName": "خالد الحربي"
    },
    ...
  ]
}

POST /api/admin/classes
Authorization: Bearer {token}
Required Permission: manage_classes

Request Body:
{
  "name": "الأول الابتدائي ب",
  "grade": "الأول",
  "level": "ابتدائي",
  "academicYearId": 1,
  "classroomNumber": "102",
  "capacity": 35,
  "supervisorId": 6
}

Response (201 Created):
{
  "success": true,
  "data": {...}
}
```

---

## 📊 APIs المجموعة ب (المحاسبة)

### 1. الفواتير

```
GET /api/accounting/invoices
Authorization: Bearer {token}
Required Permission: view_invoices
Query Parameters:
  - page: 1
  - limit: 10
  - status: "مرسلة" | "مدفوعة" | "معلقة"
  - studentId: 123

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "INV-001",
      "studentId": 123,
      "studentName": "أحمد علي",
      "invoiceDate": "2024-05-20",
      "dueDate": "2024-06-20",
      "amount": 5000.00,
      "paidAmount": 0.00,
      "remainingAmount": 5000.00,
      "items": [
        {
          "description": "الرسوم الدراسية الفصل الأول",
          "quantity": 1,
          "unitPrice": 5000,
          "total": 5000
        }
      ],
      "status": "معلقة",
      "notes": "تذكير بالدفع",
      "createdAt": "2024-05-20T10:30:00Z"
    },
    ...
  ],
  "pagination": {...}
}

POST /api/accounting/invoices
Authorization: Bearer {token}
Required Permission: create_invoices

Request Body:
{
  "studentId": 124,
  "invoiceDate": "2024-05-21",
  "dueDate": "2024-06-21",
  "items": [
    {
      "description": "الرسوم الدراسية الفصل الأول",
      "quantity": 1,
      "unitPrice": 5000
    }
  ],
  "notes": "فاتورة جديدة"
}

Response (201 Created):
{
  "success": true,
  "data": {...}
}

PUT /api/accounting/invoices/{invoiceId}
Authorization: Bearer {token}
Required Permission: edit_invoices

PUT /api/accounting/invoices/{invoiceId}/approve
Authorization: Bearer {token}
Required Permission: approve_invoices

DELETE /api/accounting/invoices/{invoiceId}
Authorization: Bearer {token}
Required Permission: delete_invoices
```

---

### 2. تسجيل المقبوضات (الخزنة)

```
POST /api/accounting/payments
Authorization: Bearer {token}
Required Permission: record_payments

Request Body:
{
  "invoiceId": "INV-001",
  "amount": 2500.00,
  "paymentDate": "2024-05-25",
  "paymentMethod": "تحويل بنكي",
  "transactionNo": "TXN-123456",
  "notes": "دفعة أولى"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 1,
    "invoiceId": "INV-001",
    "amount": 2500.00,
    "paymentDate": "2024-05-25",
    "paymentMethod": "تحويل بنكي",
    "status": "تم التسجيل",
    "createdAt": "2024-05-25T14:30:00Z"
  },
  "message": "تم تسجيل المقبوض"
}
```

---

### 3. المصاريف

```
GET /api/accounting/expenses
Authorization: Bearer {token}
Required Permission: view_expenses
Query Parameters:
  - page: 1
  - limit: 10
  - category: "صيانة" | "أثاث" | "إدارة" | ...
  - status: "معلقة" | "موافق عليها" | "مرفوضة"

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "description": "صيانة مكيفات القاعات",
      "category": "صيانة",
      "amount": 1500.00,
      "expenseDate": "2024-05-20",
      "vendor": "شركة الراحة للصيانة",
      "attachmentUrl": "...",
      "status": "موافق عليها",
      "approvedBy": "محمد السيسي",
      "createdAt": "2024-05-20T10:30:00Z"
    },
    ...
  ],
  "pagination": {...}
}

POST /api/accounting/expenses
Authorization: Bearer {token}
Required Permission: create_expenses

Request Body:
{
  "description": "شراء أثاث مكتبي",
  "category": "أثاث",
  "amount": 3000.00,
  "expenseDate": "2024-05-20",
  "vendor": "متجر الأثاث المتقدم",
  "attachmentUrl": "https://..."
}

Response (201 Created):
{
  "success": true,
  "data": {...}
}

PUT /api/accounting/expenses/{expenseId}/approve
Authorization: Bearer {token}
Required Permission: approve_expenses

PUT /api/accounting/expenses/{expenseId}/reject
Authorization: Bearer {token}
```

---

### 4. التقارير المالية

```
GET /api/accounting/financial-reports
Authorization: Bearer {token}
Required Permission: view_financial_reports
Query Parameters:
  - startDate: "2024-01-01"
  - endDate: "2024-05-31"
  - type: "شامل" | "إيرادات" | "مصاريف"

Response (200 OK):
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-05-31"
    },
    "summary": {
      "totalInvoices": 5000000.00,
      "totalPayments": 4200000.00,
      "totalExpenses": 1200000.00,
      "netProfit": 2800000.00
    },
    "byCategory": [
      {
        "category": "الرسوم الدراسية",
        "amount": 5000000.00,
        "percentage": 100
      }
    ],
    "expensesByCategory": [
      {
        "category": "الرواتب",
        "amount": 800000.00,
        "percentage": 66.67
      },
      {
        "category": "صيانة",
        "amount": 200000.00,
        "percentage": 16.67
      },
      {
        "category": "إداريات",
        "amount": 200000.00,
        "percentage": 16.67
      }
    ]
  }
}

GET /api/accounting/financial-reports/export
Authorization: Bearer {token}
Required Permission: export_financial_data
Query Parameters:
  - format: "pdf" | "excel"

Response: File Download
```

---

## 📊 APIs المجموعة ج (الإشراف)

### 1. الحضور والغياب

```
GET /api/supervision/attendance
Authorization: Bearer {token}
Required Permission: view_attendance
Query Parameters:
  - classId: 1
  - date: "2024-05-25"
  - studentId: 123

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 123,
      "studentName": "أحمد علي",
      "className": "الأول الابتدائي أ",
      "date": "2024-05-25",
      "status": "حاضر",
      "recordedBy": "خالد الحربي",
      "notes": ""
    },
    {
      "id": 2,
      "studentId": 124,
      "studentName": "فاطمة محمد",
      "className": "الأول الابتدائي أ",
      "date": "2024-05-25",
      "status": "غياب",
      "recordedBy": "خالد الحربي",
      "notes": "عذر طبي"
    },
    ...
  ]
}

POST /api/supervision/attendance
Authorization: Bearer {token}
Required Permission: record_attendance

Request Body:
{
  "classId": 1,
  "date": "2024-05-25",
  "records": [
    {
      "studentId": 123,
      "status": "حاضر",
      "notes": ""
    },
    {
      "studentId": 124,
      "status": "غياب",
      "notes": "عذر طبي"
    }
  ]
}

Response (201 Created):
{
  "success": true,
  "message": "تم تسجيل الحضور بنجاح"
}

PUT /api/supervision/attendance/{attendanceId}
Authorization: Bearer {token}
Required Permission: edit_attendance
```

---

### 2. السلوك والانضباط

```
GET /api/supervision/behavior
Authorization: Bearer {token}
Required Permission: view_behavior
Query Parameters:
  - studentId: 123
  - classId: 1
  - type: "إيجابي" | "سلبي"

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 123,
      "studentName": "أحمد علي",
      "date": "2024-05-20",
      "type": "إيجابي",
      "description": "مجهود أكاديمي متميز",
      "severity": "عادي",
      "recordedBy": "خالد الحربي",
      "notes": "نموذج في الدراسة"
    },
    {
      "id": 2,
      "studentId": 123,
      "studentName": "أحمد علي",
      "date": "2024-05-18",
      "type": "سلبي",
      "description": "عدم الالتزام بالزي المدرسي",
      "severity": "منخفضة",
      "recordedBy": "خالد الحربي",
      "notes": "تنبيه أول"
    }
  ]
}

POST /api/supervision/behavior
Authorization: Bearer {token}
Required Permission: record_behavior

Request Body:
{
  "studentId": 123,
  "date": "2024-05-20",
  "type": "إيجابي",
  "description": "مشاركة فعالة في الفصل",
  "severity": "عادي",
  "notes": "متابعة جيدة"
}

Response (201 Created):
{
  "success": true,
  "data": {...}
}

POST /api/supervision/behavior/{studentId}/warnings
Authorization: Bearer {token}
Required Permission: issue_warnings

Request Body:
{
  "warningType": "تنبيه أول",
  "reason": "تجاوز عدد الغيابات المسموح به",
  "date": "2024-05-25",
  "notes": "يجب تحسن السلوك"
}
```

---

### 3. الجداول الدراسية

```
GET /api/supervision/schedules
Authorization: Bearer {token}
Required Permission: view_schedules
Query Parameters:
  - classId: 1
  - semesterId: 1

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "classId": 1,
      "className": "الأول الابتدائي أ",
      "dayOfWeek": "السبت",
      "period": 1,
      "startTime": "08:00",
      "endTime": "08:45",
      "subject": "اللغة العربية",
      "teacherId": 10,
      "teacherName": "د. فاطمة الأحمد",
      "room": "101",
      "semesterId": 1
    },
    ...
  ]
}

POST /api/supervision/schedules
Authorization: Bearer {token}
Required Permission: create_schedules

Request Body:
{
  "classId": 1,
  "scheduleData": [
    {
      "dayOfWeek": "السبت",
      "period": 1,
      "startTime": "08:00",
      "endTime": "08:45",
      "subject": "اللغة العربية",
      "teacherId": 10,
      "room": "101"
    }
  ],
  "semesterId": 1
}

Response (201 Created):
{
  "success": true,
  "message": "تم إنشاء الجدول بنجاح"
}

PUT /api/supervision/schedules/publish
Authorization: Bearer {token}
Required Permission: publish_schedules

Request Body:
{
  "scheduleIds": [1, 2, 3]
}
```

---

### 4. تقارير الإشراف

```
GET /api/supervision/reports
Authorization: Bearer {token}
Required Permission: view_supervision_reports
Query Parameters:
  - classId: 1
  - startDate: "2024-01-01"
  - endDate: "2024-05-31"
  - type: "حضور" | "سلوك" | "شامل"

Response (200 OK):
{
  "success": true,
  "data": {
    "class": {
      "id": 1,
      "name": "الأول الابتدائي أ",
      "supervisor": "خالد الحربي"
    },
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-05-31"
    },
    "attendance": {
      "totalDays": 120,
      "averageAttendance": 95.2,
      "studentsWithAbove80": 32,
      "studentsBelow80": 0
    },
    "behavior": {
      "positiveRecords": 45,
      "negativeRecords": 12,
      "warnings": 2
    },
    "summary": "الفصل يتمتع بسلوك جيد وحضور ممتاز"
  }
}
```

---

## 🔐 معايير الأمان والتوثيق

### 1. المصادقة

**استخدام JWT (JSON Web Token):**

```javascript
// الترويسة
Authorization: Bearer {token}

// بنية التوكن
{
  "iss": "school-system",
  "sub": "user_id:1",
  "name": "محمد السيسي",
  "email": "admin@school.com",
  "role": "admin",
  "permissions": [...],
  "iat": 1716820800,
  "exp": 1716824400  // انتهاء الصلاحية: ساعة واحدة
}
```

### 2. التفويض

كل API يجب أن يتحقق من:

- وجود التوكن الصحيح
- صلاحية المستخدم المطلوبة
- حالة المستخدم (نشط/غير نشط)

### 3. معايير الاستجابة

**جميع الاستجابات يجب أن تتبع الصيغة:**

```json
{
  "success": true/false,
  "data": {...} أو null,
  "message": "رسالة توضيحية",
  "error": "رسالة الخطأ إن وجدت",
  "timestamp": "2024-05-27T14:30:00Z",
  "statusCode": 200
}
```

### 4. رموز الحالة

| Code | المعنى       | الاستخدام               |
| ---- | ------------ | ----------------------- |
| 200  | نجاح         | العملية نجحت            |
| 201  | تم الإنشاء   | تم إنشاء مورد جديد      |
| 400  | طلب خاطئ     | خطأ في البيانات المرسلة |
| 401  | غير مصرح     | المصادقة فشلت           |
| 403  | ممنوع        | المستخدم غير مفوض       |
| 404  | غير موجود    | المورد غير موجود        |
| 500  | خطأ خادم     | خطأ في الخادم           |

---

## 📦 نموذج قاعدة البيانات

### جدول Users

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'accounting', 'supervision') NOT NULL,
  department VARCHAR(100),
  status ENUM('نشط', 'غير نشط') DEFAULT 'نشط',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  INDEX(email),
  INDEX(role)
);
```

### جدول Invoices

```sql
CREATE TABLE invoices (
  id VARCHAR(50) PRIMARY KEY,
  student_id INT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  paid_amount DECIMAL(10, 2) DEFAULT 0,
  status ENUM('معلقة', 'مرسلة', 'مدفوعة', 'معلقة التحصيل') DEFAULT 'معلقة',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES students(id),
  INDEX(student_id),
  INDEX(status)
);
```

### جدول Attendance

```sql
CREATE TABLE attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  class_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('حاضر', 'غياب', 'تأخر') NOT NULL,
  notes VARCHAR(255),
  recorded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES students(id),
  FOREIGN KEY(class_id) REFERENCES classes(id),
  FOREIGN KEY(recorded_by) REFERENCES users(id),
  UNIQUE KEY(student_id, class_id, date)
);
```

---

## 📝 أمثلة استخدام عملية

### مثال 1: تسجيل الدخول والحصول على البيانات

```javascript
// 1. تسجيل الدخول
const loginResponse = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@school.com",
    password: "password123",
  }),
});

const { data } = await loginResponse.json();
const token = data.token;

// 2. جلب بيانات المستخدم
const userResponse = await fetch("/api/auth/me", {
  headers: { Authorization: `Bearer ${token}` },
});

const userData = await userResponse.json();
console.log(userData.data.permissions);
```

### مثال 2: إنشاء فاتورة جديدة

```javascript
const createInvoice = await fetch("/api/accounting/invoices", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    studentId: 123,
    invoiceDate: "2024-05-25",
    dueDate: "2024-06-25",
    items: [
      {
        description: "الرسوم الدراسية الفصل الأول",
        quantity: 1,
        unitPrice: 5000,
      },
    ],
  }),
});
```

### مثال 3: تسجيل الحضور

```javascript
const recordAttendance = await fetch("/api/supervision/attendance", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    classId: 1,
    date: "2024-05-25",
    records: [
      { studentId: 123, status: "حاضر" },
      { studentId: 124, status: "غياب", notes: "عذر طبي" },
    ],
  }),
});
```

---

## ✅ قائمة المراجعة لمطور الخادم الخلفي (Backend)

**أثناء تطوير APIs، تأكد من:**

- [ ] جميع Endpoints مع GET, POST, PUT, DELETE حسب الحاجة
- [ ] التحقق من الصلاحيات (Permissions) لكل Endpoint
- [ ] المصادقة بواسطة JWT Token
- [ ] التوثيق الكامل لكل Endpoint
- [ ] معالجة الأخطاء بشكل صحيح
- [ ] استخدام الأكواد الصحيحة (200, 201, 400, 401, etc.)
- [ ] التحقق من صحة البيانات المُدخلة
- [ ] تسجيل العمليات (Logging)
- [ ] حماية من SQL Injection
- [ ] حماية من XSS
- [ ] Rate Limiting للحماية من الهجمات
- [ ] CORS Configuration
- [ ] Pagination للبيانات الكبيرة
- [ ] Caching حيث يكون مناسباً
- [ ] اختبار جميع الحالات (Success, Error, Edge Cases)

---

## 📞 ملاحظات مهمة

1. **التوكن:** انتهاء الصلاحية بعد 1 ساعة، استخدام Refresh Token للتجديد
2. **الأداء:** تطبيق Pagination لتقليل حمل الخادم
3. **الأمان:** لا تخزن كلمات المرور بشكل واضح، استخدم Hashing
4. **التسجيل:** سجل جميع العمليات الحساسة (إنشاء/تعديل/حذف المستخدمين)
5. **النسخ الاحتياطية:** نسخ احتياطية دورية من البيانات
6. **المراقبة:** راقب أداء الـ APIs واستهلاك الموارد

---

**تم إعداد هذه الوثيقة بناءً على متطلبات نظام إدارة المدرسة**
