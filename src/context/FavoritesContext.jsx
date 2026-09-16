import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "wowpapers.favorites.v1";

function readFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore quota errors
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((wallpaper) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === wallpaper.id);
      if (exists) return prev.filter((f) => f.id !== wallpaper.id);
      return [{ ...wallpaper, favoritedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
