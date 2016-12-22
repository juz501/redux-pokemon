import React, { PropTypes } from 'react';

const App = ({ pokemons }) => (
  <ul>{pokemons.map((pokemon, i) => 
    <li key={i} style={{ display: 'inline-block', listStyle: 'none', textAlign: 'center', padding: 20 }} >
      <img src={ "https://img.pokemondb.net/artwork/" + pokemon.name + '.jpg'} width="200" height="200" />
      <h2>{pokemon.name}</h2>
    </li>)}
  </ul>
);

App.propTypes = {
  pokemons: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })).isRequired
};

export default App;
