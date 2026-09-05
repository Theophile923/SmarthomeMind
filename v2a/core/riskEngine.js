/**
 * riskEngine.js
 * -----------------
 * The real-time multi-sensor fusion engine. This is architecturally
 * SEPARATE from the V1 questionnaire scoring engine (DynamicRiskEngine.js
 * in the SmartHomeMind V1 app) — V1 answers "how safe is this house
 * structurally, in general?" from a one-time questionnaire. This file
 * answers "what is happening in this house RIGHT NOW?" from a
 * continuous stream of sensor events. They share a conceptual lineage
 * (weighted category scoring, critical overrides) but are different
 * code, on purpose — see the strategic analysis for why.
 *
 * PIPELINE THIS IMPLEMENTS:
 *   SENSE (ingestReading) → UNDERSTAND/ASSESS (evaluateLocation) →
 *   DECIDE (the risk+confidence pair) → ESCALATE (escalation.js)
 *
 * KEY IDEA — RISK vs CONFIDENCE, KEPT SEPARATE:
 * A single smoke sensor briefly triggering is HIGH RISK but LOW
 * CONFIDENCE (could be burnt toast). Smoke + a fast temperature rise
 * together is HIGH RISK and HIGH CONFIDENCE. These should not produce
 * the same response — see escalation.js for how the two combine.
 */

const { computeDecay } = require("./decay");
const {
  METRIC_CONFIG,
  HAZARD_CATEGORIES,
  SINGLE_SIGNAL_CONFIDENCE_CAP,
} = require("../data/hazardConfig");

// How far back (seconds) we look when computing temperature velocity
// (rate of rise). Provisional.
const VELOCITY_WINDOW_SECONDS = 180;
// Below this rate (°C/min), we treat the rise as noise, not signal.
const VELOCITY_NOISE_FLOOR = 0.5;
// Rate of rise at which velocity normalization saturates to 1.0.
const VELOCITY_SATURATION = 5.0;

// Absolute temperature normalization for ELECTRICAL_OVERHEATING —
// "normal" up to this, saturates to 1.0 at the upper bound.
// Provisional, and should really be per-location (a garage runs
// hotter than a bedroom) once real baselines exist.
const TEMP_ABS_NORMAL_C = 40;
const TEMP_ABS_SATURATION_C = 80;

// How motion is weighted by home state before decay/weight are
// applied — motion while HOME is expected; motion while AWAY is not.
// Provisional.
const MOTION_HOME_STATE_INTENSITY = {
  HOME: 0.05,
  NIGHT: 0.5,
  AWAY: 0.9,
  VACATION: 1.0,
};

class RiskEngine {
  constructor(homeState, guardianHealth) {
    this.homeState = homeState;
    this.guardianHealth = guardianHealth;
    // sensorId -> array of { value, timestampMs, metricType, locationId }
    this.history = new Map();
  }

  ingestReading(reading) {
    const { sensorId, timestampMs } = reading;
    if (!this.history.has(sensorId)) this.history.set(sensorId, []);
    this.history.get(sensorId).push(reading);
    this.guardianHealth.recordHeartbeat(sensorId, timestampMs);
  }

  /** Rate of temperature rise in °C/min for one sensor, using the
   *  configured trailing window. Returns 0 if insufficient data or
   *  the rise is within the noise floor. */
  computeTemperatureVelocity(sensorId, nowMs) {
    const readings = (this.history.get(sensorId) || []).filter(
      (r) => r.metricType === "temperature" && nowMs - r.timestampMs <= VELOCITY_WINDOW_SECONDS * 1000
    );
    if (readings.length < 2) return 0;
    const first = readings[0];
    const last = readings[readings.length - 1];
    const minutesElapsed = (last.timestampMs - first.timestampMs) / 60000;
    if (minutesElapsed <= 0) return 0;
    const rate = (last.value - first.value) / minutesElapsed;
    return Math.max(0, rate); // only rising temperature counts as risk here
  }

  /** Normalizes a raw metric value + type into a 0–1 "how abnormal is
   *  this" intensity, independent of weight/decay/confidence. */
  normalizeIntensity(reading, nowMs) {
    switch (reading.metricType) {
      case "smoke":
      case "water_leak":
        return reading.value ? 1 : 0; // boolean sensors
      case "co":
        return Math.min(1, Math.max(0, reading.value)); // assume already 0–1 normalized ppm
      case "motion": {
        const state = this.homeState.get();
        return reading.value ? MOTION_HOME_STATE_INTENSITY[state] ?? 0.3 : 0;
      }
      case "temperature_velocity_derived": {
        const v = reading.value; // °C/min, already computed
        if (v < VELOCITY_NOISE_FLOOR) return 0;
        return Math.min(1, v / VELOCITY_SATURATION);
      }
      case "temperature_absolute_derived": {
        const t = reading.value;
        if (t < TEMP_ABS_NORMAL_C) return 0;
        return Math.min(1, (t - TEMP_ABS_NORMAL_C) / (TEMP_ABS_SATURATION_C - TEMP_ABS_NORMAL_C));
      }
      default:
        return 0;
    }
  }

