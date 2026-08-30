const LEVEL_LABELS = {
  EXCELLENT: "Excellent",
  GOOD: "Bon",
  MODERATE_RISK: "Risque modéré",
  HIGH_RISK: "Risque élevé",
  CRITICAL_ALERT: "Alerte critique",
};

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function trendIndicator(history) {
  if (history.length < 2) return "";
  const [latest, previous] = history;
  const diff = latest.globalScore - previous.globalScore;
  if (diff > 0) return `<span class="trend trend-up">▲ +${diff} depuis la dernière évaluation</span>`;
  if (diff < 0) return `<span class="trend trend-down">▼ ${diff} depuis la dernière évaluation</span>`;
  return `<span class="trend trend-flat">— stable depuis la dernière évaluation</span>`;
}

export function renderHistory(
  root,
  { history, onSelectAssessment, onStartNew, onExportData }
) {
  root.innerHTML = `
    <div class="screen history-screen">
      <h2 class="screen-title">Historique</h2>

      ${trendIndicator(history)}

      ${
        history.length === 0
          ? `<p class="empty-message">Aucune évaluation enregistrée pour le moment.</p>`
          : `
        <ul class="history-list">
          ${history
            .map(
              (a) => `
            <li class="history-item" data-id="${a.assessmentId}">
              <div class="history-item-date">${formatDate(a.date)}</div>
              <div class="history-item-score">
                ${a.globalScore}/100
                ${a.criticalRisks.length > 0 ? '<span class="history-critical-flag">⚠ critique</span>' : ""}
              </div>
              <div class="history-item-level">${LEVEL_LABELS[a.riskLevel]}</div>
            </li>
          `
            )
            .join("")}
        </ul>
      `
      }

      <div class="nav-buttons">
        <button type="button" class="btn-secondary btn-export" ${history.length === 0 ? "disabled" : ""}>
          Exporter mes données
        </button>
        <button type="button" class="btn-primary btn-new-assessment">
          Nouvelle évaluation
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
