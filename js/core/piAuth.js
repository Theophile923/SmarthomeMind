/**
 * piAuth.js
 * -------------
 * Pi Network authentication using the foundational Pi SDK directly
 * (window.Pi), since this app has no bundler — see index.html for the
 * <script src="https://sdk.minepi.com/pi-sdk.js"> include this relies on.
 *
 * FLOW (per Pi App Studio's exact integration spec):
 * 1. Pi.init({ version: "2.0" }) — a Promise, must be fully awaited
 *    before anything else Pi-related is called. No "sandbox" param —
 *    Pi App Studio detects that automatically now.
 * 2. Pi.authenticate(["username"], onIncompletePaymentFound) — opens
 *    the Pi permission dialog, returns { accessToken, user }. The
 *    accessToken is kept; uid/username from THIS step are never
 *    trusted (the browser could tamper with them).
 * 3. The access token is exchanged with Pi App Studio's own backend
 *    (via our /api/verify-pi-token, which forwards it server-side —
 *    see api/verify-pi-token.js). App Studio checks the token against
 *    the real Pi Platform and returns the trustworthy uid/username —
 *    THOSE are what this module returns, never the raw browser-side
 *    ones from step 2.
 */

const PI_SDK_VERSION = "2.0";
const VERIFY_ENDPOINT = "/api/verify-pi-token";

let piInitPromise = null;

function ensurePiInit() {
  if (typeof window.Pi === "undefined") {
    return Promise.reject(
      new Error("Pi SDK unavailable — this page must be opened inside the Pi Browser.")
    );
  }
  if (!piInitPromise) {
    // No "sandbox" param — Pi App Studio's current spec says it's
    // auto-detected now, and passing it is no longer correct.
    piInitPromise = window.Pi.init({ version: PI_SDK_VERSION });
  }
  return piInitPromise;
}

function onIncompletePaymentFound(payment) {
  // SmartHomeMind doesn't currently create payments, so this should
  // rarely fire — logged for visibility if it ever does.
  console.warn("[PiAuth] Incomplete payment found:", payment);
}

/**
 * Runs the full sign-in flow: Pi SDK init -> Pi.authenticate() ->
 * exchange with Pi App Studio via our backend. Throws on any failure
 * — callers should catch and show a friendly message.
 *
 * @returns {Promise<{username: string, uid: string, sessionToken: string}>}
 */
export async function signInWithPi() {
  await ensurePiInit();

  const authResult = await window.Pi.authenticate(["username"], onIncompletePaymentFound);
  if (!authResult || !authResult.accessToken) {
    throw new Error("Pi authentication returned an unexpected result.");
  }

  const verification = await verifyAccessToken(authResult.accessToken);
  if (!verification.verified) {
    throw new Error(verification.reason || "App Studio could not verify this Pi session.");
  }

  // Trust ONLY the identity App Studio itself confirmed — never the
  // raw authResult.user from step 2, which the end user's browser
  // could tamper with.
  return {
    username: verification.username,
    uid: verification.uid,
    sessionToken: verification.sessionToken,
  };
}

/**
 * Sends the access token to OUR backend, which exchanges it with Pi
 * App Studio's login endpoint server-side. Never trusts the frontend
 * token alone, and never calls Pi's /v2/me directly per App Studio's
 * own instructions — the exchange must go through App Studio so user
 * records and app verification stay consistent.
 */
async function verifyAccessToken(accessToken) {
  try {
    const response = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });
    if (!response.ok) {
      return { verified: false, reason: `Verification server returned ${response.status}` };
    }
    return await response.json(); // { verified, sessionToken, uid, username, reason? }
  } catch (err) {
    return { verified: false, reason: "Could not reach the verification server." };
  }
}

/** True if the Pi SDK script is present at all — does NOT mean the
 *  user is signed in, only that we're likely inside the Pi Browser. */
export function isPiBrowserAvailable() {
  return typeof window.Pi !== "undefined";
}