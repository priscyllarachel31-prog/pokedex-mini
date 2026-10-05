import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config.js";
import { getIdFromUrl } from "../utils.js";
import { playSound } from "../sound.js";
import PokemonCard from "./PokemonCard.jsx";

const PAGE_SIZE = 24;

// Disimpan di luar komponen supaya daftar tidak diunduh ulang
// setiap kali kita kembali dari halaman detail
let cachedPokemons = null;

function PokemonList({ query, type }) {
  const [pokemons, setPokemons] = useState(cachedPokemons || []);
  const [isLoading, setIsLoading] = useState(!cachedPokemons);
  const [error, setError] = useState(null);
  const [typeData, setTypeData] = useState({}); // contoh: { fire: Set(["charmander", ...]) }
  const [typeError, setTypeError] = useState(null);
  const [limit, setLimit] = useState({ key: "", count: PAGE_SIZE });

  // 1. Ambil nama dari 1025 Pokemon (sekali saja)
  useEffect(() => {
    if (cachedPokemons) return;

    async function loadPokemons() {
      try {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=1025`);

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        const list = data.results.map((p) => ({
          name: p.name,
          id: getIdFromUrl(p.url),
        }));
        cachedPokemons = list;
        setPokemons(list);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPokemons();
  }, []);

  // 2. Kalau memilih tipe (misalnya fire), ambil daftar nama Pokemon bertipe itu
  useEffect(() => {
    if (type === "all" || typeData[type]) return;

    async function loadType() {
      try {
        setTypeError(null);
        const response = await fetch(`${API_BASE_URL}/type/${type}`);

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        const names = new Set(data.pokemon.map((item) => item.pokemon.name));
        setTypeData((prev) => ({ ...prev, [type]: names }));
      } catch (err) {
        setTypeError(err.message);
      }
    }

    loadType();
  }, [type, typeData]);

  // 3. Hitung apa yang harus ditampilkan
  const q = query.trim().toLowerCase();
  const typeNames = type === "all" ? null : typeData[type];
  const isTypeLoading = type !== "all" && !typeNames && typeError === null;
  const typeFailed = type !== "all" && !typeNames && typeError !== null;

  // kalau pencarian atau filter berubah, jumlah kartu kembali ke awal
  const filterKey = `${type}|${q}`;
  const visibleCount = limit.key === filterKey ? limit.count : PAGE_SIZE;

  function showMore() {
    playSound("click");
    setLimit({ key: filterKey, count: visibleCount + PAGE_SIZE });
  }

  if (isLoading || isTypeLoading) {
    return (
      <ul className="pokemon-list">
        {Array.from({ length: 12 }).map((_, i) => (
          <li key={i} className="skeleton" />
        ))}
      </ul>
    );
  }

  if (error) {
    return <p className="status status-error">Couldn't load the list: {error}</p>;
  }

  if (typeFailed) {
    return <p className="status status-error">Couldn't load that type: {typeError}</p>;
  }

  const filtered = pokemons.filter((p) => {
    const matchesQuery = q === "" || p.name.includes(q) || p.id === q;
    const matchesType = !typeNames || typeNames.has(p.name);
    return matchesQuery && matchesType;
  });

  const visible = filtered.slice(0, visibleCount);

  return (
    <>
      <p className="result-count">
        Showing {visible.length} of {filtered.length} Pokémon
      </p>

      {filtered.length === 0 ? (
        <p className="status">No Pokémon found. Try another name or type.</p>
      ) : (
        <ul className="pokemon-list">
          {visible.map((p, index) => (
            <PokemonCard key={p.name} name={p.name} id={p.id} index={index} />
          ))}
        </ul>
      )}

      {filtered.length > visibleCount && (
        <div className="more-wrap">
          <button type="button" className="more-button" onClick={showMore}>
            Show more
          </button>
        </div>
      )}
    </>
  );
}

export default PokemonList;