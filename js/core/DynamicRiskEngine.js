import { CATEGORIES, getCategoryById } from "../data/categories.js";
import { QUESTIONS, SCHEMA_VERSION } from "../data/questions.js";

const RISK_LEVEL_THRESHOLDS = [
  { min: 85, level: "EXCELLENT" },
  { min: 70, level: "GOOD" },
  { min: 50, level: "MODERATE_RISK" },
  { min: 0, level: "HIGH_RISK" },
];

function assertWeightsSumToOne() {
  const total = CATEGORIES.reduce((sum, c) => sum + c.weight, 0);
  const rounded = Math.round(total * 1000) / 1000;
  if (rounded !== 1) {
    console.warn(
      `[DynamicRiskEngine] Category weights sum to ${rounded}, expected 1.0. ` +
        `Check js/data/categories.js.`
    );
  }
}
assertWeightsSumToOne();

function computeQuestionRiskPoints(question, answerKey) {
  const answerDef = question.answers[answerKey];
  if (!answerDef) {
    throw new Error(
      `Invalid answer "${answerKey}" for question "${question.id}"`
    );
  }
  return question.impactScore * answerDef.riskFactor;
}

function levelFromScore(score) {
  const match = RISK_LEVEL_THRESHOLDS.find((t) => score >= t.min);
  return match.level;
}

export function computeAssessment(answers) {
  const missing = QUESTIONS.filter((q) => !(q.id in answers));
  if (missing.length > 0) {
    throw new Error(
      `Cannot compute assessment: missing answers for ${missing
        .map((q) => q.id)
        .join(", ")}`
    );
  }

  const riskPointsByCategory = {};
  const maxRiskPointsByCategory = {};
  const criticalRisks = [];

  for (const category of CATEGORIES) {
    riskPointsByCategory[category.id] = 0;
    maxRiskPointsByCategory[category.id] = 0;
  }

  for (const question of QUESTIONS) {
    const answerKey = answers[question.id];
    const points = computeQuestionRiskPoints(question, answerKey);

    riskPointsByCategory[question.categoryId] += points;
    maxRiskPointsByCategory[question.categoryId] += question.impactScore;

    if (question.isCritical && answerKey !== "YES") {
      criticalRisks.push({
        questionId: question.id,
        categoryId: question.categoryId,
        title: question.text,
        answerGiven: answerKey,
      });
    }
  }

  const categoryScores = CATEGORIES.map((category) => {
    const riskPoints = riskPointsByCategory[category.id];
    const maxRiskPoints = maxRiskPointsByCategory[category.id];
    const score =
      maxRiskPoints === 0 ? 100 : 100 - (riskPoints / maxRiskPoints) * 100;
    return {
      categoryId: category.id,
      label: category.label,
      icon: category.icon,
      score: Math.round(score),
      riskPoints,
      maxRiskPoints,
    };
  });

  const globalScoreRaw = categoryScores.reduce((sum, cs) => {
    const category = getCategoryById(cs.categoryId);
    return sum + cs.score * category.weight;
  }, 0);
  const globalScore = Math.round(globalScoreRaw);

  const scoreLevel = levelFromScore(globalScore);

  const hasCriticalAlert = criticalRisks.length > 0;
  const riskLevel = hasCriticalAlert ? "CRITICAL_ALERT" : scoreLevel;

  return {
    schemaVersion: SCHEMA_VERSION,
    answers,
    categoryScores,
    globalScore,
    riskLevel,
    criticalRisks,
  };
}
