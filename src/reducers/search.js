function mapPokemons(k) {
  return k.Name.toLowerCase();
}

const search = (state = { searchMatches: [], searchInput: '' }, action) => {
  switch (action.type) {
    case 'SEARCH_POKEMON': {
      const text = action.text;
      let matches = [];
      const pokemonData = action.data;
      const pokemonNames = pokemonData.map(mapPokemons);
      Object.keys(pokemonNames).forEach((key) => {
        if (pokemonNames[key].indexOf(text) !== -1) {
          matches = [...matches, pokemonNames[key]];
        }
      });
      return Object.assign({}, state, { searchMatches: matches });
    }
    case 'ADD_POKEMON': {
      return Object.assign({}, state, { searchMatches: [], searchInput: '' });
    }
    case 'CHANGE_INPUT': {
      if (action.text === '') {
        return Object.assign({}, state, { searchMatches: [], searchInput: action.text });
      }
      return Object.assign({}, state, { searchInput: action.text });
    }
    default: {
      return state;
    }
  }
};

export default search;
