import { ChangeEvent, useEffect, useState } from "react";
import apiPokemon from "./services/apiPokemon";
import { PokemonCardType } from "./types/pokemon";
import PokemonCard from "./components/PokemonCard";
import { PokemonClient, Type } from "pokenode-ts";
import { COLORS_TYPES } from "./colors/color-types";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const api = new PokemonClient();
const LIMIT_LIST = 20;
const types = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export default function App() {
  const [pokemonData, setPokemonData] = useState<Array<PokemonCardType> | null>(
    null
  );
  const [offset, setOffset] = useState<number>(LIMIT_LIST);
  const [searchPokemon, setSearchPokemon] = useState<string>("");

  const [selectedType, setSelectedType] = useState<Type | null>(null);
  const [typeHandle, setTypeHandle] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [isVisibleFilter, setIsVisibleFilter] = useState<boolean>(false);

  function toggleIsVisibleFilter() {
    setIsVisibleFilter(!isVisibleFilter);
  }

  const [pokemonList, setPokemonList] = useState<Array<PokemonCardType> | null>(
    null
  );

  async function handleSelectType(type: string) {
    toggleIsVisibleFilter();

    if (selectedType) {
      if (selectedType.name === type) {
        setTypeHandle("");
        setSelectedType(null);
        setPokemonList(null);
        return;
      }
    }

    setPokemonList(null);
    setLoading(true);
    setOffset(LIMIT_LIST);

    try {
      setTypeHandle(type);
      const data = await api.getTypeByName(type);
      setSelectedType(data);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  function handlePokemonList(
    pokemonData: Array<PokemonCardType> | null,
    offset: number,
    searchPokemon: string
  ) {
    if (pokemonData) {
      let handlePokemonList = pokemonData;

      if (searchPokemon !== "") {
        handlePokemonList = pokemonData.filter((pokemon) => {
          if (pokemon.name.includes(searchPokemon)) {
            return pokemon;
          }
        });
      }

      if (selectedType) {
        handlePokemonList = handlePokemonList.filter((pokemon) => {
          let hasType = false;

          selectedType.pokemon.forEach((typePokemon) => {
            if (typePokemon.pokemon.name === pokemon.name) {
              hasType = true;
            }
          });

          if (hasType) {
            return pokemon;
          }
        });
      }

      handlePokemonList = handlePokemonList.filter((pokemon, index) => {
        if (index >= offset - LIMIT_LIST && index < offset) {
          return pokemon;
        }
      });

      setPokemonList(handlePokemonList);
    }
  }

  function handleSearchPokemon(e: ChangeEvent<HTMLInputElement>) {
    setSearchPokemon(e.target.value);
    setOffset(LIMIT_LIST);
  }

  async function getAllPokemon() {
    try {
      const { data } = await apiPokemon.get("pokemon?limit=100000&offset=0");

      setPokemonData(data.results);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllPokemon();
  }, []);

  useEffect(() => {
    handlePokemonList(pokemonData, offset, searchPokemon);
  }, [pokemonData, offset, searchPokemon, selectedType]); // eslint-disable-line

  return (
    <div className="w-full bg-neutral-800 h-screen flex flex-col lg:flex-row ">
      <div className="w-full z-10 lg:z-0 flex flex-col sticky top-0 lg:relative lg:w-80 xl:w-96 bg-red-600 p-5 gap-5 lg:gap-10 ">
        <div className="flex gap-5">
          <div className="bg-white w-16 rounded-full border-2 flex items-center justify-center border-neutral-900 h-16">
            <div className="w-12 h-12 border-neutral-900 relative bg-blue-500 rounded-full">
              <div className="bg-blue-300 w-8 h-8 rounded-full absolute top-1 left-[1px]">
                <div className="bg-blue-100 w-4 h-4 rounded-full absolute top-1 left-1" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-red-700 w-5 h-5 rounded-full border-2 flex items-center justify-center border-neutral-900 relative">
              <div className="w-3 h-3 bg-red-500 rounded-full absolute top-[1px] left-[1px]">
                <div className="bg-red-100 w-1 h-1 rounded-full absolute top-[2px] left-[2px]" />
              </div>
            </div>
            <div className="bg-yellow-700 w-5 h-5 rounded-full border-2 flex items-center justify-center border-neutral-900 relative">
              <div className="w-3 h-3 bg-yellow-500 rounded-full absolute top-[1px] left-[1px]">
                <div className="bg-yellow-100 w-1 h-1 rounded-full absolute top-[2px] left-[2px]" />
              </div>
            </div>
            <div className="bg-green-700 w-5 h-5 rounded-full border-2 flex items-center justify-center border-neutral-900 relative">
              <div className="w-3 h-3 bg-green-500 rounded-full absolute top-[1px] left-[1px]">
                <div className="bg-green-100 w-1 h-1 rounded-full absolute top-[2px] left-[2px]" />
              </div>
            </div>
          </div>
        </div>

        <input
          type="search"
          value={searchPokemon}
          onChange={handleSearchPokemon}
          className="rounded-md outline-none p-2 bg-neutral-800 text-neutral-400"
          placeholder="Search for a pokemon"
        />

        <div
          className={`flex-1 overflow-hidden duration-500 ${
            isVisibleFilter ? "block" : "hidden"
          } lg:block`}
        >
          <div className="flex flex-col bg-neutral-300 border-2 border-neutral-900 rounded-md">
            <div className="w-full p-5 flex justify-center gap-5">
              <div className="w-4 h-4 bg-red-600 border-2 border-neutral-900 rounded-full" />
              <div className="w-4 h-4 bg-red-600 border-2 border-neutral-900 rounded-full" />
            </div>
            <div className="p-5 flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-neutral-900">Types</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-2 gap-2">
                  {types.map((type) => {
                    return (
                      <button
                        onClick={() => handleSelectType(type)}
                        className={`bg-neutral-700 p-2 font-semibold text-sm text-neutral-400 capitalize rounded-md hover:opacity-90 transition-opacity ${
                          type === typeHandle ? "text-neutral-950" : ""
                        }`}
                        style={{
                          backgroundColor:
                            type === typeHandle ? COLORS_TYPES[type] : "",
                        }}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={toggleIsVisibleFilter}
          className={`w-10 h-10 duration-200 bg-neutral-800 rounded-xl p-2 border-2 border-neutral-700 self-end lg:hidden ${
            isVisibleFilter ? "rotate-180" : ""
          }`}
        >
          <ChevronDownIcon className="h-full w-full text-neutral-200" />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-5 md:px-10 py-20 md:overflow-y-auto">
        <div className="flex-1">
          {loading ? (
            <div className="flex-1 h-full flex items-center justify-center">
              <p className="text-neutral-400">Loading...</p>
            </div>
          ) : (
            pokemonList &&
            (pokemonList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
                {pokemonList?.map((pokemon) => {
                  return <PokemonCard key={pokemon.name} pokemon={pokemon} />;
                })}
              </div>
            ) : (
              <div className="flex-1 h-full flex items-center justify-center">
                <p className="text-lg font-semibold text-neutral-400">
                  No pokemon found.
                </p>
              </div>
            ))
          )}
        </div>

        <div className="w-full lg:w-2/3 self-center rounded-md shadow-md p-5 mt-20 flex justify-between bg-neutral-900 items-center">
          <button
            onClick={() => {
              if (offset !== LIMIT_LIST) {
                setPokemonList(null);
                setOffset(offset - LIMIT_LIST);
              }
            }}
            className="bg-red-600 w-[30%] sm:w-2/5 p-2 rounded-md font-semibold text-neutral-50 hover:bg-red-600/70 transition-colors"
          >
            Back
          </button>
          <div className="flex-1 flex justify-center gap-5"></div>
          <button
            onClick={() => {
              if (pokemonList) {
                if (pokemonList.length >= LIMIT_LIST) {
                  setPokemonList(null);
                  setOffset(offset + LIMIT_LIST);
                }
              }
            }}
            className="bg-red-600 w-[30%] sm:w-2/5 p-2 rounded-md font-semibold text-neutral-50 hover:bg-red-600/70 transition-colors"
          >
            Previous
          </button>
        </div>
      </div>
    </div>
  );
}
