import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { findPokemon, changeInput, addPokemon } from '../actions/index';

let App = ({
  pokemons,
  searchInput,
  searchResults,
  pokemonData,
  onInputChange,
  onFindPokemon,
  onSelectPokemon }) => (
    <div>
      <div className="selector">
        <h1>Pokemon Selector</h1>
        <input
          type="text"
          onChange={
            (e) => {
              if (e.target && e.target.value && e.target.value.length >= 3) {
                onFindPokemon(e.target.value, pokemonData);
              }
              onInputChange(e.target.value);
            }
          }
          value={searchInput}
          placeholder="Type and select to add more pokemon"
        />
        { searchResults.length > 0 ? <ul className="resultList">{searchResults.map((res, i) => <li key={i} className="result" onClick={() => { onSelectPokemon(res, pokemonData); }}>{res}</li>)}</ul> : '' }
      </div>
      <ul>{pokemons.map((pokemon, i) =>
        <li key={i} className="pokemon" >
          <img src={`/build/images/${pokemon.image}`} alt={pokemon.name} width="200" height="200" />
          <h2>{pokemon.name}</h2>
        </li>)}
      </ul>
    </div>
);

App.propTypes = {
  pokemons: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  })).isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.string.isRequired),
  searchInput: PropTypes.string.isRequired,
  pokemonData: PropTypes.arrayOf(PropTypes.object).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onFindPokemon: PropTypes.func.isRequired,
  onSelectPokemon: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  pokemons: state.pokemons,
  searchResults: state.search.searchMatches,
  searchInput: state.search.searchInput,
  pokemonData: state.pokemonData
});

const mapDispatchToProps = dispatch => ({
  onInputChange: (text) => {
    dispatch(changeInput(text));
  },
  onFindPokemon: (text, pokedata) => {
    dispatch(findPokemon(text, pokedata));
  },
  onSelectPokemon: (slug, pokedata) => {
    dispatch(addPokemon(slug, pokedata));
  }
});

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default App;
