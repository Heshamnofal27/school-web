import { Provider } from "react-redux";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { store } from "../store";
import { createAppTheme } from "../../config/theme";
import {
  ThemeModeProvider,
  useThemeMode,
} from "../../shared/context/ThemeContext";

function ThemedApp({ children }) {
  const { i18n } = useTranslation();
  const { mode } = useThemeMode();
  const language = i18n.resolvedLanguage || i18n.language || "ar";
  const direction = language.startsWith("ar") ? "rtl" : "ltr";
  const theme = useMemo(
    () => createAppTheme(direction, mode),
    [direction, mode],
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <ThemeModeProvider>
        <ThemedApp>{children}</ThemedApp>
      </ThemeModeProvider>
    </Provider>
  );
}
