/**
 * i18n.js
 * -----------
 * Small, framework-free language module for the app's UI strings
 * (buttons, screen titles, messages — everything that ISN'T question/
 * recommendation content, which lives directly in questions.js and
 * recommendations.js as {fr, en, sw, zh} objects).
 *
 * HOW IT WORKS:
 * - getLanguage() reads the saved choice (localStorage), defaulting to
 *   French if nothing was chosen yet.
 * - setLanguage(lang) saves the choice and updates <html lang="...">
 *   for accessibility/screen readers.
 * - t(key, params) returns the UI string for the current language,
 *   falling back to French if a translation is missing, and
 *   substituting {placeholders} from params when given.
 *
 * Translations were produced by an AI. French and English are the most
 * reliable; Swahili and Chinese are a solid first pass but, since some
 * of this content is safety-related, worth a native-speaker review
 * before being fully relied upon.
 */

const LANGUAGE_STORAGE_KEY = "smarthomemind_lang_v1";
export const SUPPORTED_LANGUAGES = ["fr", "en", "sw", "zh"];
const DEFAULT_LANGUAGE = "fr";

const LANGUAGE_DISPLAY_NAMES = { fr: "Français", en: "English", sw: "Kiswahili", zh: "中文" };

export function getLanguageDisplayName(lang) {
  return LANGUAGE_DISPLAY_NAMES[lang] || lang;
}

export function getLanguage() {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return SUPPORTED_LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
}

export function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    throw new Error(`Unsupported language: "${lang}"`);
  }
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}

