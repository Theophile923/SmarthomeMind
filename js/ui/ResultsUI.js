const LEVEL_DISPLAY = {
  EXCELLENT: { label: "Excellent", className: "level-excellent" },
  GOOD: { label: "Bon", className: "level-good" },
  MODERATE_RISK: { label: "Risque modéré", className: "level-moderate" },
  HIGH_RISK: { label: "Risque élevé", className: "level-high" },
  CRITICAL_ALERT: { label: "Alerte critique", className: "level-critical" },
};

export function renderResults(
  root,
  { assessment, recommendations, onSaveAndViewHistory, onRetake }
) {
  const level = LEVEL_DISPLAY[assessment.riskLevel];
  const hasCriticalRisks = assessment.criticalRisks.length > 0;

  root.innerHTML = `
    <div class="screen results-screen">
      ${
        hasCriticalRisks
          ? `
        <div class="critical-banner" role="alert">
          <strong>⚠ RISQUE CRITIQUE DÉTECTÉ</strong>
          <p>Un ou plusieurs dangers graves ont été identifiés, indépendamment du score ci-dessous.</p>
          <ul>
            ${assessment.criticalRisks
              .map((r) => `<li>${r.title}</li>`)
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
      <p class="score-level ${level.className}">${level.label}</p>

      <h3 class="section-title">Scores par catégorie</h3>
      <div class="category-scores">
        ${assessment.categoryScores
          .map(
            (cs) => `
          <div class="category-score-row">
            <span class="category-score-label">${cs.icon} ${cs.label}</span>
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
        <h3 class="section-title">Actions prioritaires</h3>
        <div class="recommendations-list">
          ${recommendations
            .map(
              (rec, i) => `
            <div class="recommendation-card ${rec.isCritical ? "recommendation-card--critical" : ""}">
              <p class="recommendation-priority">Priorité ${i + 1}${rec.isCritical ? " — CRITIQUE" : ""}</p>
              <h4 class="recommendation-title">${rec.title}</h4>
              <p class="recommendation-why"><strong>Pourquoi :</strong> ${rec.why}</p>
              <p class="recommendation-action"><strong>Action :</strong> ${rec.action}</p>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : `<p class="no-risks-message">Aucun risque identifié — continuez ainsi !</p>`
      }

      <div class="nav-buttons">
        <button type="button" class="btn-secondary btn-retake">Refaire l'évaluation</button>
        <button type="button" class="btn-primary btn-save">Enregistrer et voir l'historique</button>
      </div>
    </div>
  `;

  root.querySelector(".btn-retake").addEventListener("click", onRetake);
  root.querySelector(".btn-save").addEventListener("click", onSaveAndViewHistory);
}
