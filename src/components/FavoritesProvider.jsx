import { useState, useEffect } from "react";
import { FavoritesContext } from "../favorites.js";

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("favorites"));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  // setiap daftar berubah, simpan ke browser supaya tidak hilang saat refresh
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch {
      // abaikan kalau penyimpanan browser tidak tersedia
    }
  }, [favorites]);

  function isFavorite(name) {
    return favorites.some((p) => p.name === name);
  }

  function toggleFavorite(pokemon) {
    setFavorites((prev) =>
      prev.some((p) => p.name === pokemon.name)
        ? prev.filter((p) => p.name !== pokemon.name)
        : [...prev, { name: pokemon.name, id: String(pokemon.id) }]
    );
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesProvider;