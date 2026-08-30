import { QUESTIONS } from "../data/questions.js";
import { getCategoryById } from "../data/categories.js";

export function renderAssessment(root, { onComplete, onExit }) {
  let currentIndex = 0;
  const answers = {};

  function render() {
    const question = QUESTIONS[currentIndex];
    const category = getCategoryById(question.categoryId);
    const progressPercent = Math.round(
      ((currentIndex + 1) / QUESTIONS.length) * 100
    );
    const selectedAnswer = answers[question.id];

    root.innerHTML = `
      <div class="screen assessment-screen">
        <button class="btn-text btn-exit" type="button">Quitter</button>

        <div class="progress-bar" role="progressbar"
             aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar-fill" style="width:${progressPercent}%"></div>
        </div>
        <p class="progress-label">Question ${currentIndex + 1} sur ${QUESTIONS.length}</p>

        <p class="category-chip">${category.icon} ${category.label}</p>

        <h2 class="question-text">${question.text}</h2>
        ${question.helpText ? `<p class="question-help">${question.helpText}</p>` : ""}

        <div class="answer-options" role="group" aria-label="Réponses possibles">
          ${["YES", "NO", "UNKNOWN"]
            .map((key) => {
              const def = question.answers[key];
              const isSelected = selectedAnswer === key;
              return `
                <button type="button"
                        class="answer-option answer-option--${key.toLowerCase()} ${isSelected ? "is-selected" : ""}"
                        data-answer="${key}">
                  ${def.label}
                </button>
              `;
            })
            .join("")}
        </div>

        <div class="nav-buttons">
          <button type="button" class="btn-secondary btn-back" ${currentIndex === 0 ? "disabled" : ""}>
            Retour
          </button>
          <button type="button" class="btn-primary btn-next" ${!selectedAnswer ? "disabled" : ""}>
            ${currentIndex === QUESTIONS.length - 1 ? "Voir mes résultats" : "Suivant"}
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
