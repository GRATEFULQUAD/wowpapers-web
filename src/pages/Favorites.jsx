import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { WallpaperGrid } from "../components/WallpaperGrid";
import { WallpaperModal } from "../components/WallpaperModal";

export default function Favorites() {
  const { favorites } = useFavorites();
  const [active, setActive] = useState(null);

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Favorites</h1>
        <p className="page-sub">Saved on this device · {favorites.length} wallpapers</p>
      </header>

      <WallpaperGrid
        wallpapers={favorites}
        onOpen={setActive}
        emptyLabel="No favorites yet. Tap the heart on any wallpaper to save it here."
      />

      <WallpaperModal wallpaper={active} onClose={() => setActive(null)} />
    </div>
  );
}
