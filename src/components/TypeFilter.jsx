import { getTypeColor, capitalize } from "../utils.js";
import { playSound } from "../sound.js";

const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

function TypeFilter({ active, onChange }) {
  function pick(type) {
    playSound("filter");
    // klik tipe yang sedang aktif = batalkan filter
    onChange(active === type ? "all" : type);
  }

  return (
    <div className="type-filter" role="group" aria-label="Filter by type">
      <button
        type="button"
        className={`chip${active === "all" ? " active" : ""}`}
        style={{ "--chip": "var(--neon-2)" }}
        onClick={() => {
          playSound("filter");
          onChange("all");
        }}
      >
        All
      </button>

      {TYPES.map((type) => (
        <button
          key={type}
          type="button"
          className={`chip${active === type ? " active" : ""}`}
          style={{ "--chip": getTypeColor(type) }}
          onClick={() => pick(type)}
        >
          {capitalize(type)}
        </button>
      ))}
    </div>
  );
}

export default TypeFilter;