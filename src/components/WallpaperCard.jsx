import { useFavorites } from "../context/FavoritesContext";
import { toEmbeddableUrl } from "../utils/driveImage";

export function WallpaperCard({ wallpaper, onOpen }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(wallpaper.id);

  return (
    <div className="wp-card" onClick={() => onOpen(wallpaper)}>
      <img
        src={toEmbeddableUrl(wallpaper, 600)}
        alt={wallpaper.name}
        loading="lazy"
        className="wp-card__img"
      />
      <div className="wp-card__overlay" />
      <button
        type="button"
        className={"wp-card__fav" + (fav ? " wp-card__fav--active" : "")}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(wallpaper);
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
          <path
            d="M12 20.5s-7.5-4.6-9.7-9.1C.7 8.2 2.1 4.8 5.4 4a4.9 4.9 0 0 1 6.6 2.4A4.9 4.9 0 0 1 18.6 4c3.3.8 4.7 4.2 3.1 7.4C19.5 15.9 12 20.5 12 20.5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
