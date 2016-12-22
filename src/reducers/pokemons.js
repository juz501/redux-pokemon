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

function mapPokemonImages(k) {
  const slug = nameToSlug(k.Name);
  return `${slug}.jpg`;
}

function findPokemon(pokemons, slug) {
  return pokemons.some(arrVal => slug === arrVal.slug);
}

const pokemons = (state = [{ name: 'Pikachu', slug: 'pikachu', image: '/build/images/pikachu.jpg' }], action) => {
  switch (action.type) {
    case 'ADD_POKEMON': {
    const slug = (action.slug ? nameToSlug(action.slug) : '');
      const pokemonListJSON = action.data;
      const pokemonNames = pokemonListJSON.map(mapPokemons) || [];
      const pokemonSlugs = pokemonListJSON.map(mapPokemonSlugs) || [];
      const pokemonImages = pokemonListJSON.map(mapPokemonImages) || [];
      let matches = [...state];
      Object.keys(pokemonSlugs).forEach((key) => {
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
