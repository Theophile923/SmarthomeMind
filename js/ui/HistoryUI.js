/**
 * HistoryUI.js
 * ----------------
 * Renders the list of past assessments (newest first) plus a simple
 * trend indicator comparing the two most recent scores.
 *
 * Only reads data handed to it — never touches storage directly. That
 * job belongs to main.js (via a StorageAdapter).
 *
 * MULTI-LANGUAGE: all UI chrome comes from t() in i18n.js.
 */

import { t, getLanguage } from "../core/i18n.js";

const LEVEL_KEYS = {
  EXCELLENT: "levelExcellent",
  GOOD: "levelGood",
  MODERATE_RISK: "levelModerate",
  HIGH_RISK: "levelHigh",
  CRITICAL_ALERT: "levelCritical",
};

const DATE_LOCALES = { fr: "fr-FR", en: "en-US", sw: "sw-KE", zh: "zh-CN" };

function formatDate(isoString, lang) {
  const d = new Date(isoString);
  return d.toLocaleDateString(DATE_LOCALES[lang] || "fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function trendIndicator(history) {
  if (history.length < 2) return "";
  const [latest, previous] = history; // history is newest-first
  const diff = latest.globalScore - previous.globalScore;
  if (diff > 0) return `<span class="trend trend-up">${t("trendUp", { diff: `+${diff}` })}</span>`;
  if (diff < 0) return `<span class="trend trend-down">${t("trendDown", { diff })}</span>`;
  return `<span class="trend trend-flat">${t("trendFlat")}</span>`;
}

/**
 * @param {HTMLElement} root
 * @param {Object} params
 * @param {Array} params.history - assessments, newest first
 * @param {Function} params.onSelectAssessment - called with assessmentId
 * @param {Function} params.onStartNew
 * @param {Function} params.onExportData
 */
export function renderHistory(
  root,
  { history, onSelectAssessment, onStartNew, onExportData }
) {
  const lang = getLanguage();

  root.innerHTML = `
    <div class="screen history-screen">
      <h2 class="screen-title">${t("historyTitle")}</h2>

      ${trendIndicator(history)}

      ${
        history.length === 0
          ? `<p class="empty-message">${t("emptyHistoryMessage")}</p>`
          : `
        <ul class="history-list">
          ${history
            .map(
              (a) => `
            <li class="history-item" data-id="${a.assessmentId}">
              <div class="history-item-date">${formatDate(a.date, lang)}</div>
              <div class="history-item-score">
                ${a.globalScore}/100
                ${a.criticalRisks.length > 0 ? `<span class="history-critical-flag">${t("criticalFlag")}</span>` : ""}
              </div>
              <div class="history-item-level">${t(LEVEL_KEYS[a.riskLevel])}</div>
            </li>
          `
            )
            .join("")}
        </ul>
      `
      }

      <div class="nav-buttons">
        <button type="button" class="btn-secondary btn-export" ${history.length === 0 ? "disabled" : ""}>
          ${t("exportButton")}
        </button>
        <button type="button" class="btn-primary btn-new-assessment">
          ${t("newAssessmentButton")}
        </button>
      </div>
    </div>
  `;

  root.querySelectorAll(".history-item").forEach((item) => {
    item.addEventListener("click", () => {
      onSelectAssessment(item.dataset.id);
    });
  });

  root.querySelector(".btn-new-assessment").addEventListener("click", onStartNew);
  root.querySelector(".btn-export").addEventListener("click", onExportData);
}
