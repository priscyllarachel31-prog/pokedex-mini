import { Link } from "react-router-dom";
import { useFavorites } from "../favorites.js";
import PokemonCard from "../components/PokemonCard.jsx";

function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <>
      <section className="hero">
        <h2>
          Your <span>Favorites</span>
        </h2>
        <p>
          {favorites.length === 0
            ? "Nothing here yet."
            : `${favorites.length} Pokémon saved on this device.`}
        </p>
      </section>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-heart">🤍</div>
          <p>Tap the heart on any card to save it here.</p>
          <Link to="/" className="back-link">Browse Pokémon</Link>
        </div>
      ) : (
        <ul className="pokemon-list">
          {favorites.map((p, index) => (
            <PokemonCard key={p.name} name={p.name} id={p.id} index={index} />
          ))}
        </ul>
      )}
    </>
  );
}

export default FavoritesPage;