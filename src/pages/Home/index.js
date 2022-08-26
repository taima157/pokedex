import React, { useEffect, useState } from "react";
import PokemonCard from "../../components/PokemonCard";
import api from "../../services/api";
import "./style.css";

export default function Home() {
  const [pokemon, setPokemon] = useState("");
  const [searchPokemon, setSearchPokemon] = useState();
  const [prev, setPrev] = useState("");
  const [next, setNext] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [endpoint, setEndpoint] = useState("api/v2/pokemon?offset=0&limit=52");

  function changePokemonList(endpoint) {
    setEndpoint(endpoint);
    window.scrollTo(0, 0);
  }

  async function searchingPokemon() {
    const searchEndpoint = {
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`,
    };
    setSearchPokemon(<PokemonCard pokemon={searchEndpoint} />);
    setPokemon("");
  }

  useEffect(() => {
    async function getPokemon() {
      const response = await api.get(endpoint);
      const data = await response.data;
      setNext(data.next);
      if (data.previous != null) {
        setPrev(data.previous);
      }
      setPokemonList(data.results);
    }
    getPokemon();
  }, [endpoint]);

  return (
    <div className="Home">
      <div className="search-field">
        <div className="search-bar">
          <input
            type="text"
            value={pokemon}
            onChange={(e) => setPokemon(e.target.value)}
            placeholder="Search a pokemon"
          />
          <div className="search-buttons-field">
            <button onClick={() => searchingPokemon()}>Search</button>
            <button onClick={() => setSearchPokemon()}>Clean</button>
          </div>
        </div>
        <div className="searching-pokemon">{searchPokemon}</div>
      </div>
      <div className="pokedex">
        {pokemonList.map((pokemon, value) => {
          return <PokemonCard key={value} pokemon={pokemon} />;
        })}
      </div>
      <div className="prev-and-next-button">
        <button onClick={() => changePokemonList(prev)}>Prev</button>
        <button onClick={() => changePokemonList(next)}>Next</button>
      </div>
    </div>
  );
}
