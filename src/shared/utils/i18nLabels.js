export const getLanguageCode = (language = "ar") =>
  language.startsWith("ar") ? "ar" : "en";

export const getDirection = (language = "ar") =>
  getLanguageCode(language) === "ar" ? "rtl" : "ltr";

export const getDateLocale = (language = "ar") =>
  getLanguageCode(language) === "ar" ? "ar-SA" : "en-US";

export const getUserTypeLabel = (t, userType) =>
  t(`userTypes.${userType}`, { defaultValue: userType });

export const getStatusLabel = (t, status) =>
  t(`statuses.${status}`, { defaultValue: status });
