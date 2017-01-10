const helpers = {
  nameToSlug(name) {
    if (typeof name === 'undefined') {
      return '';
    } else if (name === 'Nidoran\u2642') {
      return 'nidoran-m';
    } else if (name === 'Nidoran\u2640') {
      return 'nidoran-f';
    } else if (name === 'Mr. Mime') {
      return 'mr-mime';
    } else if (name === 'Farfetch\'d') {
      return 'farfetchd';
    }
    return name.toLowerCase();
  },
  getPokemonName(pokemon) {
    return pokemon.Name;
  },  
  getPokemonSlug(pokemon) {
    return helpers.nameToSlug(pokemon.Name);
  },
  getPokemonImage(k) {
    const slug = helpers.nameToSlug(k.Name);
    return `${slug}.jpg`;
  },
  makeLink(origin = '', pokemons) {
    let link = `${origin}/`;
    let next = '?';
    pokemons.forEach((p) => { link = `${link}${next}pokemon[]=${p.slug}`; next = '&'; });
    return link;
  }
};

export default helpers;
