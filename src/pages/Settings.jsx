import { useState } from "react";
import { useFeed } from "../context/FeedContext";
import { useFavorites } from "../context/FavoritesContext";

export default function Settings() {
  const { meta, updated, status, debugMode, setDebugMode, refresh, error, feedConfigured, lastSuccessfulRefresh } =
    useFeed();
  const { favorites } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Settings</h1>
      </header>

      <section className="settings-card">
        <h3>Feed status</h3>
        <dl className="settings-list">
          <div>
            <dt>Connection</dt>
            <dd className={status === "ready" ? "status-ok" : status === "error" ? "status-bad" : ""}>
              {!feedConfigured ? "Not configured" : status === "error" ? "Using cached data" : "Connected"}
            </dd>
          </div>
          <div>
            <dt>Collections</dt>
            <dd>{meta?.folderCount ?? 0}</dd>
          </div>
          <div>
            <dt>Wallpapers</dt>
            <dd>{meta?.wallpaperCount ?? 0}</dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd>{updated ? new Date(updated).toLocaleString() : "—"}</dd>
          </div>
          <div>
            <dt>Last successful refresh</dt>
            <dd>{lastSuccessfulRefresh ? new Date(lastSuccessfulRefresh).toLocaleString() : "—"}</dd>
          </div>
        </dl>
        <button className="btn-glow" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? "Refreshing…" : "Refresh feed now"}
        </button>
      </section>

      <section className="settings-card">
        <h3>Debug mode</h3>
        <label className="toggle-row">
          <span>Show feed error details when a refresh fails</span>
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
          />
        </label>
        {debugMode && error && (
          <pre className="debug-block">{error.debugError || error.message}</pre>
        )}
      </section>

      <section className="settings-card">
        <h3>Storage</h3>
        <dl className="settings-list">
          <div>
            <dt>Favorites saved on this device</dt>
            <dd>{favorites.length}</dd>
          </div>
        </dl>
        <p className="settings-note">
          Favorites are stored locally in your browser only — no account or server database is
          used.
        </p>
      </section>

      <section className="settings-card">
        <h3>About</h3>
        <p className="settings-note">
          WOW PAPERS reads wallpapers directly from your Google Drive via a Google Apps Script
          feed — no backend server involved. Folders in Drive become collections here
          automatically — rename, add, or remove a folder in Drive and it updates here on the
          next refresh.
        </p>
      </section>
    </div>
  );
}
