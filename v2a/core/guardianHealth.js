/**
 * guardianHealth.js
 * ---------------------
 * SHM cannot claim to protect a house if it doesn't know whether its
 * own sensing system is working. This module tracks, per sensor, when
 * it was last heard from — and flags it DEGRADED if it goes silent
 * longer than expected.
 *
 * This directly feeds into confidence in riskEngine.js: a hazard
 * reading from a sensor that's borderline overdue for its heartbeat
 * is treated as less trustworthy than one from a sensor reporting
 * normally.
 *
 * WHAT'S SIMULATED HERE (not yet in scope): battery level, hub
 * status, speaker status, internet availability. Those are real V2-B
 * (physical pilot) concerns — this V2-A file focuses on the piece
 * that's fully testable without hardware: "have we heard from this
 * sensor recently enough to trust it?"
 */

// How long (seconds) a sensor can go silent before we consider it
// DEGRADED rather than trustworthy. Provisional — a real sensor's
// expected heartbeat interval should set this per-device in V2-B.
const DEFAULT_STALE_AFTER_SECONDS = 300; // 5 minutes

class GuardianHealth {
  constructor(staleAfterSeconds = DEFAULT_STALE_AFTER_SECONDS) {
    this.staleAfterSeconds = staleAfterSeconds;
    this.lastSeenBySensor = new Map(); // sensorId -> timestampMs
  }

  /** Call this every time a reading arrives from a sensor. */
  recordHeartbeat(sensorId, timestampMs) {
    const prev = this.lastSeenBySensor.get(sensorId);
    if (!prev || timestampMs > prev) {
      this.lastSeenBySensor.set(sensorId, timestampMs);
    }
  }

  /** Returns "OK" or "DEGRADED" for one sensor, as of `nowMs`. */
  getSensorStatus(sensorId, nowMs) {
    const lastSeen = this.lastSeenBySensor.get(sensorId);
    if (lastSeen === undefined) return "UNKNOWN"; // never heard from
    const ageSeconds = (nowMs - lastSeen) / 1000;
    return ageSeconds > this.staleAfterSeconds ? "DEGRADED" : "OK";
  }

  /** A 0–1 multiplier applied to that sensor's contribution to
   *  confidence. OK sensors contribute fully; DEGRADED/UNKNOWN ones
   *  are heavily discounted, but not zeroed — a degraded sensor's
   *  last reading is still *some* evidence, just weaker. */
  getSensorConfidenceFactor(sensorId, nowMs) {
    const status = this.getSensorStatus(sensorId, nowMs);
    if (status === "OK") return 1.0;
    if (status === "DEGRADED") return 0.4;
    return 0.2; // UNKNOWN — never confirmed working at all
  }

  /** Overall system health summary — useful for a "guardian status"
   *  screen, and for deciding whether to warn the owner that
   *  protection may be reduced. */
  getSystemSummary(allKnownSensorIds, nowMs) {
    const statuses = allKnownSensorIds.map((id) => ({
      sensorId: id,
      status: this.getSensorStatus(id, nowMs),
    }));
    const degraded = statuses.filter((s) => s.status !== "OK");
    return {
      totalSensors: allKnownSensorIds.length,
      degradedCount: degraded.length,
      degradedSensors: degraded.map((s) => s.sensorId),
      overall: degraded.length === 0 ? "HEALTHY" : "DEGRADED",
    };
  }
}

module.exports = { GuardianHealth, DEFAULT_STALE_AFTER_SECONDS };
