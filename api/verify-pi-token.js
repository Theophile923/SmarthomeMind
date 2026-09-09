/**
 * verify-pi-token.js
 * ----------------------
 * Vercel serverless function (Node.js). Receives a Pi access token
 * from the frontend and verifies it is real by calling Pi's own API
 * — the frontend alone must never be trusted to say "this user is
 * authenticated," since a token claim from the browser could be
 * faked. This is the piece that was missing before SmartHomeMind had
 * any backend at all.
 *
 * No Pi Network API key is required for this specific check: per
 * Pi's own documentation, GET https://api.minepi.com/v2/me with the
 * user's own access token as a Bearer credential is enough to confirm
 * the token is valid and to retrieve the associated username/uid.
 *
 * DEPLOYMENT: Vercel automatically turns any file in /api/ into a
 * live endpoint — this file becomes POST /api/verify-pi-token with no
 * extra configuration needed.
 */

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
    const piResponse = await fetch("https://api.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!piResponse.ok) {
      res.status(200).json({ verified: false, reason: `Pi API returned ${piResponse.status}` });
      return;
    }

    const piUser = await piResponse.json(); // { uid, username, ... }
    res.status(200).json({ verified: true, uid: piUser.uid, username: piUser.username });
  } catch (err) {
    res.status(200).json({ verified: false, reason: "Could not reach Pi Network API" });
  }
}