<!-- Quick Reference Guide for Smart School Refactoring -->

# 📚 Quick Reference Guide

## 🔍 Finding Things

### Need a utility function?

→ Check `src/utils/` - contains 7 specialized files

```javascript
import { functionName } from "utils";
```

### Need a constant?

→ Check `src/constants/app.js`

```javascript
import { ROLES, ROUTES, ERROR_MESSAGES } from "constants";
```

### Need a custom hook?

→ Check `src/hooks/index.js`

```javascript
import { useLocalStorage, useForm, useAsync } from "hooks";
```

### Need a shared component?

→ Check `src/components/`

```javascript
import { ErrorBoundary, LoadingSpinner } from "components";
```

### Need to make an API call?

→ Use `src/services/api/request.js`

```javascript
import { apiGet, apiPost } from "services";
const response = await apiGet("/api/users");
```

---

## 🛠️ Common Tasks

### Store data in localStorage

```javascript
import { setToStorage, getFromStorage } from "utils";

// Save
setToStorage("key", value);

// Load
const value = getFromStorage("key", defaultValue);
```

### Validate email or password

```javascript
import { isValidEmail, isValidPassword } from 'utils';

if (isValidEmail(email)) { ... }
if (isValidPassword(password)) { ... }
```

### Manage form state

```javascript
import { useForm } from "hooks";

const form = useForm({ name: "", email: "" }, (values) => handleSubmit(values));

return (
  <input name="name" value={form.values.name} onChange={form.handleChange} />
);
```

### Format a date

```javascript
import { formatDate, getRelativeTime } from "utils";

formatDate(new Date(), "ar", "long");
getRelativeTime(date, "ar"); // "قبل ساعتين"
```

### Show a notification

```javascript
import { toast } from "utils";

toast.success("Operation completed!");
toast.error("Something went wrong");
```

### Log for debugging

```javascript
import { logger } from "utils";

logger.info("User logged in", userData);
logger.error("API error:", error);
logger.time("API call", async () => {
  // operation
});
```

### Make API calls with retry

```javascript
import { apiGet, apiPost } from "services";

// GET with retry logic
const response = await apiGet("/api/users");

// POST with retry logic
const response = await apiPost("/api/users", {
  name: "John",
  email: "john@example.com",
});
```

### Handle errors gracefully

```javascript
import { ErrorBoundary } from "components";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>;
```

### Show loading state

```javascript
import { LoadingSpinner } from "components";

<LoadingSpinner open={isLoading} message="جاري التحميل..." />;
```

### Validate form with error messages

```javascript
import { isValidEmail } from "utils";

const validateForm = () => {
  const errors = {};
  if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }
  return errors;
};
```

---

## 📁 File Locations Quick Map

```
⚡ Most Used Files:
├── src/utils/
│   ├── storage.js     ← localStorage management
│   ├── validation.js  ← form validation
│   ├── helpers.js     ← string/object utilities
│   ├── date.js        ← date formatting
│   ├── toast.js       ← notifications
│   ├── logger.js      ← debugging
│   └── index.js       ← barrel export (USE THIS!)

📋 Constants & Config:
├── src/constants/
│   ├── app.js         ← all app constants
│   └── index.js       ← barrel export (USE THIS!)

🎣 React Hooks:
├── src/hooks/
│   └── index.js       ← all custom hooks (USE THIS!)

🎨 Shared Components:
├── src/components/
│   ├── ErrorBoundary.jsx
│   ├── LoadingSpinner.jsx
│   └── index.js       ← barrel export (USE THIS!)

🌐 API & Services:
├── src/services/
│   ├── api/
│   │   └── request.js ← HTTP client
│   └── index.js       ← barrel export (USE THIS!)

📄 Type Definitions:
└── src/types/
    └── index.js       ← JSDoc types (for IDE)
```

---

## 🚀 Usage Examples

### Example 1: Login Form Component

