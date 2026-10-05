import { useState } from "react";
import SearchForm from "../components/SearchForm.jsx";
import TypeFilter from "../components/TypeFilter.jsx";
import PokemonList from "../components/PokemonList.jsx";

function ListPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  return (
    <>
      <section className="hero">
        <h2>
          Find your favorite <span>Pokémon</span>
        </h2>
        <p>Type a name, pick a type, and tap the heart to save your favorites.</p>
      </section>
      <SearchForm value={query} onChange={setQuery} />
      <TypeFilter active={type} onChange={setType} />
      <PokemonList query={query} type={type} />
    </>
  );
}

export default ListPage;