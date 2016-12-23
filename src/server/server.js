import Express from 'express';
import React from 'react';
import qs from 'qs';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import https from 'https';
import fs from 'fs';
import pokemonApp from '../reducers/index';
import App from '../containers/App';
import pokemonListJSON from '../../assets/json/pokemon.json';

const app = Express();
app.set('port', process.env.PORT || 3000);
app.use('/build', Express.static('build'));

function renderFullPage(html, preloadedState) {
  return `<!doctype html>
  <html>
    <head>
      <title>Redux Pokemon</title>
      <link rel="stylesheet" href="/build/css/style.css">
    </head>
    <body>
      <div id="root">${html}</div>
      <script type="application/javascript">
        window.REDUX_PRELOADED_STATE = ${JSON.stringify(preloadedState)};
      </script>
      <script src="/build/bundle.js"></script>
    </body>
  </html>`;
}

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

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', (err) => { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
}

function makeLink(origin = '', pokemons) {
  let link = `${origin}/`;
  let next = '?';
  pokemons.forEach((p) => { link = `${link}${next}pokemon[]=${p.slug}`; next = '&'; });
  return link;
}

function handleRender(req, res) {
  const params = qs.parse(req.query);
  const pokemon = params.pokemon || ['pikachu'];
  let pokemons = [];
  const pokemonNames = pokemonListJSON.map(mapPokemons) || [];
  const pokemonSlugs = pokemonListJSON.map(mapPokemonSlugs) || [];
  const pokemonImages = pokemonListJSON.map(mapPokemonImages) || [];

  Object.keys(pokemonSlugs).forEach((key) => {
    if (pokemon.indexOf(pokemonSlugs[key]) !== -1 || pokemon === 'all') {
      pokemons = [...pokemons, {
        name: pokemonNames[key],
        slug: pokemonSlugs[key],
        image: pokemonImages[key]
      }];
    }
  });

  pokemonImages.forEach((pokeimage) => {
    if (!fs.existsSync(`build/images/${pokeimage}`)) {
      download(`https://img.pokemondb.net/artwork/${pokeimage}`, `build/images/${pokeimage}`);
    }
  });

  const preloadedState = {
    pokemons: { matches: pokemons, link: makeLink(req.origin, pokemons) },
    search: { searchMatches: [], searchInput: '' },
    pokemonData: pokemonListJSON
  };

  const store = createStore(pokemonApp, preloadedState);

  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>);

  const finalState = store.getState();
  res.send(renderFullPage(html, finalState));
}

app.use(handleRender);

function notifyStart() {
  const port = app.get('port');
  console.log(`Web server listening on port ${port}`); // eslint-disable-line no-console
}

app.listen(app.get('port'), notifyStart);

process.on('SIGTERM', () => {
  app.close(() => {
    process.exit(0);
  });
});
