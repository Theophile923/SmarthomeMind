/**
 * ResultsUI.js
 * ----------------
 * Renders the results dashboard for one completed assessment.
 * Receives an already-computed `assessment` object (from
 * DynamicRiskEngine.js) and an already-ranked `recommendations` array
 * (from RecommendationEngine.js) — this file only displays them, it
 * never recalculates anything.
 *
 * MULTI-LANGUAGE: DynamicRiskEngine.js and RecommendationEngine.js
 * were left untouched — they still pass through the raw {fr, en, sw, zh}
 * text objects from questions.js/categories.js/recommendations.js
 * unchanged. This file is where those objects finally get resolved to
 * a single display string, using the language i18n.js currently has
 * active. UI chrome (buttons, section titles, level names) comes from
 * t() in i18n.js.
 */

import { t, getLanguage } from "../core/i18n.js";

const LEVEL_KEYS = {
  EXCELLENT: { key: "levelExcellent", className: "level-excellent" },
  GOOD: { key: "levelGood", className: "level-good" },
  MODERATE_RISK: { key: "levelModerate", className: "level-moderate" },
  HIGH_RISK: { key: "levelHigh", className: "level-high" },
  CRITICAL_ALERT: { key: "levelCritical", className: "level-critical" },
};

/** A field from our data files is either a plain string (old data) or
 * a {fr, en, sw, zh} object — this resolves either case safely. */
function resolveText(field, lang) {
  if (typeof field === "string") return field;
  return field[lang] || field.fr;
}

/**
 * @param {HTMLElement} root
 * @param {Object} params
 * @param {Object} params.assessment - output of computeAssessment()
 * @param {Array} params.recommendations - output of rankRecommendations()
 * @param {Function} params.onSaveAndViewHistory
 * @param {Function} params.onRetake
 */
export function renderResults(
  root,
  { assessment, recommendations, onSaveAndViewHistory, onRetake }
) {
  const lang = getLanguage();
  const level = LEVEL_KEYS[assessment.riskLevel];
  const hasCriticalRisks = assessment.criticalRisks.length > 0;

  root.innerHTML = `
    <div class="screen results-screen">
      ${
        hasCriticalRisks
          ? `
        <div class="critical-banner" role="alert">
          <strong>${t("criticalBannerTitle")}</strong>
          <p>${t("criticalBannerDescription")}</p>
          <ul>
            ${assessment.criticalRisks
              .map((r) => `<li>${resolveText(r.title, lang)}</li>`)
              .join("")}
          </ul>
        </div>
      `
          : ""
      }

      <div class="score-circle score-circle--${level.className}">
        <span class="score-value">${assessment.globalScore}</span>
        <span class="score-max">/100</span>
      </div>
      <p class="score-level ${level.className}">${t(level.key)}</p>

      <h3 class="section-title">${t("categoryScoresTitle")}</h3>
      <div class="category-scores">
        ${assessment.categoryScores
          .map(
            (cs) => `
          <div class="category-score-row">
            <span class="category-score-label">${cs.icon} ${resolveText(cs.label, lang)}</span>
            <div class="category-score-bar">
              <div class="category-score-bar-fill" style="width:${cs.score}%"></div>
            </div>
            <span class="category-score-number">${cs.score}</span>
          </div>
        `
          )
          .join("")}
      </div>

      ${
        recommendations.length > 0
          ? `
        <h3 class="section-title">${t("priorityActionsTitle")}</h3>
        <div class="recommendations-list">
          ${recommendations
            .map(
              (rec, i) => `
            <div class="recommendation-card ${rec.isCritical ? "recommendation-card--critical" : ""}">
              <p class="recommendation-priority">${t("priorityLabel", { n: i + 1 })}${rec.isCritical ? t("criticalSuffix") : ""}</p>
              <h4 class="recommendation-title">${resolveText(rec.title, lang)}</h4>
              <p class="recommendation-why"><strong>${t("whyLabel")}</strong> ${resolveText(rec.why, lang)}</p>
              <p class="recommendation-action"><strong>${t("actionLabel")}</strong> ${resolveText(rec.action, lang)}</p>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : `<p class="no-risks-message">${t("noRisksMessage")}</p>`
      }

      <div class="nav-buttons">
        <button type="button" class="btn-secondary btn-retake">${t("retakeButton")}</button>
        <button type="button" class="btn-primary btn-save">${t("saveAndHistoryButton")}</button>
      </div>
    </div>
  `;

  root.querySelector(".btn-retake").addEventListener("click", onRetake);
  root.querySelector(".btn-save").addEventListener("click", onSaveAndViewHistory);
}
