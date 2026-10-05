import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { capitalize, getTypeColor } from "../utils.js";
import { playSound } from "../sound.js";
import FavoriteButton from "../components/FavoriteButton.jsx";

function DetailPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadPokemon() {
      setIsLoading(true);
      setError(null);
      setPokemon(null);

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);

        if (!response.ok) {
          throw new Error(`No Pokémon named "${name}" — check the spelling.`);
        }

        const data = await response.json();

        if (isCurrent) {
          setPokemon(data);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadPokemon();

    return () => {
      isCurrent = false;
    };
  }, [name]);

  if (isLoading) return <p className="status">Loading {name}…</p>;

  if (error) {
    return (
      <div className="status">
        <p className="status-error">{error}</p>
        <Link to="/" className="back-link" onClick={() => playSound("click")}>
          ← Back to list
        </Link>
      </div>
    );
  }

  const mainColor = getTypeColor(pokemon.types[0].type.name);

  return (
    <div className="detail-page">
      <Link to="/" className="back-link" onClick={() => playSound("click")}>
        ← Back to list
      </Link>

      <div className="detail-card" style={{ "--glow": mainColor }}>
        <FavoriteButton name={pokemon.name} id={pokemon.id} large />

        <div
          className="detail-hero"
          style={{ background: `linear-gradient(160deg, ${mainColor}, transparent)` }}
        >
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            width={220}
            height={220}
          />
        </div>

        <h2>{capitalize(pokemon.name)}</h2>

        <div className="type-badges">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className="type-badge"
              style={{ background: getTypeColor(t.type.name) }}
            >
              {t.type.name}
            </span>
          ))}
        </div>

        <p className="measures">
          Height: {pokemon.height / 10} m · Weight: {pokemon.weight / 10} kg
        </p>

        <ul className="stat-list">
          {pokemon.stats.map((s) => (
            <li key={s.stat.name} className="stat-row">
              <span className="stat-name">{s.stat.name.replace("-", " ")}</span>
              <span className="stat-value">{s.base_stat}</span>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{
                    width: `${Math.min((s.base_stat / 150) * 100, 100)}%`,
                    background: mainColor,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DetailPage;