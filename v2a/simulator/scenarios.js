/**
 * scenarios.js
 * ----------------
 * The 15 test situations from the strategic review (Document 14,
 * Correction 6) — testing whether SHM understands a HOUSE SITUATION,
 * not just whether one isolated sensor fired.
 *
 * HONESTY NOTE: two of the original 15 (Internet failure, and Owner
 * response/verification) are NOT meaningfully testable by this V2-A
 * software engine alone — they depend on real alert-delivery
 * infrastructure and a human-in-the-loop interaction that only exist
 * in V2-B (the physical pilot). Rather than fake a result for those
 * two, they're included here as explicitly "DEFERRED TO V2-B" so nothing
 * is silently glossed over.
 *
 * Each scenario is a sequence of sensor readings with relative
 * timestamps (seconds from scenario start). `expectation` is a
 * human-readable description of what SHOULD happen — used by
 * simulate.js to print a rough PASS/CHECK/FAIL, but treat this as a
 * sanity check, not a certified test suite.
 */

const BASE_TIME_MS = Date.parse("2026-01-01T00:00:00Z");
const s = (seconds) => BASE_TIME_MS + seconds * 1000;

const SCENARIOS = [
  {
    id: 1,
    name: "Normal temperature",
    homeState: "HOME",
    location: "kitchen",
    steps: [
      { sensorId: "temp_kitchen_01", metricType: "temperature", value: 22, timestampMs: s(0) },
      { sensorId: "temp_kitchen_01", metricType: "temperature", value: 22.3, timestampMs: s(60) },
    ],
    evalAtSeconds: 60,
    expectation: "Should stay NORMAL — no hazard categories should fire.",
  },
  {
    id: 2,
    name: "Gradually increasing temperature",
    homeState: "HOME",
    location: "kitchen",
    steps: [
      { sensorId: "temp_kitchen_01", metricType: "temperature", value: 22, timestampMs: s(0) },
      { sensorId: "temp_kitchen_01", metricType: "temperature", value: 24, timestampMs: s(180) },
    ],
    evalAtSeconds: 180,
    expectation: "Slow rise (~0.67°C/min) should stay below the noise floor — NORMAL or low INFO at most.",
  },
  {
    id: 3,
    name: "Rapid temperature increase (no smoke)",
    homeState: "HOME",
    location: "garage",
    steps: [
      { sensorId: "temp_garage_01", metricType: "temperature", value: 25, timestampMs: s(0) },
      { sensorId: "temp_garage_01", metricType: "temperature", value: 40, timestampMs: s(120) },
    ],
    evalAtSeconds: 120,
    expectation: "Fast rise (7.5°C/min), no smoke — should raise FIRE some (velocity-only, single signal, capped confidence) and/or ELECTRICAL_OVERHEATING if absolute temp is also high.",
  },
  {
    id: 4,
    name: "Water leak",
    homeState: "HOME",
    location: "bathroom",
    steps: [{ sensorId: "leak_bathroom_01", metricType: "water_leak", value: 1, timestampMs: s(0) }],
    evalAtSeconds: 10,
    expectation: "WATER category should rise — single signal, so confidence capped, but score meaningful given water_leak's high weight.",
  },
  {
    id: 5,
    name: "Smoke detection alone",
    homeState: "HOME",
    location: "kitchen",
    steps: [{ sensorId: "smoke_kitchen_01", metricType: "smoke", value: 1, timestampMs: s(0) }],
    evalAtSeconds: 5,
    expectation: "FIRE category should rise sharply, but single-signal confidence cap applies — WARNING more likely than confirmed CRITICAL alone.",
  },
  {
    id: 6,
    name: "Smoke + rapid temperature increase (the key differentiator case)",
    homeState: "HOME",
    location: "kitchen",
    steps: [
      { sensorId: "temp_kitchen_01", metricType: "temperature", value: 22, timestampMs: s(0) },
      { sensorId: "temp_kitchen_01", metricType: "temperature", value: 35, timestampMs: s(90) },
      { sensorId: "smoke_kitchen_01", metricType: "smoke", value: 1, timestampMs: s(90) },
    ],
    evalAtSeconds: 90,
    expectation: "FIRE should be CRITICAL with HIGH confidence — two corroborating signal types, this is the case that should look meaningfully different from smoke alone (scenario 5).",
  },
  {
    id: 7,
    name: "Motion while HOME",
    homeState: "HOME",
    location: "living_room",
    steps: [{ sensorId: "motion_living_01", metricType: "motion", value: 1, timestampMs: s(0) }],
    evalAtSeconds: 5,
    expectation: "INTRUSION should stay NORMAL/near-zero — motion while HOME is expected.",
  },
  {
    id: 8,
    name: "Motion while AWAY",
    homeState: "AWAY",
    location: "living_room",
    steps: [{ sensorId: "motion_living_01", metricType: "motion", value: 1, timestampMs: s(0) }],
    evalAtSeconds: 5,
    expectation: "INTRUSION should rise meaningfully — same sensor event, different meaning due to HOME_STATE.",
  },
  {
    id: 9,
    name: "Isolated false sensor signal (single brief blip)",
    homeState: "HOME",
    location: "kitchen",
    steps: [
      { sensorId: "smoke_kitchen_01", metricType: "smoke", value: 1, timestampMs: s(0) },
      { sensorId: "smoke_kitchen_01", metricType: "smoke", value: 0, timestampMs: s(15) },
    ],
    evalAtSeconds: 400, // evaluated well after the blip, decay should have taken effect
    expectation: "By the time we evaluate 400s later, decay should have reduced this near zero — should NOT still read as CRITICAL.",
  },
  {
    id: 10,
    name: "Conflicting sensor signals (smoke sensor says yes, no temperature change)",
    homeState: "HOME",
    location: "kitchen",
    steps: [
      { sensorId: "temp_kitchen_01", metricType: "temperature", value: 22, timestampMs: s(0) },
      { sensorId: "temp_kitchen_01", metricType: "temperature", value: 22.1, timestampMs: s(90) },
      { sensorId: "smoke_kitchen_01", metricType: "smoke", value: 1, timestampMs: s(90) },
    ],
    evalAtSeconds: 90,
    expectation: "FIRE should rise (smoke is real evidence) but confidence should be lower than scenario 6 — temperature isn't corroborating.",
  },
  {
    id: 11,
    name: "Sensor offline (Guardian Health)",
    homeState: "HOME",
    location: "bathroom",
    steps: [
      { sensorId: "leak_bathroom_01", metricType: "water_leak", value: 1, timestampMs: s(0) },
      // no further heartbeats from this sensor — simulate it going silent
    ],
    evalAtSeconds: 700, // well past the 300s staleness threshold
    expectation: "By 700s, this sensor should show DEGRADED in Guardian Health, and its contribution to WATER confidence should be discounted accordingly.",
    checkGuardianHealthFor: "leak_bathroom_01",
  },
  {
    id: 12,
    name: "Internet failure",
    deferredToV2B: true,
    reason: "Alert *delivery* over the network (push notifications) isn't modeled in this local-only simulation — there's no network layer to fail. Meaningful only once V2-B has a real delivery pipeline to test resilience against.",
  },
  {
    id: 13,
    name: "Multiple simultaneous anomalies",
    homeState: "AWAY",
    location: "kitchen",
    steps: [
      { sensorId: "temp_kitchen_01", metricType: "temperature", value: 22, timestampMs: s(0) },
      { sensorId: "temp_kitchen_01", metricType: "temperature", value: 34, timestampMs: s(90) },
      { sensorId: "smoke_kitchen_01", metricType: "smoke", value: 1, timestampMs: s(90) },
      { sensorId: "motion_living_01", metricType: "motion", value: 1, timestampMs: s(90), locationOverride: "living_room" },
    ],
    evalAtSeconds: 90,
    evalLocations: ["kitchen", "living_room"],
    expectation: "FIRE (kitchen) should be CRITICAL/high-confidence; INTRUSION (living_room, AWAY) should also rise — two independent, unrelated hazards at once, engine should report both, not merge them.",
  },
  {
    id: 14,
    name: "Recovery after an anomaly",
    homeState: "HOME",
    location: "kitchen",
    steps: [
      { sensorId: "smoke_kitchen_01", metricType: "smoke", value: 1, timestampMs: s(0) },
      { sensorId: "smoke_kitchen_01", metricType: "smoke", value: 0, timestampMs: s(30) },
    ],
    evalAtSeconds: 500, // long after, decay should show recovery
    expectation: "Score should decay back down over time — evaluated well after the event, FIRE should read back near NORMAL, demonstrating the system 'notices' recovery via decay rather than staying stuck on old evidence.",
  },
  {
    id: 15,
    name: "Owner response followed by verification",
    deferredToV2B: true,
    reason: "Requires a real interaction loop (owner acknowledges an alert, system verifies the hazard cleared) that doesn't exist without a UI and a human — not something a headless simulation can meaningfully test.",
  },
];

module.exports = { SCENARIOS };
