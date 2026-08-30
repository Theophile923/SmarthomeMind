import { QUESTIONS } from "../data/questions.js";
import { getRecommendationById } from "../data/recommendations.js";

export function rankRecommendations(answers, limit = 5) {
  const risky = QUESTIONS.filter((q) => {
    const answer = answers[q.id];
    return answer === "NO" || answer === "UNKNOWN";
  });

  const withPriority = risky.map((question) => {
    const dapPriority =
      (question.impactScore * question.impactScore) / question.effortScore;
    const content = getRecommendationById(question.recommendationId);

    return {
      questionId: question.id,
      categoryId: question.categoryId,
      isCritical: question.isCritical,
      answerGiven: answers[question.id],
      impactScore: question.impactScore,
      effortScore: question.effortScore,
      dapPriority: Math.round(dapPriority * 10) / 10,
      title: content.title,
      why: content.why,
      action: content.action,
    };
  });

  withPriority.sort((a, b) => {
    if (a.isCritical !== b.isCritical) {
      return a.isCritical ? -1 : 1;
    }
    return b.dapPriority - a.dapPriority;
  });

  return withPriority.slice(0, limit);
}
