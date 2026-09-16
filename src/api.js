// Direct client for the Google Apps Script wallpaper feed — no backend needed.
// The feed URL is baked in at build time via the VITE_WOWPAPERS_FEED_URL env var.

import { normalizeFeed } from "./lib/normalizeFeed";

const FEED_URL = import.meta.env.VITE_WOWPAPERS_FEED_URL || "";

export function isFeedConfigured() {
  return Boolean(FEED_URL);
}

export async function fetchFeed() {
  if (!FEED_URL) {
    const err = new Error(
      "No wallpaper feed URL is configured (VITE_WOWPAPERS_FEED_URL is missing)."
    );
    throw err;
  }

  let res;
  try {
    res = await fetch(FEED_URL, { headers: { Accept: "application/json" } });
  } catch (networkErr) {
    const err = new Error("Could not reach the wallpaper feed (network error).");
    err.debugError = networkErr.message;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(`Wallpaper feed returned an error (HTTP ${res.status}).`);
    throw err;
  }

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    const err = new Error("Wallpaper feed did not return valid JSON.");
    err.debugError = text.slice(0, 300);
    throw err;
  }

  let normalized;
  try {
    normalized = normalizeFeed(json);
  } catch (normErr) {
    const err = new Error("Wallpaper feed JSON did not match the expected format.");
    err.debugError = normErr.message;
    throw err;
  }

  return {
    ok: true,
    updated: normalized.updated,
    folders: normalized.folders,
    meta: { ...normalized.meta, fromCache: false },
  };
}
