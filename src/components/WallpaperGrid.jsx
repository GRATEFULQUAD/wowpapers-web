import { WallpaperCard } from "./WallpaperCard";

export function WallpaperGrid({ wallpapers, onOpen, emptyLabel = "Nothing here yet." }) {
  if (!wallpapers || wallpapers.length === 0) {
    return <div className="empty-state">{emptyLabel}</div>;
  }
  return (
    <div className="wp-grid">
      {wallpapers.map((w) => (
        <WallpaperCard key={w.id} wallpaper={w} onOpen={onOpen} />
      ))}
    </div>
  );
}
