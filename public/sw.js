const CACHE_NAME = "global-resume-builder-v1";
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/manifest.json",
  "/offline.html",
];

// ---- Install ----
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ---- Activate ----
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ---- Fetch (Network First, Cache Fallback) ----
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests and API calls
  if (request.method !== "GET") return;
  if (request.url.includes("/api/")) return;
  if (request.url.includes("supabase.co")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Serve from cache
        return caches.match(request).then((cached) => {
          return cached || caches.match("/offline.html");
        });
      })
  );
});

// ---- Background Sync (for offline editing) ----
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-resumes") {
    event.waitUntil(syncPendingChanges());
  }
});

async function syncPendingChanges() {
  const db = await openLocalDB();
  const pendingChanges = await db.getAll("pending-changes");
  for (const change of pendingChanges) {
    try {
      await fetch(change.url, {
        method: change.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(change.data),
      });
      await db.delete("pending-changes", change.id);
    } catch {
      // Will retry on next sync
    }
  }
}

function openLocalDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("grb-offline", 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("pending-changes", { keyPath: "id", autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
