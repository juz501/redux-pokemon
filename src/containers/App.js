import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { findPokemon, changeInput, addPokemon } from '../actions/index';

const myApp = ({
  pokemons,
  searchInput,
  searchResults,
  pokemonData,
  link,
  onInputChange,
  onFindPokemon,
  onSelectPokemon,
  }) => (
    <div>
      <div className="selectWrapper">
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
          { searchResults.length > 0 ? <ul className="resultList">{searchResults.map((res, i) => <li key={i} className="result" onClick={() => { onSelectPokemon(res.slug, pokemonData); }}>{res.name}</li>)}</ul> : '' }
        </div>
      </div>
      <div className="pokemonListWrapper">
        <a href={link} className="permalink">Permalink</a>
        <ul className="pokemonList">{pokemons.map((pokemon, i) =>
          <li key={i} className="pokemonItem">
            <h2>{pokemon.name}</h2>
            <div className="pokemon">
              <img src={`/build/images/${pokemon.image}`} alt={pokemon.name} width="auto" height="auto" />
            </div>
          </li>)}
        </ul>
      </div>
    </div>
);

myApp.propTypes = {
  pokemons: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  })).isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  })).isRequired,
  searchInput: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  pokemonData: PropTypes.arrayOf(PropTypes.object).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onFindPokemon: PropTypes.func.isRequired,
  onSelectPokemon: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  pokemons: state.pokemons.matches,
  searchResults: state.search.searchMatches,
  searchInput: state.search.searchInput,
  pokemonData: state.pokemonData,
  link: state.pokemons.link,
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
  },
});

const App = connect(
  mapStateToProps,
  mapDispatchToProps,
)(myApp);

export default App;
