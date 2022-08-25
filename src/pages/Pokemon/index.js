import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import "./style.css";
import api from "../../services/api";

export default function Pokemon() {
  const { id } = useParams();
  const history = useHistory();
  const [idPosition, setIdPosition] = useState(0);
  const [pokemon, setPokemon] = useState([]);
  const [sprite, setSprite] = useState("");
  const [abilities, setAbilities] = useState([]);
  const [stats, setStats] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    async function getPokemon() {
      try {
        const response = await api.get(`api/v2/pokemon/${id}`);
        const data = await response.data;
        window.scrollTo(0, 0);
        setPokemon(data);
        setSprite(data.sprites.front_default);
        setAbilities(data.abilities);
        setStats(data.stats);
        setTypes(data.types);
        setIdPosition(data.id);
      } catch (error) {
        history.replace("/");
      }
    }
    getPokemon();
  }, [id, history]);

  return (
    <div className="Pokemon">
      <div className="pokemon-field">
        <h1 className="pokemon-name-field">
          {pokemon.name} - <span>Nº {pokemon.id}</span>
        </h1>
        <div className="infos-base-stats">
          <div className="infos">
            <div className="sprite">
              <img src={sprite} alt={`Sprite ${pokemon.name}`} />
            </div>
            <div className="stats">
              <div className="stats-abilities">
                <div>
                  <span>Height:</span> {pokemon.height / 10}m
                </div>
                <div>
                  <span>Weight:</span> {pokemon.weight / 10}kg
                </div>
                <div className="abilities">
                  <span>Abilities:</span>
                  <div className="abilities-div">
                    {abilities.map((abilitie, value) => {
                      return <p key={value}>{abilitie.ability.name}</p>;
                    })}
                  </div>
                </div>
              </div>
              <div className="types-field">
                {types.map((type, value) => {
                  return (
                    <div className={type.type.name} key={value}>
                      {type.type.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="base-stats">
            <h2>Stats</h2>
            <div className="bars">
              {stats.map((stat, value) => {
                return (
                  <div className="stats-bar" key={value}>
                    <span>{stat.stat.name}:</span>
                    <div className="bar-number">
                      <div className="bar">
                        <div
                          className="bar-count"
                          style={{ width: stat.base_stat + "%" }}
                        ></div>
                      </div>
                      <p>{stat.base_stat}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="buttons-navigation">
        <Link
          className="btn prev-next"
          to={`/pokemon/${idPosition > 1 ? idPosition - 1 : 1}`}
        >
          Prev
        </Link>
        <Link className="btn back" to="/">
          Back
        </Link>
        <Link className="btn prev-next" to={`/pokemon/${idPosition + 1}`}>
          Next
        </Link>
      </div>
    </div>
  );
}