  /** Full evaluation for one location: risk + confidence per hazard
   *  category, plus which category is currently most urgent. */
  evaluateLocation(locationId, nowMs = Date.now()) {
    const results = {};

    for (const [category, metricTypes] of Object.entries(HAZARD_CATEGORIES)) {
      let score = 0;
      const contributingFactors = [];
      const corroboratingTypes = new Set();

      for (const metricType of metricTypes) {
        const config = METRIC_CONFIG[metricType];
        if (!config) continue;

        // Build the set of "effective readings" to consider for this
        // metric type at this location, including derived readings
        // (velocity, absolute-temp) computed on the fly.
        const effectiveReadings = this._getEffectiveReadings(metricType, locationId, nowMs);

        for (const eff of effectiveReadings) {
          const ageSeconds = (nowMs - eff.timestampMs) / 1000;
          const decay = computeDecay(ageSeconds, config.halfLifeSeconds);
          const intensity = this.normalizeIntensity(eff, nowMs);
          if (intensity <= 0) continue;

          const healthFactor = this.guardianHealth.getSensorConfidenceFactor(eff.sensorId, nowMs);
          const contribution = intensity * config.weight * decay * healthFactor;

          if (contribution > 0) {
            score += contribution;
            corroboratingTypes.add(metricType);
            contributingFactors.push({
              sensorId: eff.sensorId,
              metricType,
              intensity: round3(intensity),
              decay: round3(decay),
              healthFactor,
              contribution: round3(contribution),
            });
          }
        }
      }

      score = Math.min(1, round3(score));

      // Confidence: scales with how many independent metric types
      // corroborate each other, and the average freshness/health of
      // the evidence. A single-signal category is capped, per
      // SINGLE_SIGNAL_CONFIDENCE_CAP.
      let confidence = 0;
      if (contributingFactors.length > 0) {
        const avgFreshnessHealth =
          contributingFactors.reduce((sum, f) => sum + f.decay * f.healthFactor, 0) /
          contributingFactors.length;
        const corroborationBoost = Math.min(1, corroboratingTypes.size / metricTypes.length);
        confidence = avgFreshnessHealth * (0.5 + 0.5 * corroborationBoost);
        if (corroboratingTypes.size <= 1) {
          confidence = Math.min(confidence, SINGLE_SIGNAL_CONFIDENCE_CAP);
        }
      }
      confidence = round3(Math.min(1, confidence));

      results[category] = { score, confidence, contributingFactors };
    }

    return results;
  }

  /** For a given metric type, returns the readings to actually score
   *  — for raw metrics (smoke, co, water_leak, motion) this is just
   *  the latest reading per sensor at that location. For derived
   *  metrics (temperature_velocity, temperature_absolute) it computes
   *  them on the fly from temperature history. */
  _getEffectiveReadings(metricType, locationId, nowMs) {
    if (metricType === "temperature_velocity") {
      return this._latestPerSensor("temperature", locationId)
        .map((r) => {
          const velocity = this.computeTemperatureVelocity(r.sensorId, nowMs);
          return { ...r, metricType: "temperature_velocity_derived", value: velocity };
        })
        .filter((r) => r);
    }
    if (metricType === "temperature_absolute") {
      return this._latestPerSensor("temperature", locationId).map((r) => ({
        ...r,
        metricType: "temperature_absolute_derived",
        value: r.value,
      }));
    }
    return this._latestPerSensor(metricType, locationId);
  }

  /** Latest reading per sensor, for a given metric type + location. */
  _latestPerSensor(metricType, locationId) {
    const bySensor = new Map();
    for (const [sensorId, readings] of this.history.entries()) {
      const matching = readings.filter(
        (r) => r.metricType === metricType && r.locationId === locationId
      );
      if (matching.length === 0) continue;
      const latest = matching[matching.length - 1];
      bySensor.set(sensorId, latest);
    }
    return Array.from(bySensor.values());
  }
}

function round3(n) {
  return Math.round(n * 1000) / 1000;
}

module.exports = { RiskEngine };
