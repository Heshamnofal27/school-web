import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function ThemeToggle({ size = "small" }) {
  const { mode, toggleMode } = useThemeMode();
  const { t } = useTranslation();

  return (
    <Tooltip title={mode === "dark" ? t("theme.light") : t("theme.dark")}>
      <IconButton onClick={toggleMode} size={size} color="inherit">
        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
