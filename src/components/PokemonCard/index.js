import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./style.css";

export default function PokemonCard({ pokemon }) {
  const [pokemonData, setPokemonData] = useState([]);
  const [sprite, setSprite] = useState("");
  const [types, setTypes] = useState([]);
  const [hasError, setHasError] = useState(false);
  const url = pokemon.url;
  const endpoint = url.substring(19, url.length);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPokemonData() {
      setLoading(true);
      try {
        const response = await api.get(endpoint);
        const data = await response.data;
        setPokemonData(data);
        setSprite(data.sprites.front_default);
        setTypes(data.types);
        setHasError(false);
      } catch (error) {
        setHasError(true);
      }
    }
    getPokemonData();
    setInterval(() => {
      setLoading(false);
    }, 1400);
  }, [endpoint]);

  if (hasError) {
    return <p className="error">Pokemon não encontrado</p>;
  }

  if (loading) {
    return (
      <div className="PokemonCard">
        <p>Loading...</p>
      </div>
    );
  } else {
    return (
      <div className="PokemonCard">
        <Link to={`/pokemon/${pokemonData.name}`}>
          <div className="pokemon-sprite">
            <img src={sprite} alt={`Sprite ${pokemonData.name}`} />
          </div>
          <div className="pokemon-stats">
            <p className="pokemon-id">Nº {pokemonData.id}</p>
            <p className="pokemon-name">{pokemonData.name}</p>
            <div className="types">
              {types.map((type, value) => {
                return (
                  <div className={type.type.name} key={value}>
                    {type.type.name}
                  </div>
                );
              })}
            </div>
          </div>
        </Link>
      </div>
    );
  }
}
