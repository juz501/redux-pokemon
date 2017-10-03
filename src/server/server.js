import Express from 'express';
import React from 'react';
import compression from 'compression';
import qs from 'qs';
import sslRedirect from 'heroku-ssl-redirect';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import https from 'https';
import fs from 'fs';
import helpers from '../helpers/helpers';
import pokemonApp from '../reducers/index';
import App from '../containers/App';
import pokemonListJSON from '../../assets/json/pokemon.json';

const app = Express();

app.use(sslRedirect());

app.set('port', process.env.PORT || 20001);
app.use('/build', Express.static('build'));

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
}

app.use(compression({ filter: shouldCompress }));

function renderFullPage(html, preloadedState) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <title>Redux Pokemon</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"> 
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

app.get('/sw.js', (req, res) => {
  res.set('Content-Type', 'text/javascript');
  res.send('console.log("hello world");');
});

function handleRender(req, res) {
  const params = qs.parse(req.query);
  const pokemon = params.pokemon || [];
  let pokemons = [];
  const pokemonNames = pokemonListJSON.map(helpers.getPokemonName) || [];
  const pokemonSlugs = pokemonListJSON.map(helpers.getPokemonSlug) || [];
  const pokemonImages = pokemonListJSON.map(helpers.getPokemonImage) || [];

  Object.keys(pokemonSlugs).forEach((key) => {
    if (pokemon.indexOf(pokemonSlugs[key]) !== -1 || pokemon === 'all') {
      pokemons = [...pokemons, {
        name: pokemonNames[key],
        slug: pokemonSlugs[key],
        image: pokemonImages[key],
      }];
    }
  });

  pokemonImages.forEach((pokeimage) => {
    if (!fs.existsSync(`build/images/${pokeimage}`)) {
      download(`https://img.pokemondb.net/artwork/${pokeimage}`, `build/images/${pokeimage}`);
    }
  });

  const preloadedState = {
    pokemons: { matches: pokemons, link: helpers.makeLink(req.origin, pokemons) },
    search: { searchMatches: [], searchInput: '' },
    pokemonData: pokemonListJSON,
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
  // const port = app.get('port');
  // console.log(`Web server listening on port ${port}`); // eslint-disable-line no-console
}

app.listen(app.get('port'), notifyStart);

process.on('SIGTERM', () => {
  app.close(() => {
    process.exit(0);
  });
});
