import { useEffect, useState } from "react";
import { PokemonCardType } from "../types/pokemon";
import { PokemonClient, Pokemon, NamedAPIResource } from "pokenode-ts";
import { COLORS_TYPES } from "../colors/color-types";

import NotImage from "../assets/not-image.png";
import PokemonInfoModal from "./PokemonInfoModal";

type PropsType = {
  pokemon: PokemonCardType;
};

const api = new PokemonClient();

function TypeItem({ type }: { type: NamedAPIResource }) {
  return (
    <span
      className="rounded-md capitalize text-neutral-950 font-semibold px-2 text-sm"
      style={{
        backgroundColor: COLORS_TYPES[type.name],
      }}
    >
      {type.name}
    </span>
  );
}

export default function PokemonCard({ pokemon }: PropsType) {
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
    document.body.classList.toggle("overflow-hidden");
  }

  async function getPokemonData() {
    try {
      const handlePokemon = await api.getPokemonByName(pokemon.name);

      setPokemonData(handlePokemon);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPokemonData();
  }, []); // eslint-disable-line

  if (pokemonData) {
    return (
      <>
        <button
          onClick={toggleModal}
          className="rounded-md shadow-xl flex flex-col overflow-hidden h-full bg-neutral-700 hover:scale-95 duration-200 ease-in-out border-2 border-neutral-600 hover:shadow-red-600/50"
        >
          <div
            className={`flex flex-col w-full items-start p-2 bg-neutral-900`}
          >
            <span className="font-semibold text-neutral-50">
              {pokemonData.id}
            </span>
            <img
              className="w-full"
              src={
                pokemonData.sprites.front_default
                  ? pokemonData.sprites.front_default
                  : NotImage
              }
              alt={`Imagem do pokemon ${pokemonData.name}`}
            />
          </div>
          <div className="flex w-full flex-col p-2 items-start gap-3">
            <p className="capitalize text-neutral-50 text-base md:text-lg">
              {pokemonData.name}
            </p>

            <div className="flex w-full justify-between items-center">
              {pokemonData.types.map((type) => {
                return <TypeItem key={type.slot} type={type.type} />;
              })}
            </div>
          </div>
        </button>
        {isModalOpen && (
          <PokemonInfoModal pokemon={pokemonData} toggleModal={toggleModal} />
        )}
      </>
    );
  } else {
    return (
      <div className="rounded-md duration-500 ease-in-out shadow-xl h-56 animate-pulse flex flex-col overflow-hidden bg-neutral-700 border-2 border-neutral-600"></div>
    );
  }
}
