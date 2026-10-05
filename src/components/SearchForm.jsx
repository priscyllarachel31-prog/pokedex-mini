import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { playSound } from "../sound.js";

function SearchForm({ value, onChange }) {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleChange(event) {
    playSound("tick");
    setError(null);
    onChange(event.target.value);
  }

  function handleClear() {
    playSound("click");
    setError(null);
    onChange("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = value.trim().toLowerCase();

    if (name === "") {
      setError("Type a Pokémon name first.");
      return;
    }

    playSound("click");
    setError(null);
    navigate(`/pokemon/${name}`);
  }

  return (
    <div className="search">
      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Search by name or number…"
          className="search-input"
        />
        {value && (
          <button
            type="button"
            className="search-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <p className="status status-error">{error}</p>}
    </div>
  );
}

export default SearchForm;