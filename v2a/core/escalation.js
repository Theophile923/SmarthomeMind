/**
 * escalation.js
 * -----------------
 * Turns a {score, confidence} pair from riskEngine.js into a final
 * escalation level and a simulated alert plan (what channels would
 * fire, in the real V2-B pilot).
 *
 * WHY CONFIDENCE CAN DOWNGRADE THE LEVEL:
 * A raw score of 0.85 (CRITICAL territory) from a single, low-health
 * sensor is not the same situation as 0.85 from two corroborating,
 * fresh sensors. Per the strategic analysis: "HIGH RISK + LOW
 * CONFIDENCE" should not trigger the same response as "HIGH RISK +
 * HIGH CONFIDENCE." Here, low confidence downgrades the alert by one
 * level rather than suppressing it entirely — the household still
 * gets a heads-up, just not a full emergency escalation, until
 * corroborating evidence arrives or the reading persists.
 *
 * AUDIO: per the reviewed Document 15 correction, V2 uses
 * PRE-RECORDED audio clips (one per hazard × escalation level ×
 * language), not live text-to-speech — this file only returns the
 * expected file path; actually playing it is a V2-B (physical pilot)
 * concern.
 */

const { ESCALATION_THRESHOLDS } = require("../data/hazardConfig");

// Below this confidence, a level is downgraded by one step.
// Provisional.
const LOW_CONFIDENCE_THRESHOLD = 0.4;

const LEVEL_ORDER = ["NORMAL", "INFO", "WARNING", "CRITICAL"];

function levelFromScore(score) {
  const match = ESCALATION_THRESHOLDS.find((t) => score >= t.min);
  return match.level;
}

function downgrade(level) {
  const idx = LEVEL_ORDER.indexOf(level);
  return LEVEL_ORDER[Math.max(0, idx - 1)];
}

/**
 * @param {string} category - e.g. "FIRE"
 * @param {{score: number, confidence: number}} evaluation
 * @param {string} language - "fr" | "en" | "sw" | "zh"
 * @returns {Object} the escalation decision + simulated alert plan
 */
function decideEscalation(category, evaluation, language = "fr") {
  const { score, confidence } = evaluation;
  let level = levelFromScore(score);

  const wasDowngraded = level !== "NORMAL" && confidence < LOW_CONFIDENCE_THRESHOLD;
  if (wasDowngraded) {
    level = downgrade(level);
  }

  const plan = buildAlertPlan(category, level, language);

  return {
    category,
    score,
    confidence,
    rawLevel: levelFromScore(score),
    finalLevel: level,
    downgradedForLowConfidence: wasDowngraded,
    alertPlan: plan,
  };
}

function buildAlertPlan(category, level, language) {
  if (level === "NORMAL") {
    return { channels: [], audioFile: null, note: "Silent monitoring, no alert." };
  }

  const audioFile = `/assets/audio/${language}/alert_${category.toLowerCase()}_${level.toLowerCase()}.mp3`;

  if (level === "INFO") {
    return {
      channels: ["LOG", "PUSH_DIGEST"],
      audioFile: null,
      note: "Logged; included in next periodic digest notification, no immediate interruption.",
    };
  }
  if (level === "WARNING") {
    return {
      channels: ["PUSH_NOTIFICATION", "LOCAL_AUDIO_PULSE"],
      audioFile,
      note: "Immediate push notification with guidance; single local audio pulse (not a loop).",
    };
  }
  // CRITICAL
  return {
    channels: ["PUSH_NOTIFICATION_HIGH_PRIORITY", "LOCAL_AUDIO_LOOP"],
    audioFile,
    note: "High-priority push; local audio alert repeats until acknowledged or resolved (escalation, not one-shot).",
  };
}

module.exports = { decideEscalation, levelFromScore, LOW_CONFIDENCE_THRESHOLD };
