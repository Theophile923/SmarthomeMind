/**
 * service-worker.js
 * ----------------------
 * Makes SmartHomeMind work with NO internet connection after the first
 * visit — important in contexts with unreliable connectivity.
 *
 * STRATEGY IN PLAIN TERMS ("network first, cache as a safety net"):
 * - When you're online, every file is fetched fresh from the network,
 *   and a copy is saved in the browser's Cache Storage.
 * - When you're offline, the saved copy is used instead, so the app
 *   still opens and works.
 * This means updates reach users automatically — no need to remember to
 * bump CACHE_VERSION after every change (the old "cache first" strategy
 * needed that, and forgetting it left users on stale pages).
 *
 * CACHE_VERSION is now only used to clear out very old caches when the
 * list of files changes in a big way.
 *
 * WHAT IS NEVER TOUCHED: requests to other websites (the Pi SDK, Pi
 * servers) and our own /api/ backend calls — those must always go
 * straight to the network.
 */

const CACHE_VERSION = "v6";
const CACHE_NAME = `smarthomemind-${CACHE_VERSION}`;

const APP_SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/main.js",
  "./js/data/categories.js",
  "./js/data/questions.js",
  "./js/data/recommendations.js",
  "./js/core/i18n.js",
  "./js/core/piAuth.js",
  "./js/core/DynamicRiskEngine.js",
  "./js/core/RecommendationEngine.js",
  "./js/storage/StorageAdapter.js",
  "./js/storage/LocalStorageAdapter.js",
  "./js/ui/AssessmentUI.js",
  "./js/ui/ResultsUI.js",
  "./js/ui/HistoryUI.js",
  "./roadmap/index.html",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
];

// INSTALL: save a first copy of every app-shell file, so the app can
// work offline even if the very first visit is the only one online.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE: delete any caches left over from an older CACHE_VERSION.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("smarthomemind-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// FETCH: network first, cache as a fallback.
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Leave other websites alone (Pi SDK, Pi servers, etc.).
  if (url.origin !== self.location.origin) return;

  // Never cache our own backend calls.
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    // cache: "no-cache" makes the browser double-check with the server
    // instead of trusting its own short-term memory.
    fetch(request, { cache: "no-cache" })
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      })
      .catch(() =>
        caches.match(request).then((cached) => {
          if (cached) return cached;
          if (request.mode === "navigate") return caches.match("./index.html");
          return Response.error();
        })
      )
  );
});