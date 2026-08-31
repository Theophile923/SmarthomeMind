/**
 * categories.js
 * ---------------
 * Pure data: the safety categories used across the whole app, and the
 * "weight" each one carries in the global score.
 *
 * MULTI-LANGUAGE: each category's label is an object keyed by language
 * code (fr/en/sw/zh). Use getCategoryLabel() below to read the right
 * one for the current language — never read category.label directly.
 *
 * Translations were produced by an AI. French and English are the most
 * reliable; Swahili and Chinese are a solid first pass but, as with any
 * safety-related content, worth a native-speaker review before being
 * fully relied upon.
 */

export const CATEGORIES = [
  {
    id: "FIRE",
    label: { fr: "Incendie", en: "Fire", sw: "Moto", zh: "火灾" },
    icon: "🔥",
    weight: 0.25,
  },
  {
    id: "ELECTRICAL",
    label: { fr: "Électricité", en: "Electrical", sw: "Umeme", zh: "电气" },
    icon: "⚡",
    weight: 0.25,
  },
  {
    id: "GAS",
    label: { fr: "Gaz", en: "Gas", sw: "Gesi", zh: "燃气" },
    icon: "🧯",
    weight: 0.20,
  },
  {
    id: "WATER",
    label: { fr: "Eau", en: "Water", sw: "Maji", zh: "水" },
    icon: "💧",
    weight: 0.10,
  },
  {
    id: "INTRUSION",
    label: { fr: "Intrusion", en: "Intrusion", sw: "Uvamizi", zh: "入侵" },
    icon: "🔒",
    weight: 0.10,
  },
  {
    id: "PEOPLE",
    label: {
      fr: "Sécurité des personnes",
      en: "People safety",
      sw: "Usalama wa Watu",
      zh: "人身安全",
    },
    icon: "👨‍👩‍👧",
    weight: 0.10,
  },
];

/** Quick lookup helper: get a category object by its id. */
export function getCategoryById(categoryId) {
  const found = CATEGORIES.find((c) => c.id === categoryId);
  if (!found) {
    throw new Error(`Unknown category id: "${categoryId}"`);
  }
  return found;
}

/** Reads a category's label in the given language, falling back to French. */
export function getCategoryLabel(category, lang) {
  return category.label[lang] || category.label.fr;
}