```javascript
import { useForm } from "hooks";
import { isValidEmail, isValidPassword } from "utils";
import { saveRememberedEmail } from "shared/utils/storageManager";
import { toast, logger } from "utils";

export default function LoginForm() {
  const form = useForm({ email: "", password: "" }, handleSubmit);

  function handleSubmit(values) {
    const errors = {};

    if (!isValidEmail(values.email)) {
      errors.email = "Invalid email";
    }
    if (!isValidPassword(values.password)) {
      errors.password = "Password too short";
    }

    if (Object.keys(errors).length > 0) {
      form.setErrors(errors);
      return;
    }

    // Save email if requested
    saveRememberedEmail(values.email);

    logger.info("Login attempt", { email: values.email });
    toast.success("Logged in successfully!");
  }

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
      />
      {form.errors.email && <span>{form.errors.email}</span>}

      <input
        name="password"
        value={form.values.password}
        onChange={form.handleChange}
      />
      {form.errors.password && <span>{form.errors.password}</span>}

      <button type="submit">Login</button>
    </form>
  );
}
```

### Example 2: API Call with Error Handling

```javascript
import { apiGet, apiPost } from "services";
import { useAsync } from "hooks";
import { LoadingSpinner } from "components";
import { logger, toast } from "utils";

export default function UsersList() {
  const {
    data: users,
    loading,
    error,
  } = useAsync(async () => {
    const response = await apiGet("/api/users");
    if (!response.success) {
      toast.error(response.error || "Failed to load users");
      logger.error("Failed to fetch users", response.error);
      throw new Error(response.error);
    }
    return response.data;
  }, []);

  if (loading) return <LoadingSpinner open={true} message="Loading users..." />;
  if (error) return <div>Error: {error.message}</div>;
  if (!users) return null;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Example 3: Data Display with Utilities

```javascript
import { formatDate, getRelativeTime, truncate } from "utils";

export default function UserCard({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{truncate(user.bio, 100)}</p>
      <small>Joined: {formatDate(user.createdAt, "ar", "long")}</small>
      <small>Last seen: {getRelativeTime(user.lastSeen, "ar")}</small>
    </div>
  );
}
```

---

## ✨ Best Practices

### ✅ DO:

- Use barrel exports: `import { func } from 'utils'`
- Use constants: `ROLES.ADMIN` instead of `'admin'`
- Use custom hooks: `useForm`, `useAsync`, `useLocalStorage`
- Add JSDoc comments
- Use meaningful variable names

### ❌ DON'T:

- Direct localStorage calls: `localStorage.getItem()`
- Magic strings: `'admin'`, `'user'`
- Repeated validation logic
- Long import paths: `../../../utils/validation.js`
- Create new utility without checking first

---

## 🆘 Troubleshooting

### "Cannot find module 'utils'"

→ Make sure you're importing from root: `import { func } from 'utils'`
→ Check that the function exists in one of the files in `src/utils/`

### "Validation is not working"

→ Verify you're using the correct function: `isValidEmail`, `isValidPassword`
→ Check that error state is being set properly

### "localStorage not persisting"

→ Use the storage manager: `setToStorage(key, value)`
→ Don't use localStorage directly

### "Component not found"

→ Check barrel export in `src/components/index.js`
→ Verify component is exported: `export { default as ComponentName }`

---

## 📞 Support

For detailed explanations:

- Read `ARCHITECTURE.md` for project structure
- Read `REFACTORING_REPORT.md` for all improvements
- Check JSDoc comments in utility files
- Look at component examples

---

## 📚 Documentation Files

1. **ARCHITECTURE.md** - Folder structure & design principles
2. **REFACTORING_REPORT.md** - Detailed improvement report
3. **This file** - Quick reference & examples
4. **JSDoc in code** - Function-level documentation

---

## ⚡ Performance Tips

1. Use `useLocalStorage` for persistent data
2. Use `useDebounce` for search/filter inputs
3. Use `useAsync` for API calls with cleanup
4. Use lazy loading for heavy components
5. Use `logger.time()` to measure performance

---

**Last Updated**: Current Session
**Status**: ✅ Complete & Ready to Use
