/**
 * hazardConfig.js
 * -------------------
 * ⚠️ EVERY NUMBER IN THIS FILE IS A PROVISIONAL ENGINEERING TARGET,
 * NOT A PROVEN VALUE. Weights, half-lives, and thresholds are
 * reasonable starting guesses to make the engine testable — they are
 * meant to be tuned against real sensor behavior once V2-B (the
 * physical pilot) exists. Treat every constant here as "best guess,
 * pending calibration."
 *
 * WHAT THIS FILE DEFINES:
 * - The five hazard categories for the pilot (FIRE, GAS, WATER,
 *   INTRUSION, ELECTRICAL_OVERHEATING).
 * - Which metric types feed each hazard, with a weight (how much a
 *   fully-fresh reading of that metric contributes) and a half-life
 *   in seconds (how fast an old reading stops counting — SHORT for
 *   fast-moving dangers like smoke, LONG for slow ones like a leak).
 */

// Half-lives are intentionally different per metric — a single global
// decay constant would decay a slow water leak just as fast as a
// smoke spike, which is wrong.
const METRIC_CONFIG = {
  smoke: { weight: 0.5, halfLifeSeconds: 60 },
  co: { weight: 0.5, halfLifeSeconds: 180 },
  water_leak: { weight: 0.4, halfLifeSeconds: 600 },
  temperature_velocity: { weight: 0.35, halfLifeSeconds: 120 },
  temperature_absolute: { weight: 0.3, halfLifeSeconds: 300 },
  motion: { weight: 0.3, halfLifeSeconds: 90 },
};

// A metric can feed more than one category — temperature_velocity
// feeds both FIRE and ELECTRICAL_OVERHEATING, distinguished by
// whether smoke is ALSO present (see riskEngine.js).
const HAZARD_CATEGORIES = {
  FIRE: ["smoke", "temperature_velocity"],
  GAS: ["co"],
  WATER: ["water_leak"],
  INTRUSION: ["motion"],
  ELECTRICAL_OVERHEATING: ["temperature_absolute"],
};

// Escalation thresholds on the FINAL fused score (0.0–1.0). Provisional.
const ESCALATION_THRESHOLDS = [
  { min: 0.8, level: "CRITICAL" },
  { min: 0.5, level: "WARNING" },
  { min: 0.2, level: "INFO" },
  { min: 0, level: "NORMAL" },
];

// Confidence cap when only ONE signal type supports a reading, vs.
// multiple independent signal types corroborating each other (e.g.
// smoke + rising temperature together = higher confidence than smoke
// alone). Provisional.
const SINGLE_SIGNAL_CONFIDENCE_CAP = 0.6;

module.exports = {
  METRIC_CONFIG,
  HAZARD_CATEGORIES,
  ESCALATION_THRESHOLDS,
  SINGLE_SIGNAL_CONFIDENCE_CAP,
};
