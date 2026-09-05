/**
 * decay.js
 * ------------
 * A single pure function: given how old a reading is, and the
 * half-life for its metric type, how much "weight" does it still
 * carry? Uses standard exponential half-life decay.
 *
 * At age = 0, decay = 1.0 (full weight).
 * At age = halfLife, decay = 0.5 (half weight).
 * At age = 2 * halfLife, decay = 0.25, and so on.
 *
 * WHY PER-METRIC HALF-LIVES MATTER: a smoke spike that isn't
 * sustained should stop mattering within a minute or two — but a
 * water leak reading from 5 minutes ago is still very relevant. Using
 * one global half-life for everything (as an earlier draft did) would
 * get this wrong for one hazard type or the other. See
 * data/hazardConfig.js for the per-metric values.
 */

function computeDecay(ageSeconds, halfLifeSeconds) {
  if (ageSeconds < 0) return 1.0; // guard against clock skew
  return Math.pow(0.5, ageSeconds / halfLifeSeconds);
}

module.exports = { computeDecay };