const UI_STRINGS = {
  appTagline: {
    fr: "L'intelligence de sécurité de votre maison.",
    en: "Your home's safety intelligence.",
    sw: "Akili ya usalama ya nyumba yako.",
    zh: "您家的安全智能。",
  },
  appDescription: {
    fr: "Répondez à quelques questions simples sur votre maison et obtenez un score de sécurité, avec les actions les plus importantes à entreprendre en premier.",
    en: "Answer a few simple questions about your home and get a safety score, with the most important actions to take first.",
    sw: "Jibu maswali machache rahisi kuhusu nyumba yako na upate alama ya usalama, pamoja na hatua muhimu zaidi za kuchukua kwanza.",
    zh: "回答几个关于您家的简单问题，获取安全评分，以及最需要优先处理的行动建议。",
  },
  startButton: { fr: "Commencer l'évaluation", en: "Start the assessment", sw: "Anza tathmini", zh: "开始评估" },
  historyButton: { fr: "Évaluations précédentes", en: "Previous assessments", sw: "Tathmini zilizopita", zh: "以往的评估" },
  exitButton: { fr: "Quitter", en: "Exit", sw: "Ondoka", zh: "退出" },
  backButton: { fr: "Retour", en: "Back", sw: "Rudi", zh: "返回" },
  nextButton: { fr: "Suivant", en: "Next", sw: "Endelea", zh: "下一步" },
  seeResultsButton: { fr: "Voir mes résultats", en: "See my results", sw: "Ona matokeo yangu", zh: "查看我的结果" },
  questionProgress: {
    fr: "Question {current} sur {total}",
    en: "Question {current} of {total}",
    sw: "Swali {current} kati ya {total}",
    zh: "第 {current} 题，共 {total} 题",
  },
  criticalBannerTitle: {
    fr: "⚠ RISQUE CRITIQUE DÉTECTÉ",
    en: "⚠ CRITICAL RISK DETECTED",
    sw: "⚠ HATARI KUBWA IMEGUNDULIWA",
    zh: "⚠ 检测到严重风险",
  },
  criticalBannerDescription: {
    fr: "Un ou plusieurs dangers graves ont été identifiés, indépendamment du score ci-dessous.",
    en: "One or more serious hazards were identified, independent of the score below.",
    sw: "Hatari moja au zaidi mbaya zimetambuliwa, bila kujali alama iliyo hapa chini.",
    zh: "已识别出一个或多个严重危险，与下方评分无关。",
  },
  categoryScoresTitle: { fr: "Scores par catégorie", en: "Scores by category", sw: "Alama kwa kila kategoria", zh: "各类别评分" },
  priorityActionsTitle: { fr: "Actions prioritaires", en: "Priority actions", sw: "Hatua za kipaumbele", zh: "优先行动" },
  priorityLabel: { fr: "Priorité {n}", en: "Priority {n}", sw: "Kipaumbele {n}", zh: "优先级 {n}" },
  criticalSuffix: { fr: " — CRITIQUE", en: " — CRITICAL", sw: " — HATARI KUBWA", zh: " — 严重" },
  whyLabel: { fr: "Pourquoi :", en: "Why:", sw: "Kwa nini:", zh: "原因：" },
  actionLabel: { fr: "Action :", en: "Action:", sw: "Hatua:", zh: "行动：" },
  noRisksMessage: {
    fr: "Aucun risque identifié — continuez ainsi !",
    en: "No risks identified — keep it up!",
    sw: "Hakuna hatari iliyogundulika — endelea hivyo!",
    zh: "未发现风险——继续保持！",
  },
  retakeButton: { fr: "Refaire l'évaluation", en: "Retake the assessment", sw: "Fanya tathmini tena", zh: "重新评估" },
  saveAndHistoryButton: {
    fr: "Enregistrer et voir l'historique",
    en: "Save and view history",
    sw: "Hifadhi na uone historia",
    zh: "保存并查看历史记录",
  },
  historyTitle: { fr: "Historique", en: "History", sw: "Historia", zh: "历史记录" },
  trendUp: {
    fr: "▲ +{diff} depuis la dernière évaluation",
    en: "▲ +{diff} since the last assessment",
    sw: "▲ +{diff} tangu tathmini iliyopita",
    zh: "▲ +{diff} 相比上次评估",
  },
  trendDown: {
    fr: "▼ {diff} depuis la dernière évaluation",
    en: "▼ {diff} since the last assessment",
    sw: "▼ {diff} tangu tathmini iliyopita",
    zh: "▼ {diff} 相比上次评估",
  },
  trendFlat: {
    fr: "— stable depuis la dernière évaluation",
    en: "— stable since the last assessment",
    sw: "— bila mabadiliko tangu tathmini iliyopita",
    zh: "— 与上次评估相比无变化",
  },
  emptyHistoryMessage: {
    fr: "Aucune évaluation enregistrée pour le moment.",
    en: "No assessments saved yet.",
    sw: "Hakuna tathmini iliyohifadhiwa bado.",
    zh: "尚无已保存的评估。",
  },
  exportButton: { fr: "Exporter mes données", en: "Export my data", sw: "Hamisha data yangu", zh: "导出我的数据" },
  newAssessmentButton: { fr: "Nouvelle évaluation", en: "New assessment", sw: "Tathmini mpya", zh: "新评估" },
  criticalFlag: { fr: "⚠ critique", en: "⚠ critical", sw: "⚠ hatari kubwa", zh: "⚠ 严重" },
  levelExcellent: { fr: "Excellent", en: "Excellent", sw: "Bora Sana", zh: "优秀" },
  levelGood: { fr: "Bon", en: "Good", sw: "Nzuri", zh: "良好" },
  levelModerate: { fr: "Risque modéré", en: "Moderate risk", sw: "Hatari ya Wastani", zh: "中等风险" },
  levelHigh: { fr: "Risque élevé", en: "High risk", sw: "Hatari Kubwa", zh: "高风险" },
  levelCritical: { fr: "Alerte critique", en: "Critical alert", sw: "Tahadhari Muhimu", zh: "严重警报" },
  languageSwitcherLabel: { fr: "Langue", en: "Language", sw: "Lugha", zh: "语言" },
};

/**
 * Reads the UI string for `key` in the current language (falls back to
 * French), replacing any {name} placeholders with values from `params`.
 */
export function t(key, params) {
  const entry = UI_STRINGS[key];
  if (!entry) {
    console.warn(`[i18n] Missing UI string key: "${key}"`);
    return key;
  }
  const lang = getLanguage();
  let text = entry[lang] || entry.fr;
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replace(`{${name}}`, value);
    }
  }
  return text;
}
