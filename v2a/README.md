# SmartHomeMind V2-A — Simulation Engine (JavaScript)

The real-time multi-sensor reasoning engine for SmartHomeMind's "Intelligent
Home Guardian" pivot — tested entirely in software, with **zero hardware**,
before any money is spent on sensors. This is deliberately separate from
the SmartHomeMind V1 PWA (the questionnaire app) — see the file headers
for why.

## How to run it

Requires Node.js (already used for the V1 tests).

```bash
node simulator/simulate.js
```

No install step, no dependencies — pure Node.js, nothing to `npm install`.

## What you're looking at

- `core/homeState.js` — HOME / AWAY / NIGHT / VACATION tracking
- `core/decay.js` — the exponential time-decay math (one function)
- `core/guardianHealth.js` — tracks whether SHM's own sensors are alive
- `core/riskEngine.js` — the fusion engine: turns raw sensor readings
  into a risk score + confidence score per hazard category
- `core/escalation.js` — turns (score, confidence) into a final alert
  level and a simulated alert plan (channels, audio file reference)
- `data/hazardConfig.js` — **every number here is a provisional guess**,
  meant to be tuned once real sensors exist (see below)
- `simulator/scenarios.js` — the 15 test situations from the strategic
  review, encoded as data
- `simulator/simulate.js` — runs every scenario and prints the results

## ⚠️ Everything numeric is provisional

Weights, decay half-lives, escalation thresholds, confidence caps — all
of it is a reasonable starting guess to make the engine testable, not a
proven value. `data/hazardConfig.js` says this in its own header too.
Expect to change these numbers once you're watching real sensor data
from your own house in V2-B.

## First calibration findings from this run

Running the 15 scenarios already surfaced two things worth knowing
before you touch hardware:

1. **A single smoke reading alone currently lands at INFO, not
   WARNING** (score 0.47, just under the 0.5 WARNING threshold). If you
   want one working smoke detector alone to raise more than a silent
   log entry, either raise `smoke`'s weight in `hazardConfig.js` or
   lower the WARNING threshold — your call, this is exactly the kind
   of tuning decision the simulation exists to surface cheaply.
2. **Recovery from a false alarm happens mainly because the sensor
   reports an explicit "back to 0," not primarily through decay.**
   Decay matters most for sensors that go silent without ever sending
   an "all clear" — worth remembering when choosing real sensors for
   V2-B: prefer ones that actively report "clear" states, not just
   "triggered" events.

## What's intentionally NOT here

Two of the original 15 test scenarios (Internet failure, and Owner
response/verification) are marked `deferredToV2B` in `scenarios.js` —
they need real network delivery and a real human-in-the-loop, which a
headless simulation can't meaningfully fake. Better to say so than
pretend they were tested.

Also not here: pre-recorded audio files themselves (only file *paths*
are referenced), MQTT/Home Assistant integration, any physical
actuation code (none exists, by design — SHM never controls valves,
locks, or breakers).

## Next steps

1. Read through `simulator/simulate.js`'s output and challenge whether
   each result "feels right" to you — you know the house better than
   any config file does.
2. Adjust `data/hazardConfig.js` weights/thresholds based on what you
   see, re-run, repeat.
3. Add your own scenarios to `scenarios.js` for situations specific to
   your house.
4. Only once you're satisfied the reasoning is sound — move to V2-B.
