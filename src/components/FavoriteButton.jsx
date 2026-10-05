import { useState } from "react";
import { useFavorites } from "../favorites.js";
import { playSound } from "../sound.js";

function FavoriteButton({ name, id, large = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [popping, setPopping] = useState(false);
  const active = isFavorite(name);

  function handleClick() {
    toggleFavorite({ name, id });

    if (active) {
      playSound("unlike");
    } else {
      playSound("like");
      setPopping(true); // nyalakan animasi "pop"
    }
  }

  const className =
    "fav-btn" +
    (large ? " large" : "") +
    (active ? " active" : "") +
    (popping ? " pop" : "");

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      onAnimationEnd={(event) => {
        if (event.animationName === "heartPop") setPopping(false);
      }}
      aria-label={active ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      aria-pressed={active}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}

export default FavoriteButton;