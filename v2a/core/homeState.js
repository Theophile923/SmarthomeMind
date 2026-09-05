/**
 * homeState.js
 * ----------------
 * Tracks the home's current occupancy state: HOME, AWAY, NIGHT,
 * VACATION. The same sensor event can mean very different things
 * depending on this state — motion at 2am (NIGHT) is not the same
 * signal as motion at 2pm (HOME). See riskEngine.js for how this
 * modifies the INTRUSION category specifically.
 *
 * In the real V2-B pilot, this would be set automatically (time of
 * day + presence detection + a manual override). In this V2-A
 * simulation, scenarios set it explicitly so we can test each state
 * in isolation.
 */

const VALID_STATES = ["HOME", "AWAY", "NIGHT", "VACATION"];

class HomeState {
  constructor(initialState = "HOME") {
    this.setState(initialState);
    this.history = [{ state: this.current, atMs: Date.now() }];
  }

  setState(state) {
    if (!VALID_STATES.includes(state)) {
      throw new Error(`Invalid home state: "${state}". Must be one of ${VALID_STATES.join(", ")}`);
    }
    this.current = state;
  }

  get() {
    return this.current;
  }
}

module.exports = { HomeState, VALID_STATES };
