import {
  Pokemon,
  PokemonClient,
  NamedAPIResource,
  PokemonStat,
} from "pokenode-ts";
import { COLORS_TYPES } from "../colors/color-types";

import NotImage from "../assets/not-image.png";
import PokeballImage from "../assets/pokeball.png";
import { useEffect, useState } from "react";

type PropsType = {
  pokemon: Pokemon;
  toggleModal: () => void;
};

const api = new PokemonClient();

function TypeItem({ type }: { type: NamedAPIResource }) {
  return (
    <span
      className="rounded-md text-white font-semibold px-2 capitalize"
      style={{
        backgroundColor: COLORS_TYPES[type.name],
      }}
    >
      {type.name}
    </span>
  );
}

function StatsBar({
  stat,
  pokemonType,
}: {
  stat: PokemonStat;
  pokemonType: string;
}) {
  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-center">
        <span className="capitalize text-neutral-400">
          {stat.stat.name.replace("-", " ").replace("special", "sp.")}
        </span>
        <span className="text-neutral-200 font-semibold text-lg">
          {stat.base_stat}
        </span>
      </div>
      <div className="w-full bg-neutral-800 h-3 rounded-md overflow-hidden border-2  border-neutral-700 relative">
        <div
          className="h-full"
          style={{
            width: `${stat.base_stat}%`,
            backgroundColor: COLORS_TYPES[pokemonType],
          }}
        />
        <div className="absolute z-10 top-0 w-full h-full flex justify-between">
          <div />
          <div className="h-full w-1 bg-neutral-800" />
          <div className="h-full w-1 bg-neutral-800" />
          <div className="h-full w-1 bg-neutral-800" />
          <div className="h-full w-1 bg-neutral-800" />
          <div />
        </div>
      </div>
    </div>
  );
}

