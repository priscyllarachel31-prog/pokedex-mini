import { createContext, useContext } from "react";

export const FavoritesContext = createContext(null);

export function useFavorites() {
  return useContext(FavoritesContext);
}