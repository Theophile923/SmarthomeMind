/**
 * questions.js
 * ---------------
 * The full question bank. Pure data — no scoring math here.
 *
 * MULTI-LANGUAGE: text, helpText, and each answer's label are objects
 * keyed by language code (fr/en/sw/zh). Use getQuestionText(),
 * getQuestionHelp(), and getAnswerLabel() below to read the right one —
 * never read question.text / question.helpText / answer.label directly.
 *
 * Translations were produced by an AI. French and English are the most
 * reliable; Swahili and Chinese are a solid first pass but, since this
 * content is safety-related, worth a native-speaker review before being
 * fully relied upon.
 */

export const SCHEMA_VERSION = 1;

// Reused across every question so the three answer labels stay
// consistent everywhere (see the DynamicRiskEngine's UNKNOWN policy).
const STANDARD_ANSWER_LABELS = {
  YES: { fr: "Oui", en: "Yes", sw: "Ndiyo", zh: "是" },
  NO: { fr: "Non", en: "No", sw: "Hapana", zh: "否" },
  UNKNOWN: { fr: "Je ne sais pas", en: "I don't know", sw: "Sijui", zh: "不知道" },
};

export const QUESTIONS = [
  {
    id: "FIRE_001",
    categoryId: "FIRE",
    text: {
      fr: "Avez-vous au moins un détecteur de fumée fonctionnel par étage ?",
      en: "Do you have at least one working smoke detector per floor?",
      sw: "Una kigunduzi cha moshi kinachofanya kazi kwa kila ghorofa?",
      zh: "每层楼是否至少有一个可用的烟雾探测器？",
    },
    helpText: {
      fr: "Vérifiez en appuyant sur le bouton test du détecteur.",
      en: "Check by pressing the detector's test button.",
      sw: "Angalia kwa kubonyeza kitufe cha jaribio cha kigunduzi.",
      zh: "按下探测器的测试按钮进行检查。",
    },
    isCritical: true,
    impactScore: 10,
    effortScore: 1,
    answers: {
      YES: { riskFactor: 0.0, label: { fr: "Oui, fonctionnel", en: "Yes, working", sw: "Ndiyo, kinafanya kazi", zh: "是，可用" } },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_FIRE_001",
  },
  {
    id: "FIRE_002",
    categoryId: "FIRE",
    text: {
      fr: "Avez-vous un extincteur accessible et non expiré ?",
      en: "Do you have an accessible, non-expired fire extinguisher?",
      sw: "Una kizima moto kinachofikika na hakijaisha muda?",
      zh: "您是否有一个易于取用且未过期的灭火器？",
    },
    helpText: {
      fr: "Vérifiez la date de péremption indiquée sur l'étiquette.",
      en: "Check the expiration date on the label.",
      sw: "Angalia tarehe ya mwisho iliyoandikwa kwenye lebo.",
      zh: "检查标签上的过期日期。",
    },
    isCritical: false,
    impactScore: 6,
    effortScore: 2,
    answers: {
      YES: { riskFactor: 0.0, label: STANDARD_ANSWER_LABELS.YES },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_FIRE_002",
  },
  {
    id: "ELEC_001",
    categoryId: "ELECTRICAL",
    text: {
      fr: "Vos installations électriques ont-elles été inspectées ces 5 dernières années ?",
      en: "Has your electrical system been inspected in the last 5 years?",
      sw: "Mfumo wako wa umeme umekaguliwa katika miaka 5 iliyopita?",
      zh: "您的电气系统在过去5年内是否接受过检查？",
    },
    helpText: {
      fr: "Par un électricien qualifié, panneau électrique inclus.",
      en: "By a qualified electrician, including the electrical panel.",
      sw: "Na fundi umeme aliyehitimu, ikiwa ni pamoja na paneli ya umeme.",
      zh: "由合格电工检查，包括配电盘。",
    },
    isCritical: false,
    impactScore: 8,
    effortScore: 4,
    answers: {
      YES: { riskFactor: 0.0, label: STANDARD_ANSWER_LABELS.YES },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_ELEC_001",
  },
  {
    id: "ELEC_002",
    categoryId: "ELECTRICAL",
    text: {
      fr: "Tous vos câbles électriques sont-ils gainés, sans fils dénudés ni endommagés visibles ?",
      en: "Are all your electrical cables sheathed, with no bare or damaged wires visible?",
      sw: "Nyaya zako zote za umeme zimefunikwa, bila waya wazi au walioharibika wanaonekana?",
      zh: "您所有的电线是否都有绝缘层，没有裸露或损坏的电线？",
    },
    helpText: {
      fr: "Vérifiez près des prises, rallonges et appareils fréquemment utilisés.",
      en: "Check near outlets, extension cords, and frequently used appliances.",
      sw: "Angalia karibu na soketi, waya za ziada, na vifaa vinavyotumika mara kwa mara.",
      zh: "检查插座、延长线和常用电器附近。",
    },
    isCritical: false,
    impactScore: 8,
    effortScore: 2,
    answers: {
      YES: { riskFactor: 0.0, label: STANDARD_ANSWER_LABELS.YES },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_ELEC_002",
  },
  {
    id: "GAS_001",
    categoryId: "GAS",
    text: {
      fr: "Avez-vous un détecteur de gaz / monoxyde de carbone fonctionnel ?",
      en: "Do you have a working gas / carbon monoxide detector?",
      sw: "Una kigunduzi cha gesi/monoksidi kaboni kinachofanya kazi?",
      zh: "您是否有可用的燃气/一氧化碳探测器？",
    },
    helpText: {
      fr: "Essentiel si vous cuisinez au gaz ou utilisez un groupe électrogène.",
      en: "Essential if you cook with gas or use a generator.",
      sw: "Muhimu ikiwa unapika kwa gesi au unatumia jenereta.",
      zh: "如果您使用燃气做饭或使用发电机，这一点至关重要。",
    },
    isCritical: true,
    impactScore: 10,
    effortScore: 2,
    answers: {
      YES: { riskFactor: 0.0, label: { fr: "Oui, fonctionnel", en: "Yes, working", sw: "Ndiyo, kinafanya kazi", zh: "是，可用" } },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_GAS_001",
  },
  {
    id: "GAS_002",
    categoryId: "GAS",
    text: {
      fr: "Vérifiez-vous régulièrement vos tuyaux et raccords de gaz (odeur, sifflement, usure) ?",
      en: "Do you regularly check your gas pipes and connections (smell, hissing, wear)?",
      sw: "Unakagua mara kwa mara mabomba na viunganisho vya gesi (harufu, mlio, uchakavu)?",
      zh: "您是否定期检查燃气管道和接头（气味、嘶嘶声、磨损）？",
    },
    helpText: {
      fr: "Une vérification simple, au moins une fois par mois.",
      en: "A simple check, at least once a month.",
      sw: "Ukaguzi rahisi, angalau mara moja kwa mwezi.",
      zh: "简单检查，每月至少一次。",
    },
    isCritical: false,
    impactScore: 7,
    effortScore: 1,
    answers: {
      YES: { riskFactor: 0.0, label: { fr: "Oui, régulièrement", en: "Yes, regularly", sw: "Ndiyo, mara kwa mara", zh: "是，定期检查" } },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_GAS_002",
  },
  {
    id: "WATER_001",
    categoryId: "WATER",
    text: {
      fr: "Savez-vous où se trouve la vanne d'arrêt principale d'eau et pouvez-vous la fermer rapidement ?",
      en: "Do you know where the main water shut-off valve is, and can you close it quickly?",
      sw: "Unajua mahali bomba kuu la kuzima maji lilipo na unaweza kulifunga haraka?",
      zh: "您是否知道总水阀的位置，并能迅速关闭它？",
    },
    helpText: {
      fr: "Utile en cas de fuite ou de rupture de tuyau.",
      en: "Useful in case of a leak or a burst pipe.",
      sw: "Inasaidia endapo kuna uvujaji au bomba kupasuka.",
      zh: "在漏水或管道破裂时很有用。",
    },
    isCritical: false,
    impactScore: 5,
    effortScore: 1,
    answers: {
      YES: { riskFactor: 0.0, label: STANDARD_ANSWER_LABELS.YES },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_WATER_001",
  },
  {
    id: "WATER_002",
    categoryId: "WATER",
    text: {
      fr: "Vos tuyaux et raccords visibles sont-ils exempts de traces d'humidité ou de fuite ?",
      en: "Are your visible pipes and connections free of moisture or leak marks?",
      sw: "Mabomba na viunganisho vinavyoonekana havina alama za unyevu au uvujaji?",
      zh: "您可见的管道和接头是否没有潮湿或漏水痕迹？",
    },
    helpText: {
      fr: "Regardez sous les éviers et autour des appareils raccordés à l'eau.",
      en: "Check under sinks and around water-connected appliances.",
      sw: "Angalia chini ya sinki na karibu na vifaa vilivyounganishwa na maji.",
      zh: "检查水槽下方及连接水源的电器周围。",
    },
    isCritical: false,
    impactScore: 6,
    effortScore: 3,
    answers: {
      YES: { riskFactor: 0.0, label: STANDARD_ANSWER_LABELS.YES },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_WATER_002",
  },
  {
    id: "INTRU_001",
    categoryId: "INTRUSION",
    text: {
      fr: "Toutes vos portes et fenêtres ont-elles des serrures fonctionnelles ?",
      en: "Do all your doors and windows have working locks?",
      sw: "Milango na madirisha yako yote yana kufuli zinazofanya kazi?",
      zh: "您所有的门窗是否都有可用的锁？",
    },
    helpText: {
      fr: "Y compris les portes secondaires et les fenêtres du rez-de-chaussée.",
      en: "Including secondary doors and ground-floor windows.",
      sw: "Ikiwa ni pamoja na milango ya ziada na madirisha ya ghorofa ya chini.",
      zh: "包括次要门和一楼窗户。",
    },
    isCritical: false,
    impactScore: 6,
    effortScore: 2,
    answers: {
      YES: { riskFactor: 0.0, label: STANDARD_ANSWER_LABELS.YES },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_INTRU_001",
  },
  {
    id: "INTRU_002",
    categoryId: "INTRUSION",
    text: {
      fr: "Avez-vous un éclairage extérieur ou un système de sécurité actif la nuit ?",
      en: "Do you have outdoor lighting or an active security system at night?",
      sw: "Una taa za nje au mfumo wa usalama unaofanya kazi usiku?",
      zh: "您是否有室外照明或夜间启用的安全系统？",
    },
    helpText: {
      fr: "Éclairage, alarme, ou caméra — un seul de ces éléments suffit.",
      en: "Lighting, alarm, or camera — any one of these is enough.",
      sw: "Taa, kengele ya usalama, au kamera — moja tu kati ya hizi inatosha.",
      zh: "照明、警报器或摄像头——其中任意一种即可。",
    },
    isCritical: false,
    impactScore: 4,
    effortScore: 3,
    answers: {
      YES: { riskFactor: 0.0, label: STANDARD_ANSWER_LABELS.YES },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_INTRU_002",
  },
  {
    id: "PEOPLE_001",
    categoryId: "PEOPLE",
    text: {
      fr: "Les membres du foyer connaissent-ils le plan d'évacuation en cas d'urgence ?",
      en: "Do household members know the emergency evacuation plan?",
      sw: "Wanakaya wanajua mpango wa uokoaji wa dharura?",
      zh: "家庭成员是否知道紧急疏散计划？",
    },
    helpText: {
      fr: "Incendie, séisme, ou autre urgence — un point de rassemblement connu de tous.",
      en: "Fire, earthquake, or other emergency — a meeting point known to everyone.",
      sw: "Moto, tetemeko la ardhi, au dharura nyingine — sehemu ya kukutana inayojulikana na wote.",
      zh: "火灾、地震或其他紧急情况——一个大家都知道的集合点。",
    },
    isCritical: false,
    impactScore: 7,
    effortScore: 2,
    answers: {
      YES: { riskFactor: 0.0, label: STANDARD_ANSWER_LABELS.YES },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_PEOPLE_001",
  },
  {
    id: "PEOPLE_002",
    categoryId: "PEOPLE",
    text: {
      fr: "Les produits dangereux (produits chimiques, médicaments) sont-ils rangés hors de portée des enfants ?",
      en: "Are dangerous products (chemicals, medication) stored out of children's reach?",
      sw: "Bidhaa hatari (kemikali, dawa) zimehifadhiwa mahali wasipofikia watoto?",
      zh: "危险物品（化学品、药物）是否存放在儿童接触不到的地方？",
    },
    helpText: {
      fr: "Armoire fermée à clé ou en hauteur, hors de vue et de portée.",
      en: "Locked cabinet or high up, out of sight and reach.",
      sw: "Kabati lililofungwa au mahali pa juu, mbali na macho na mikono ya watoto.",
      zh: "锁好的柜子或高处，儿童看不到也拿不到的地方。",
    },
    isCritical: false,
    impactScore: 8,
    effortScore: 1,
    answers: {
      YES: { riskFactor: 0.0, label: STANDARD_ANSWER_LABELS.YES },
      NO: { riskFactor: 1.0, label: STANDARD_ANSWER_LABELS.NO },
      UNKNOWN: { riskFactor: 0.7, label: STANDARD_ANSWER_LABELS.UNKNOWN },
    },
    recommendationId: "REC_PEOPLE_002",
  },
];

/** Quick lookup helper: get a question object by its id. */
export function getQuestionById(questionId) {
  const found = QUESTIONS.find((q) => q.id === questionId);
  if (!found) {
    throw new Error(`Unknown question id: "${questionId}"`);
  }
  return found;
}

/** Returns all questions belonging to one category, in bank order. */
export function getQuestionsByCategory(categoryId) {
  return QUESTIONS.filter((q) => q.categoryId === categoryId);
}

/** Reads a question's text in the given language, falling back to French. */
export function getQuestionText(question, lang) {
  return question.text[lang] || question.text.fr;
}

/** Reads a question's help text in the given language, falling back to French. */
export function getQuestionHelp(question, lang) {
  return question.helpText[lang] || question.helpText.fr;
}

/** Reads an answer's label in the given language, falling back to French. */
export function getAnswerLabel(answerDef, lang) {
  return answerDef.label[lang] || answerDef.label.fr;
}
