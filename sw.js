// sw.js — Mariachi Soundboard PWA
const VERSION = "mariachi-v10";
const BASE = "/mariachi/"; // ¡Importante! Ruta base en GitHub Pages

// Archivos que precacheamos para abrir offline
const ASSETS = [
  BASE,
  BASE + "index.html",
  BASE + "manifest.webmanifest",
  BASE + "icons/icon-192.png",
  BASE + "icons/icon-512.png"
  // Si agregas más archivos estáticos, añádelos aquí.
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === VERSION ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

// Estrategia cache-first con fallback a red y, si falla, al index
self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).catch(() => {
        // Fallback al index para navegación offline
        if (req.mode === "navigate") return caches.match(BASE + "index.html");
        // Intento de fallback genérico a raíz
        return caches.match(BASE);
      });
    })
  );
});
