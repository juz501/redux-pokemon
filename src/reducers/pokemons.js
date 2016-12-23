function mapPokemons(k) {
  return k.Name;
}

function nameToSlug(name) {
  if (typeof name === 'undefined') {
    return '';
  } else if (name === 'Nidoran \u2642') {
    return 'nidoran-m';
  } else if (name === 'Nidoran \u2640') {
    return 'nidoran-f';
  } else if (name === 'Mr. Mime') {
    return 'mr-mime';
  } else if (name === 'Farfetch\'d') {
    return 'farfetchd';
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

function makeLink(origin = '', pokemons) {
  let link = `${origin}/`;
  let next = '?';
  pokemons.forEach((p) => { link = `${link}${next}pokemon[]=${p.slug}`; next = '&'; });
  return link;
}

const initialMatches = [{ name: 'Pikachu', slug: 'pikachu', image: '/build/images/pikachu.jpg' }];

const pokemons = (state = {
  matches: initialMatches,
  link: makeLink('', initialMatches),
}, action) => {
  switch (action.type) {
    case 'ADD_POKEMON': {
      const slug = (action.slug ? nameToSlug(action.slug) : '');
      const pokemonListJSON = action.data;
      const pokemonNames = pokemonListJSON.map(mapPokemons) || [];
      const pokemonSlugs = pokemonListJSON.map(mapPokemonSlugs) || [];
      const pokemonImages = pokemonListJSON.map(mapPokemonImages) || [];
      let matches = [...state.matches];
      Object.keys(pokemonSlugs).forEach((key) => {
        const newObj = {
          name: pokemonNames[key],
          slug: pokemonSlugs[key],
          image: pokemonImages[key],
        };
        if (pokemonSlugs[key].indexOf(slug) !== -1 && !findPokemon(state.matches, newObj.slug)) {
          matches = [...state.matches, newObj];
        }
      });
      const link = makeLink(window.location.origin, matches);
      return Object.assign({}, state, { matches, link });
    }
    default: {
      return state;
    }
  }
};

export default pokemons;
