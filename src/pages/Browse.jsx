import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFeed } from "../context/FeedContext";
import { Loader } from "../components/Loader";
import { WallpaperGrid } from "../components/WallpaperGrid";
import { WallpaperModal } from "../components/WallpaperModal";

export default function Browse() {
  const { folders, status } = useFeed();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const selectedFolder = searchParams.get("folder") || "all";

  useEffect(() => {
    // If the folder was removed from the feed, fall back to "all".
    if (selectedFolder !== "all" && !folders.some((f) => f.name === selectedFolder)) {
      setSearchParams({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folders]);

  const visibleFolders = useMemo(() => {
    const base = selectedFolder === "all" ? folders : folders.filter((f) => f.name === selectedFolder);
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base
      .map((f) => ({ ...f, files: f.files.filter((file) => file.name.toLowerCase().includes(q)) }))
      .filter((f) => f.files.length > 0);
  }, [folders, selectedFolder, query]);

  if (status === "loading") return <Loader />;

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Browse</h1>
      </header>

      <div className="filter-row">
        <input
          className="search-input"
          placeholder="Search wallpapers…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="folder-tabs">
        <button
          className={"folder-tab" + (selectedFolder === "all" ? " folder-tab--active" : "")}
          onClick={() => setSearchParams({})}
        >
          All
        </button>
        {folders.map((f) => (
          <button
            key={f.name}
            className={"folder-tab" + (selectedFolder === f.name ? " folder-tab--active" : "")}
            onClick={() => setSearchParams({ folder: f.name })}
          >
            {f.name} <span className="folder-tab__count">{f.files.length}</span>
          </button>
        ))}
      </div>

      {visibleFolders.length === 0 && (
        <div className="empty-state">No wallpapers match your search.</div>
      )}

      {visibleFolders.map((folder) => (
        <section key={folder.name} className="section">
          {selectedFolder === "all" && (
            <div className="section__head">
              <h3>{folder.name}</h3>
              <span className="section__count">{folder.files.length}</span>
            </div>
          )}
          <WallpaperGrid
            wallpapers={folder.files}
            onOpen={setActive}
            emptyLabel={`${folder.name} is empty right now.`}
          />
        </section>
      ))}

      <WallpaperModal wallpaper={active} onClose={() => setActive(null)} />
    </div>
  );
}
