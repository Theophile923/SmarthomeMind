/**
 * verify-pi-token.js
 * ----------------------
 * Vercel serverless function (Node.js). Exchanges a Pi access token
 * with Pi App Studio's own login endpoint — per App Studio's exact
 * integration spec, apps must NEVER call the Pi Platform's /v2/me
 * directly to authenticate a user. Instead, every app exchanges the
 * token with App Studio, which checks it against the real Pi Platform
 * and returns the only identity (uid/username) the app may trust.
 *
 * This runs server-side (not in the browser) because App Studio's own
 * instructions say the exchange must happen wherever the app decides
 * what a user is allowed to do — for SmartHomeMind, that's here, in
 * our backend, which then hands back a verified result to the
 * frontend (js/core/piAuth.js).
 *
 * DEPLOYMENT: Vercel automatically turns any file in /api/ into a
 * live endpoint — this file becomes POST /api/verify-pi-token with no
 * extra configuration needed.
 */

const APP_STUDIO_LOGIN_URL =
  "https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com/pi/auth/v1/login";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ verified: false, reason: "Method not allowed" });
    return;
  }

  const { accessToken } = req.body || {};
  if (!accessToken || typeof accessToken !== "string") {
    res.status(400).json({ verified: false, reason: "Missing accessToken" });
    return;
  }

  try {
    const appStudioResponse = await fetch(APP_STUDIO_LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });

    if (!appStudioResponse.ok) {
      res.status(200).json({
        verified: false,
        reason: `App Studio login returned ${appStudioResponse.status}`,
      });
      return;
    }

    const data = await appStudioResponse.json(); // { sessionToken, user: { uid, username } }
    if (!data || !data.user) {
      res.status(200).json({ verified: false, reason: "App Studio response was missing user data" });
      return;
    }

    res.status(200).json({
      verified: true,
      sessionToken: data.sessionToken,
      uid: data.user.uid,
      username: data.user.username,
    });
  } catch (err) {
    res.status(200).json({ verified: false, reason: "Could not reach Pi App Studio" });
  }
}