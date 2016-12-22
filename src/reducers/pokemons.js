function mapPokemons(k) {
  return k.Name;
}

function mapPokemonSlugs(k) {
  return k.Name.toLowerCase();
}

function mapPokemonImages(k) {
  if (k.Name === 'Nidoran \u2642') {
    return 'nidoran-m.jpg';
  } else if (k.Name === 'Nidoran \u2640') {
    return 'nidoran-f.jpg';
  } else if (k.Name === 'Mr. Mime') {
    return 'mr-mime.jpg';
  }
  return `${k.Name.toLowerCase()}.jpg`;
}

function findPokemon(pokemons, name) {
  return pokemons.some(arrVal => name === arrVal.name);
}

const pokemons = (state = [{ name: 'pikachu', image: '' }], action) => {
  switch (action.type) {
    case 'ADD_POKEMON': {
      const slug = action.slug;
      const pokemonListJSON = action.data;
      const pokemonNames = pokemonListJSON.map(mapPokemons) || [];
      const pokemonSlugs = pokemonListJSON.map(mapPokemonSlugs) || [];
      const pokemonImages = pokemonListJSON.map(mapPokemonImages) || [];
      let matches = [...state];
      Object.keys(pokemonNames).forEach((key) => {
        const newObj = {
          name: pokemonNames[key],
          slug: pokemonSlugs[key],
          image: pokemonImages[key]
        };
        if (pokemonSlugs[key].indexOf(slug) !== -1 && !findPokemon(state, newObj.slug)) {
          matches = [...state, newObj];
        }
      });
      return matches;
    }
    default: {
      return state;
    }
  }
};

export default pokemons;