export default function PokemonInfoModal({ pokemon, toggleModal }: PropsType) {
  const [weaknesses, setWeaknesses] = useState<NamedAPIResource[] | null>(null);
  const pokemonType = pokemon.types[0].type.name;

  async function getWeaknesses() {
    try {
      const data = await api.getTypeByName(pokemon.types[0].type.name);

      setWeaknesses(data.damage_relations.double_damage_from);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getWeaknesses();
  }, []); // eslint-disable-line

  return (
    <div className="fixed transition-opacity overflow-y-auto z-10 inset-0 w-screen h-screen flex justify-center sm:items-center">
      <div
        onClick={toggleModal}
        className="absolute w-full h-full bg-neutral-950/50 backdrop-blur-lg scroll-smooth"
      />
      <div className="z-10 w-[98%] md:w-4/5 lg:w-3/5 xl:w-2/5 h-[90%] gap-5 border-2 border-neutral-900 flex flex-col rounded-lg bg-red-600 px-1 py-5 md:p-5">
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

        <div className="flex-1 flex flex-col px-1 md:px-5 pb-5 bg-neutral-300 border-2 border-neutral-900 rounded-md gap-2 md:gap-5 overflow-auto">
          <div className="w-full p-5 flex justify-center gap-5">
            <div className="w-4 h-4 bg-red-600 border-2 border-neutral-900 rounded-full" />
            <div className="w-4 h-4 bg-red-600 border-2 border-neutral-900 rounded-full" />
          </div>
          <div className="flex-1 bg-neutral-900 border-2 border-neutral-950 rounded-md overflow-auto pb-10">
            <div
              className="flex justify-between p-5 h-1/2 relative"
              style={{
                backgroundColor: COLORS_TYPES[pokemonType],
              }}
            >
              <img
                src={PokeballImage}
                alt={`Imagem do pokemon ${pokemon.name}`}
                className="h-[80%] absolute right-2"
              />
              <img
                src={
                  pokemon.sprites.other?.["official-artwork"].front_default
                    ? pokemon.sprites.other["official-artwork"].front_default
                    : NotImage
                }
                alt={`Imagem do pokemon ${pokemon.name}`}
                className="h-full absolute top-[25%] right-1/2 translate-x-1/2"
              />
              <div className="flex w-full z-20">
                <p className="text-neutral-200 font-bold capitalize text-2xl w-1/2">
                  {pokemon.name}
                </p>
                <span className="text-neutral-200 w-1/2 font-semibold text-right">
                  #{pokemon.id}
                </span>
              </div>
            </div>

            <div className="flex w-full gap-5 justify-center pt-16">
              {pokemon.types.map((type) => {
                return <TypeItem key={type.slot} type={type.type} />;
              })}
            </div>

            <div className="w-full flex flex-col gap-5 px-2 pt-10 md:px-5">
              <h3
                style={{
                  color: COLORS_TYPES[pokemonType],
                }}
                className="font-semibold text-lg"
              >
                About
              </h3>

              <div className="flex justify-between items-end">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-neutral-50">
                    {pokemon.height / 10} m
                  </span>
                  <span className="text-neutral-400">Height</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-neutral-50">
                    {pokemon.weight / 10} kg
                  </span>
                  <span className="text-neutral-400">Weight</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-col">
                    {pokemon.abilities.map((ability) => {
                      return (
                        <span
                          key={ability.slot}
                          className="text-neutral-50 capitalize"
                        >
                          {ability.ability.name.replace("-", " ")}
                        </span>
                      );
                    })}
                  </div>

                  <span className="text-neutral-400">Abilities</span>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-5 px-2 pt-10 md:px-5">
              <h3
                style={{
                  color: COLORS_TYPES[pokemonType],
                }}
                className="font-semibold text-lg"
              >
                Weaknesses
              </h3>
              {weaknesses && (
                <div className="flex w-full flex-wrap gap-5">
                  {weaknesses.map((type) => {
                    return <TypeItem key={type.name} type={type} />;
                  })}
                </div>
              )}
            </div>

            <div className="w-full flex flex-col gap-5 px-2 pt-10 md:px-5">
              <h3
                style={{
                  color: COLORS_TYPES[pokemonType],
                }}
                className="font-semibold text-lg"
              >
                Base stats
              </h3>

              <div className="w-full flex flex-col gap-2">
                {pokemon.stats.map((stat) => {
                  return (
                    <StatsBar
                      key={stat.stat.name}
                      stat={stat}
                      pokemonType={pokemonType}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex w-full justify-between items-center px-5">
            <div className="w-8 h-8 bg-red-600 border-2 border-neutral-900 rounded-full" />
            <div className="flex flex-col gap-1">
              <div className="h-1 w-8 bg-neutral-900 rounded-md" />
              <div className="h-1 w-8 bg-neutral-900 rounded-md" />
              <div className="h-1 w-8 bg-neutral-900 rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex w-full justify-between">
          <div className="flex gap-6">
            <div className="bg-neutral-800 border-2 h-10 w-10 rounded-full border-neutral-900" />
            <div className="flex flex-col gap-5">
              <div className="flex gap-8">
                <div className="h-2 w-14 border-2 border-neutral-900 rounded-md" />
                <div className="h-2 w-14 border-2 bg-blue-900 border-neutral-900 rounded-md" />
              </div>

              <div className="flex p-2 w-full">
                <div className="w-full h-16 rounded-md bg-green-600 border-2 border-neutral-900 " />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="w-10 h-10 bg-neutral-800 rounded-tl-md rounded-tr-md border-neutral-900  border-l-2 border-r-2 border-t-2" />
            <div className="flex">
              <div className="w-10 h-10 bg-neutral-800 rounded-tl-md rounded-bl-md border-l-2 border-b-2 border-t-2 border-neutral-900" />
              <div className="w-10 h-10 bg-neutral-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-red-700 border-2 rounded-full border-neutral-900" />
              </div>
              <div className="w-10 h-10 bg-neutral-800 rounded-tr-md rounded-br-md border-r-2 border-b-2 border-t-2 border-neutral-900" />
            </div>

            <div className="w-10 h-10 bg-neutral-800 rounded-bl-md rounded-br-md border-l-2 border-r-2 border-b-2 border-neutral-900" />
          </div>
        </div>
      </div>
    </div>
  );
}
