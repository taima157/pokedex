import axios from "axios";

const apiPokemon = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
});

export default apiPokemon;
