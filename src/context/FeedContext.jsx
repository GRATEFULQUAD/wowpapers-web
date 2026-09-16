import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { fetchFeed, isFeedConfigured } from "../api";

const FeedContext = createContext(null);

const LOCAL_CACHE_KEY = "wowpapers.feedCache.v1";

function readLocalCache() {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalCache(data) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function FeedProvider({ children }) {
  const initialCache = useRef(readLocalCache());
  const [folders, setFolders] = useState(initialCache.current?.folders || []);
  const [updated, setUpdated] = useState(initialCache.current?.updated || null);
  const [meta, setMeta] = useState(initialCache.current?.meta || null);
  // "idle" | "loading" | "ready" | "error"
  const [status, setStatus] = useState(initialCache.current ? "ready" : "loading");
  const [error, setError] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [lastSuccessfulRefresh, setLastSuccessfulRefresh] = useState(
    initialCache.current?.updated || null
  );

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setStatus((prev) => (prev === "ready" ? prev : "loading"));
    try {
      const body = await fetchFeed();
      setFolders(body.folders || []);
      setUpdated(body.updated);
      setMeta(body.meta);
      setStatus("ready");
      setError(null);
      setLastSuccessfulRefresh(new Date().toISOString());
      writeLocalCache({ folders: body.folders, updated: body.updated, meta: body.meta });
    } catch (err) {
      setError(err);
      // Only flip to hard error state if we have nothing cached to show at all.
      setStatus((prev) => (prev === "ready" ? "ready" : "error"));
    }
  }, []);

  useEffect(() => {
    // Stale-while-revalidate: show cache instantly (already in state),
    // then always kick off a background refresh.
    refresh({ silent: Boolean(initialCache.current) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    folders,
    updated,
    meta,
    status,
    error,
    debugMode,
    setDebugMode,
    refresh,
    feedConfigured: isFeedConfigured(),
    lastSuccessfulRefresh,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used within a FeedProvider");
  return ctx;
}
