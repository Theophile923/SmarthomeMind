/const CACHE_VERSION = "v3"; // bumped for V1.1 language update (fr/en/sw/zh)
 * ----------------------
 * Makes SmartHomeMind work with NO internet connection after the first
 * visit — important in contexts with unreliable connectivity.
 *
 * STRATEGY IN PLAIN TERMS:
 * On first visit, this file downloads and stores a private copy of every
 * file the app needs (the "app shell": HTML, CSS, JS, icons) inside the
 * browser's Cache Storage — a separate, larger storage area from
 * localStorage, meant exactly for this. On every visit after that, the
 * app is loaded from that local copy first — instantly, and even with
 * no network at all. It only asks the network again if you update the
 * cache version below.
 *
 * UPDATING THE APP LATER:
 * Whenever you change any file in the app shell (a question, a style, a
 * script), bump CACHE_VERSION below (e.g. "v1" -> "v2"). That's what
 * tells returning users' browsers "the old cached copy is stale, fetch
 * everything fresh." Forgetting this step means users keep seeing the
 * old version until they manually clear their browser data.
 */

const CACHE_VERSION = "v1";
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
  "./js/core/DynamicRiskEngine.js",
  "./js/core/RecommendationEngine.js",
  "./js/storage/StorageAdapter.js",
  "./js/storage/LocalStorageAdapter.js",
  "./js/ui/AssessmentUI.js",
  "./js/ui/ResultsUI.js",
  "./js/ui/HistoryUI.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
];

// INSTALL: download and cache every app-shell file up front.
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

// FETCH: cache-first for app-shell files (instant, works offline).
// Falls back to the network for anything not in the cache, and if the
// network also fails during navigation, serves the cached index.html
// so the app still opens instead of showing a browser error page.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
        return undefined;
      });
    })
  );
});
