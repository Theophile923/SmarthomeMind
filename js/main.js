import { computeAssessment } from "./core/DynamicRiskEngine.js";
import { rankRecommendations } from "./core/RecommendationEngine.js";
import { LocalStorageAdapter } from "./storage/LocalStorageAdapter.js";
import { renderAssessment } from "./ui/AssessmentUI.js";
import { renderResults } from "./ui/ResultsUI.js";
import { renderHistory } from "./ui/HistoryUI.js";

const storage = new LocalStorageAdapter();

const root = document.getElementById("app");

function goHome() {
  const history = storage.getHistory();

  root.innerHTML = `
    <div class="screen home-screen">
      <h1 class="app-title">SmartHomeMind</h1>
      <p class="app-tagline">L'intelligence de sécurité de votre maison.</p>
      <p class="app-description">
        Répondez à quelques questions simples sur votre maison et obtenez
        un score de sécurité, avec les actions les plus importantes à
        entreprendre en premier.
      </p>
      <button type="button" class="btn-primary btn-start">
        Commencer l'évaluation
      </button>
      ${
        history.length > 0
          ? `<button type="button" class="btn-text btn-history">Évaluations précédentes</button>`
          : ""
      }
    </div>
  `;

  root.querySelector(".btn-start").addEventListener("click", goToAssessment);

  const historyBtn = root.querySelector(".btn-history");
  if (historyBtn) {
    historyBtn.addEventListener("click", goToHistory);
  }
}

function goToAssessment() {
  renderAssessment(root, {
    onComplete: (answers) => {
      const assessment = computeAssessment(answers);
      const recommendations = rankRecommendations(answers, 5);
      goToResults(assessment, recommendations);
    },
    onExit: goHome,
  });
}

function goToResults(assessment, recommendations) {
  renderResults(root, {
    assessment,
    recommendations,
    onRetake: goToAssessment,
    onSaveAndViewHistory: () => {
      storage.saveAssessment(assessment);
      goToHistory();
    },
  });
}

function goToHistory() {
  const history = storage.getHistory();

  renderHistory(root, {
    history,
    onStartNew: goToAssessment,
    onSelectAssessment: (assessmentId) => {
      const saved = storage.getAssessmentById(assessmentId);
      if (!saved) return;
      const recommendations = rankRecommendations(saved.answers, 5);
      renderResults(root, {
        assessment: saved,
        recommendations,
        onRetake: goToAssessment,
        onSaveAndViewHistory: goToHistory,
      });
    },
    onExportData: () => {
      const data = storage.exportAll();
      downloadJson(data, `smarthomemind-export-${Date.now()}.json`);
    },
  });
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch((err) => console.warn("[PWA] Service worker registration failed:", err));
  });
}

goHome();
