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

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
}

app.use(compression({ filter: shouldCompress }));

app.use('/build', Express.static('build'));
app.use('/', Express.static('public'));

function renderFullPage(html, preloadedState) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <title>Redux Pokemon</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="theme-color" content="#7FAD71" /> 
      <link rel="manifest" href="/manifest.json" />
      <style>*{box-sizing:border-box}body,ul,li,h1,h2,h3,h4,h5,h6{padding:0;margin:0}@font-face{font-family:'pokemon_gbregular';src:url('/build/fonts/pokemon_gb-webfont.woff2') format('woff2'),url('/build/fonts/pokemon_gb-webfont.woff') format('woff');font-weight:normal;font-style:normal}body{font-family:'pokemon_gbregular',sans-serif;font-size:12px;background:#7fad71 url('/build/images/background-small.png') top center no-repeat}h1,h2,h3,h4,h5,h6{line-height:2}div.selectWrapper{position:fixed;width:100%;background-color:#79c9f9;padding:10px}div.selector{text-align:center;width:50%;min-width:230px;margin:0 0 0 -25%;position:relative;left:50%;top:0}@media screen and (max-width:805px){div.selector{width:386px;margin:0 0 0 -193px}}@media screen and (max-width:422px){div.selectWrapper{position:relative}div.selector{width:100%;margin:0;padding:0 5px;left:0}}div.selector input{min-width:100%;padding:5px 1px}div.pokemonListWrapper{padding-top:97px}a.permalink{margin:0 auto;width:108px;display:block}ul.pokemonList{margin:0 auto}@media screen and (max-width:2000px){ul.pokemonList{width:1800px}}@media screen and (max-width:1800px){ul.pokemonList{width:1600px}}@media screen and (max-width:1600px){ul.pokemonList{width:1400px}}@media screen and (max-width:1400px){ul.pokemonList{width:1200px}}@media screen and (max-width:1200px){ul.pokemonList{width:1000px}}@media screen and (max-width:1000px){ul.pokemonList{margin:0 auto;width:800px}}@media screen and (max-width:800px){ul.pokemonList{width:600px}}@media screen and (max-width:600px){ul.pokemonList{width:400px}}@media screen and (max-width:400px){ul.pokemonList{width:200px}}@media screen and (max-width:422px){div.pokemonListWrapper{padding:0}}li.pokemonItem{display:inline-block;list-style:none;text-align:center;padding:20px;max-width:200px}div.pokemon{display:table-cell;vertical-align:middle;width:200px;height:160px;padding:20px 30px;border-radius:200px;background-color:white;border:black solid 2px}div.pokemon img{max-width:100%;max-height:100%}ul.resultList{position:relative;left:0;top:0;background-color:white;width:100%;z-index:1;border:1px solid black}li.result{list-style:none;border:2px solid transparent;padding:5px 0}li.result:hover{cursor:pointer;border:2px solid lightgreen}</style>
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
