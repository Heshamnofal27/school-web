/**
 * 🧰 Response Normalization Helpers
 * ===================================
 * Laravel لا يُرجع دائماً نفس البنية (أحياناً {data:[...]}, أحياناً {classes:[...]},
 * أحياناً مصفوفة مباشرة). هذه الدوال تحاول استخراج القائمة/الكائن بغض النظر عن
 * اسم المفتاح المستخدم في التحكم (Controller) المحدد.
 */

/**
 * يحاول استخراج مصفوفة من استجابة الخادم بغض النظر عن اسم المفتاح
 * @param {*} raw - جسم الاستجابة (response.data من axios)
 * @param {string[]} preferredKeys - أسماء مفاتيح محتملة بالترتيب (مثل ['classes','data'])
 */
export const extractList = (raw, preferredKeys = []) => {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== "object") return [];

  for (const key of preferredKeys) {
    if (Array.isArray(raw[key])) return raw[key];
  }

  // ابحث في أي مفتاح آخر يحتوي على مصفوفة
  const arrayValue = Object.values(raw).find((v) => Array.isArray(v));
  return arrayValue || [];
};

/**
 * يحاول استخراج كائن واحد من استجابة الخادم بغض النظر عن اسم المفتاح
 */
export const extractObject = (raw, preferredKeys = []) => {
  if (!raw || typeof raw !== "object") return raw;

  for (const key of preferredKeys) {
    if (raw[key] && typeof raw[key] === "object" && !Array.isArray(raw[key])) {
      return raw[key];
    }
  }

  return raw;
};
