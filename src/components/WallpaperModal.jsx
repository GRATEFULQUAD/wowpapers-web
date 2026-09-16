import { useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { toEmbeddableUrl, toDownloadUrl } from "../utils/driveImage";

export function WallpaperModal({ wallpaper, onClose }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!wallpaper) return null;
  const fav = isFavorite(wallpaper.id);
  const downloadUrl = toDownloadUrl(wallpaper);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <img src={toEmbeddableUrl(wallpaper, 1600)} alt={wallpaper.name} className="modal-img" />
        <div className="modal-footer">
          <div className="modal-meta">
            <span className="modal-folder">{wallpaper.folder}</span>
            <span className="modal-name">{wallpaper.name}</span>
          </div>
          <div className="modal-actions">
            <button
              className={"btn-glow" + (fav ? " btn-glow--active" : "")}
              onClick={() => toggleFavorite(wallpaper)}
            >
              {fav ? "★ Favorited" : "☆ Favorite"}
            </button>
            <a className="btn-glow btn-glow--accent" href={downloadUrl} target="_blank" rel="noreferrer">
              ⬇ Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
