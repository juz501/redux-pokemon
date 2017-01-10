export const SEARCH_POKEMON = 'SEARCH_POKEMON';
export const ADD_POKEMON = 'ADD_POKEMON';
export const CHANGE_INPUT = 'CHANGE_INPUT';
export const SHARE_POKEMON = 'SHARE_POKEMON';

export function findPokemon(text, data) {
  return { type: SEARCH_POKEMON, text, data };
}

export function addPokemon(slug, data) {
  return { type: ADD_POKEMON, slug, data };
}

export function changeInput(text) {
  return { type: CHANGE_INPUT, text };
}

export function sharePokemon(pokemons, pokemonData) {
  return { type: SHARE_POKEMON, pokemons, pokemonData };
}
