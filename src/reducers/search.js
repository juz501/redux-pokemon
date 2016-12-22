function mapPokemons(k) {
  return k.Name;
}

function nameToSlug(name) {
  if (typeof name == 'undefined') {
    return '';
  } else if (name === 'Nidoran \u2642') {
    return 'nidoran-m';
  } else if (name === 'Nidoran \u2640') {
    return 'nidoran-f';
  } else if (name === 'Mr. Mime') {
    return 'mr-mime';
  }
  return name.toLowerCase();  
}

function mapPokemonSlugs(k) {
  return nameToSlug(k.Name);
}

const search = (state = { searchMatches: [], searchInput: '' }, action) => {
  switch (action.type) {
    case 'SEARCH_POKEMON': {
      const text = action.text;
      let matches = [];
      const pokemonData = action.data;
      const pokemonNames = pokemonData.map(mapPokemons);
      const pokemonSlugs = pokemonData.map(mapPokemonSlugs);
      Object.keys(pokemonSlugs).forEach((key) => {
        if (pokemonSlugs[key].indexOf(text) !== -1) {
          matches = [...matches, { name: pokemonNames[key], slug: pokemonSlugs[key] }];
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
