import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useTranslation } from "react-i18next";
import { getLanguageCode } from "../utils/i18nLabels";

export default function LanguageSwitcher({ size = "small" }) {
  const { i18n, t } = useTranslation();
  const language = getLanguageCode(i18n.resolvedLanguage || i18n.language);

  const handleChange = (_, nextLanguage) => {
    if (nextLanguage && nextLanguage !== language) {
      i18n.changeLanguage(nextLanguage);
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      size={size}
      value={language}
      onChange={handleChange}
      aria-label={t("app.language")}
      dir="ltr"
      sx={{
        "& .MuiToggleButton-root": {
          minWidth: 42,
          px: 1.25,
          py: 0.5,
          fontWeight: 700,
          textTransform: "none",
        },
      }}
    >
      <ToggleButton value="ar" aria-label={t("app.arabic")}>
        {t("app.arabicShort")}
      </ToggleButton>
      <ToggleButton value="en" aria-label={t("app.english")}>
        {t("app.englishShort")}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
