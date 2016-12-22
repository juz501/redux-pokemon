function mapPokemonSlugs(k) {
  return k.Name.toLowerCase();
}

const search = (state = { searchMatches: [], searchInput: '' }, action) => {
  switch (action.type) {
    case 'SEARCH_POKEMON': {
      const text = action.text;
      let matches = [];
      const pokemonData = action.data;
      const pokemonSlugs = pokemonData.map(mapPokemonSlugs);
      Object.keys(pokemonSlugs).forEach((key) => {
        if (pokemonSlugs[key].indexOf(text) !== -1) {
          matches = [...matches, pokemonSlugs[key]];
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
