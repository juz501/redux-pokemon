import helpers from '../helpers/helpers';

function findPokemon(pokemons, slug) {
  return pokemons.some(arrVal => slug === arrVal.slug);
}

const initialMatches = [{ name: 'Pikachu', slug: 'pikachu', image: '/build/images/pikachu.jpg' }];

const pokemons = (state = {
  matches: initialMatches,
  link: helpers.makeLink('', initialMatches),
}, action) => {
  switch (action.type) {
    case 'ADD_POKEMON': {
      const slug = (action.slug ? helpers.nameToSlug(action.slug) : '');
      const pokemonListJSON = action.data;
      const pokemonNames = pokemonListJSON.map(helpers.getPokemonName) || [];
      const pokemonSlugs = pokemonListJSON.map(helpers.getPokemonSlug) || [];
      const pokemonImages = pokemonListJSON.map(helpers.getPokemonImage) || [];
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
      const link = helpers.makeLink(window.location.origin, matches);
      return Object.assign({}, state, { matches, link });
    }
    default: {
      return state;
    }
  }
};

export default pokemons;
