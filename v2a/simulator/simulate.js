#!/usr/bin/env node
/**
 * simulate.js
 * ---------------
 * Runs every scenario in scenarios.js through the risk engine and
 * prints what SHM would conclude — no hardware, no network, just the
 * reasoning logic. This is the whole point of V2-A: prove the
 * multi-sensor fusion hypothesis is sound BEFORE spending money on
 * sensors.
 *
 * HOW TO RUN:
 *   node simulator/simulate.js
 *
 * WHAT THE OUTPUT MEANS:
 * For each scenario, you'll see every hazard category's score (0–1),
 * confidence (0–1), and the final escalation decision after the
 * confidence check. A rough PASS/CHECK verdict is printed against
 * each scenario's stated expectation — but read this as "does this
 * look sane," not as a certified test suite. Every number involved is
 * a provisional target (see data/hazardConfig.js) meant to be tuned
 * once real sensors exist in V2-B.
 */

const { HomeState } = require("../core/homeState");
const { GuardianHealth } = require("../core/guardianHealth");
const { RiskEngine } = require("../core/riskEngine");
const { decideEscalation } = require("../core/escalation");
const { SCENARIOS } = require("./scenarios");

function runScenario(scenario) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`Scenario ${scenario.id}: ${scenario.name}`);
  console.log("=".repeat(70));

  if (scenario.deferredToV2B) {
    console.log("STATUS: DEFERRED TO V2-B (physical pilot)");
    console.log(`REASON: ${scenario.reason}`);
    return { id: scenario.id, deferred: true };
  }

  const homeState = new HomeState(scenario.homeState);
  const guardianHealth = new GuardianHealth();
  const engine = new RiskEngine(homeState, guardianHealth);

  for (const step of scenario.steps) {
    engine.ingestReading({
      sensorId: step.sensorId,
      locationId: step.locationOverride || scenario.location,
      metricType: step.metricType,
      value: step.value,
      timestampMs: step.timestampMs,
    });
  }

  // evalAtSeconds in each scenario is relative to the shared anchor
  // time used by scenarios.js's `s()` helper — recompute the same anchor here.
  const anchorMs = Date.parse("2026-01-01T00:00:00Z");
  const evalMs = anchorMs + scenario.evalAtSeconds * 1000;

  const locations = scenario.evalLocations || [scenario.location];
  const perLocationResults = {};

  for (const loc of locations) {
    const evaluation = engine.evaluateLocation(loc, evalMs);
    perLocationResults[loc] = evaluation;

    console.log(`\n  Location: ${loc}  (evaluated at t+${scenario.evalAtSeconds}s, HOME_STATE=${homeState.get()})`);
    for (const [category, result] of Object.entries(evaluation)) {
      if (result.score === 0 && result.confidence === 0) continue; // skip silent categories
      const decision = decideEscalation(category, result, "fr");
      console.log(
        `    ${category.padEnd(22)} score=${result.score.toFixed(3)}  confidence=${result.confidence.toFixed(3)}` +
          `  rawLevel=${decision.rawLevel}  finalLevel=${decision.finalLevel}` +
          `${decision.downgradedForLowConfidence ? "  (downgraded: low confidence)" : ""}`
      );
      if (decision.finalLevel !== "NORMAL") {
        console.log(`      -> channels: [${decision.alertPlan.channels.join(", ")}]  audio: ${decision.alertPlan.audioFile || "n/a"}`);
      }
    }
  }

  if (scenario.checkGuardianHealthFor) {
    const status = guardianHealth.getSensorStatus(scenario.checkGuardianHealthFor, evalMs);
    console.log(`\n  Guardian Health for "${scenario.checkGuardianHealthFor}": ${status}`);
  }

  console.log(`\n  Expectation: ${scenario.expectation}`);

  return { id: scenario.id, deferred: false, perLocationResults };
}

function main() {
  console.log("SmartHomeMind V2-A — Simulation Engine");
  console.log("Every scenario below is run through the real fusion logic (no mocked results).\n");

  const allResults = SCENARIOS.map(runScenario);

  const testedCount = allResults.filter((r) => !r.deferred).length;
  const deferredCount = allResults.filter((r) => r.deferred).length;

  console.log(`\n${"=".repeat(70)}`);
  console.log(`Done. ${testedCount} scenarios evaluated, ${deferredCount} deferred to V2-B.`);
  console.log("Review each scenario's output against its stated expectation above.");
  console.log("=".repeat(70));
}

main();
