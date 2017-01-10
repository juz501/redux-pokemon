import { combineReducers } from 'redux';
import pokemons from './pokemons';
import search from './search';
import pokemonData from './pokemonData';

const pokemonApp = combineReducers({
  pokemons,
  search,
  pokemonData,
});

export default pokemonApp;
