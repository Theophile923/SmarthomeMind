/**
 * piAuth.js
 * -------------
 * Pi Network authentication using the foundational Pi SDK directly
 * (window.Pi), since this app has no bundler — see index.html for the
 * <script src="https://sdk.minepi.com/pi-sdk.js"> include this relies on.
 *
 * FLOW:
 * 1. Pi.init() — a Promise, must be fully awaited before anything else
 *    Pi-related is called.
 * 2. Pi.authenticate(["username"], onIncompletePaymentFound) — opens
 *    the Pi permission dialog, returns { accessToken, user }.
 * 3. The access token is sent to our backend (/api/verify-pi-token),
 *    which calls Pi's own /v2/me endpoint server-side to confirm the
 *    token is real. Authentication is only trusted once this
 *    server-side check passes — see api/verify-pi-token.js.
 *
 * SANDBOX: leave false for the real Pi Browser (Testnet or Mainnet).
 * Only set true when using Pi Browser's own developer sandbox mode.
 */

const PI_SDK_VERSION = "2.0";
const SANDBOX = false;
const VERIFY_ENDPOINT = "/api/verify-pi-token";

let piInitPromise = null;

function ensurePiInit() {
  if (typeof window.Pi === "undefined") {
    return Promise.reject(
      new Error("Pi SDK unavailable — this page must be opened inside the Pi Browser.")
    );
  }
  if (!piInitPromise) {
    piInitPromise = window.Pi.init({ version: PI_SDK_VERSION, sandbox: SANDBOX });
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
 * server-side verification. Throws on any failure — callers should
 * catch and show a friendly message rather than assume success.
 *
 * @returns {Promise<{username: string, uid: string}>}
 */
export async function signInWithPi() {
  await ensurePiInit();

  const authResult = await window.Pi.authenticate(["username"], onIncompletePaymentFound);
  if (!authResult || !authResult.accessToken || !authResult.user) {
    throw new Error("Pi authentication returned an unexpected result.");
  }

  const verification = await verifyAccessToken(authResult.accessToken);
  if (!verification.verified) {
    throw new Error(verification.reason || "Backend could not verify this Pi session.");
  }

  return { username: authResult.user.username, uid: authResult.user.uid };
}

/**
 * Sends the access token to our backend for verification against
 * Pi's own API. Never trusts the frontend token alone — this is the
 * server-side check that makes authentication actually meaningful.
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
    return await response.json(); // { verified: true/false, username, uid, reason? }
  } catch (err) {
    return { verified: false, reason: "Could not reach the verification server." };
  }
}

/** True if the Pi SDK script is present at all — does NOT mean the
 *  user is signed in, only that we're likely inside the Pi Browser. */
export function isPiBrowserAvailable() {
  return typeof window.Pi !== "undefined";
}
