import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFeed } from "../context/FeedContext";
import { Loader } from "../components/Loader";
import { WallpaperGrid } from "../components/WallpaperGrid";
import { WallpaperModal } from "../components/WallpaperModal";
import { toEmbeddableUrl } from "../utils/driveImage";

function pickFeatured(folders) {
  const all = folders.flatMap((f) => f.files);
  if (all.length === 0) return null;
  // Bias toward recency: pick from the newest slice, randomized within it.
  const pool = all.slice(0, Math.max(1, Math.min(12, all.length)));
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Home() {
  const { folders, status, error, meta, updated, refresh } = useFeed();
  const [active, setActive] = useState(null);

  const featured = useMemo(() => pickFeatured(folders), [folders]);
  const recent = useMemo(
    () => folders.flatMap((f) => f.files).slice(0, 12),
    [folders]
  );

  if (status === "loading") return <Loader />;

  if (status === "error" && folders.length === 0) {
    return (
      <div className="page">
        <div className="empty-state empty-state--error">
          <p>{error?.message || "Couldn't load wallpapers."}</p>
          <button className="btn-glow" onClick={() => refresh()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="brand-header">
        <h1 className="brand-title">WOW PAPERS</h1>
        <p className="brand-sub">
          {meta?.wallpaperCount ?? 0} wallpapers · {folders.length} collections
          {meta?.fromCache ? " · showing cached data" : ""}
        </p>
      </header>

      {featured && (
        <section className="featured" onClick={() => setActive(featured)}>
          <img src={toEmbeddableUrl(featured, 1200)} alt={featured.name} className="featured__img" />
          <div className="featured__glow" />
          <div className="featured__info">
            <span className="pill">{featured.folder}</span>
            <h2>Featured wallpaper</h2>
          </div>
        </section>
      )}

      <section className="section">
        <div className="section__head">
          <h3>Recently added</h3>
          <Link to="/browse" className="link-more">
            See all →
          </Link>
        </div>
        <WallpaperGrid wallpapers={recent} onOpen={setActive} emptyLabel="No wallpapers yet — add some to your Drive folders." />
      </section>

      <section className="section">
        <div className="section__head">
          <h3>Collections</h3>
        </div>
        <div className="folder-chip-row">
          {folders.map((f) => (
            <Link key={f.name} to={`/browse?folder=${encodeURIComponent(f.name)}`} className="folder-chip">
              {f.name}
              <span className="folder-chip__count">{f.files.length}</span>
            </Link>
          ))}
        </div>
      </section>

      {updated && (
        <p className="updated-note">Feed last updated {new Date(updated).toLocaleString()}</p>
      )}

      <WallpaperModal wallpaper={active} onClose={() => setActive(null)} />
    </div>
  );
}
