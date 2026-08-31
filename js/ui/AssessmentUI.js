/**
 * AssessmentUI.js
 * -------------------
 * Renders the questionnaire, one question per screen (mobile-first).
 *
 * IMPORTANT BOUNDARY: this file only builds and updates the page. It
 * never calculates a score — it just collects raw answers and hands
 * them off (via onComplete) to whoever called renderAssessment. The
 * actual scoring happens in DynamicRiskEngine.js.
 *
 * MULTI-LANGUAGE: question text, help text, category labels, and
 * answer labels are read via the getQuestionText/getQuestionHelp/
 * getAnswerLabel/getCategoryLabel helpers, using the language i18n.js
 * currently has active. UI chrome (buttons, progress label) comes from
 * t() in i18n.js.
 */

import { QUESTIONS, getQuestionText, getQuestionHelp, getAnswerLabel } from "../data/questions.js";
import { getCategoryById, getCategoryLabel } from "../data/categories.js";
import { t, getLanguage } from "../core/i18n.js";

/**
 * @param {HTMLElement} root - element to render into
 * @param {Function} onComplete - called with the full answers object
 *                                 once the last question is answered
 * @param {Function} onExit - called if the user chooses to leave early
 */
export function renderAssessment(root, { onComplete, onExit }) {
  let currentIndex = 0;
  const answers = {};

  function render() {
    const lang = getLanguage();
    const question = QUESTIONS[currentIndex];
    const category = getCategoryById(question.categoryId);
    const progressPercent = Math.round(
      ((currentIndex + 1) / QUESTIONS.length) * 100
    );
    const selectedAnswer = answers[question.id];

    root.innerHTML = `
      <div class="screen assessment-screen">
        <button class="btn-text btn-exit" type="button">${t("exitButton")}</button>

        <div class="progress-bar" role="progressbar"
             aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar-fill" style="width:${progressPercent}%"></div>
        </div>
        <p class="progress-label">${t("questionProgress", { current: currentIndex + 1, total: QUESTIONS.length })}</p>

        <p class="category-chip">${category.icon} ${getCategoryLabel(category, lang)}</p>

        <h2 class="question-text">${getQuestionText(question, lang)}</h2>
        ${question.helpText ? `<p class="question-help">${getQuestionHelp(question, lang)}</p>` : ""}

        <div class="answer-options" role="group" aria-label="${t("questionProgress", { current: currentIndex + 1, total: QUESTIONS.length })}">
          ${["YES", "NO", "UNKNOWN"]
            .map((key) => {
              const def = question.answers[key];
              const isSelected = selectedAnswer === key;
              return `
                <button type="button"
                        class="answer-option answer-option--${key.toLowerCase()} ${isSelected ? "is-selected" : ""}"
                        data-answer="${key}">
                  ${getAnswerLabel(def, lang)}
                </button>
              `;
            })
            .join("")}
        </div>

        <div class="nav-buttons">
          <button type="button" class="btn-secondary btn-back" ${currentIndex === 0 ? "disabled" : ""}>
            ${t("backButton")}
          </button>
          <button type="button" class="btn-primary btn-next" ${!selectedAnswer ? "disabled" : ""}>
            ${currentIndex === QUESTIONS.length - 1 ? t("seeResultsButton") : t("nextButton")}
          </button>
        </div>
      </div>
    `;

    attachEvents(question);
  }

  function attachEvents(question) {
    root.querySelector(".btn-exit").addEventListener("click", () => {
      onExit();
    });

    root.querySelectorAll(".answer-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        answers[question.id] = btn.dataset.answer;
        render();
      });
    });

    root.querySelector(".btn-back").addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        render();
      }
    });

    root.querySelector(".btn-next").addEventListener("click", () => {
      if (!answers[question.id]) return;
      if (currentIndex < QUESTIONS.length - 1) {
        currentIndex += 1;
        render();
      } else {
        onComplete(answers);
      }
    });
  }

  render();
}
