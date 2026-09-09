/**
 * main.js
 * -----------
 * The application controller. This is the ONLY file that:
 *   - knows about all the other modules
 *   - decides which screen is currently shown
 *   - wires the UI modules to the engine and storage modules
 *
 * Think of it as a small router: it doesn't calculate scores (that's
 * DynamicRiskEngine.js) and it doesn't build HTML for questions or
 * results (that's the js/ui/*.js files) — it just connects them.
 *
 * MULTI-LANGUAGE (V1.1): the language switcher lives on the home screen
 * only, for simplicity. Choosing a language calls setLanguage() (which
 * saves it) and re-renders the current screen — every other screen
 * already reads the saved language on its own each time it renders, so
 * nothing else needs to change.
 */

import { computeAssessment } from "./core/DynamicRiskEngine.js";
import { rankRecommendations } from "./core/RecommendationEngine.js";
import { LocalStorageAdapter } from "./storage/LocalStorageAdapter.js";
import { renderAssessment } from "./ui/AssessmentUI.js";
import { renderResults } from "./ui/ResultsUI.js";
import { renderHistory } from "./ui/HistoryUI.js";
import { t, getLanguage, setLanguage, SUPPORTED_LANGUAGES, getLanguageDisplayName } from "./core/i18n.js";
import { signInWithPi, isPiBrowserAvailable } from "./core/piAuth.js";

// Swapping to a future CloudStorageAdapter/Pi-backed storage means
// changing only this one line — nothing else in the app needs to know.
const storage = new LocalStorageAdapter();

const root = document.getElementById("app");

// Pi Network sign-in state. null = not signed in. Set by
// attemptAutoSignIn() on load, or manually via the sign-in button.
let currentPiUser = null;

/**
 * Tries to sign in automatically when the app loads, but only if the
 * Pi SDK is actually present (i.e. we're inside the Pi Browser).
 * Fails silently everywhere else — SmartHomeMind must keep working
 * normally in regular browsers where Pi sign-in simply isn't offered.
 */
async function attemptAutoSignIn() {
  if (!isPiBrowserAvailable()) return;
  try {
    currentPiUser = await signInWithPi();
    goHome(); // re-render to reflect the signed-in state
  } catch (err) {
    console.warn("[PiAuth] Auto sign-in did not complete:", err.message);
  }
}

async function handleManualSignIn() {
  try {
    currentPiUser = await signInWithPi();
    goHome();
  } catch (err) {
    console.warn("[PiAuth] Sign-in failed:", err.message);
    alert(t("signInFailed"));
  }
}

function goHome() {
  const history = storage.getHistory();
  const currentLang = getLanguage();

  root.innerHTML = `
    <div class="screen home-screen">
      <div class="language-switcher" role="group" aria-label="${t("languageSwitcherLabel")}">
        ${SUPPORTED_LANGUAGES.map(
          (lang) => `
          <button type="button"
                  class="lang-option ${lang === currentLang ? "is-selected" : ""}"
                  data-lang="${lang}">
            ${getLanguageDisplayName(lang)}
          </button>
        `
        ).join("")}
      </div>

      <h1 class="app-title">SmartHomeMind</h1>
      <p class="app-tagline">${t("appTagline")}</p>
      <p class="app-description">${t("appDescription")}</p>

      ${
        currentPiUser
          ? `<p class="pi-signed-in">${t("signedInAs", { username: currentPiUser.username })}</p>`
          : `<button type="button" class="btn-text btn-pi-signin">${t("signInButton")}</button>`
      }

      <button type="button" class="btn-primary btn-start">
        ${t("startButton")}
      </button>
      ${
        history.length > 0
          ? `<button type="button" class="btn-text btn-history">${t("historyButton")}</button>`
          : ""
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
      // Recompute recommendations for display (deterministic — same
      // answers always produce the same ranked list, nothing new is
      // being decided here, just redisplaying).
      const recommendations = rankRecommendations(saved.answers, 5);
      renderResults(root, {
        assessment: saved,
        recommendations,
        onRetake: goToAssessment,
        onSaveAndViewHistory: goToHistory, // already saved, just go back
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

// PWA: register the service worker (enables offline use + installability).
// Guarded so the app still works fine in browsers/contexts without
// service worker support — it just won't be installable there.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch((err) => console.warn("[PWA] Service worker registration failed:", err));
  });
}

// Apply the saved language to <html lang="..."> before the first render.
document.documentElement.lang = getLanguage();

// Boot the app.
goHome();

// Try Pi sign-in automatically (silently does nothing outside the Pi Browser).
attemptAutoSignIn();