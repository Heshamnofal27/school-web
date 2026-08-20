import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import AppRouter from "./routes/AppRouter";
import { restoreAuthState, logout } from "./features/auth/authSlice";
import { loadAuthState } from "./shared/utils/storageManager";
import { getDirection, getLanguageCode } from "./shared/utils/i18nLabels";
import { registerUnauthorizedHandler } from "./services/api/axiosClient";

function App() {
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || "ar";

  useEffect(() => {
    // استعادة حالة المستخدم من localStorage عند بدء التطبيق
    const savedAuthState = loadAuthState();
    if (savedAuthState) {
      dispatch(restoreAuthState(savedAuthState));
    }
  }, [dispatch]);

  useEffect(() => {
    // عند انتهاء صلاحية التوكن (401) من أي نداء axios، نسجل خروج المستخدم تلقائياً
    registerUnauthorizedHandler(() => {
      dispatch(logout());
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const languageCode = getLanguageCode(language);
    const direction = getDirection(languageCode);

    document.documentElement.lang = languageCode;
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }, [language]);

  useEffect(() => {
    document.title = t("app.name");
  }, [t, i18n.resolvedLanguage]);

  return <AppRouter />;
}

export default App;
