import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton.jsx";
import { playSound } from "../sound.js";
import { capitalize, getArtworkUrl } from "../utils.js";

function PokemonCard({ name, id, index }) {
  return (
    <li className="pokemon-list-item" style={{ "--i": index }}>
      <div className="card">
        <Link
          to={`/pokemon/${name}`}
          className="pokemon-link"
          onClick={() => playSound("open")}
        >
          <img
            className="pokemon-sprite"
            src={getArtworkUrl(id)}
            alt={name}
            width={120}
            height={120}
            loading="lazy"
          />
          <span className="pokemon-id">#{String(id).padStart(3, "0")}</span>
          <span className="pokemon-name">{capitalize(name)}</span>
        </Link>
        <FavoriteButton name={name} id={id} />
      </div>
    </li>
  );
}

export default PokemonCard;