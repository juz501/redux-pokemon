
const initialState = {
	"pokemons": [
    { "name": 'pikachu' },
    { "name": 'charmander' }
  ]
};

function pokemonApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }  
  return state;
}

export default pokemonApp;
