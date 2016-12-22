// import path from 'path';
import Express from 'express';
import React from 'react';
import qs from 'qs';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import pokemonApp from '../reducers';
import App from '../containers/App';

const app = Express();
app.set('port', process.env.PORT || 3000);
app.use('/build', Express.static('build'));

function renderFullPage(html, preloadedState) {
  return `<!doctype html>
  <html>
    <head>
      <title>Redux</title>
    </head>
    <body>
      <div id="root">${html}</div>
      <script>
        window.REDUX_PRELOADED_STATE = ${JSON.stringify(preloadedState)};
      </script>
      <script src="/build/bundle.js"></script>
    </body>
  </html>`;
}

function handleRender(req, res) {
  const params = qs.parse(req.query);
  const pokemon = params.pokemon || 'pikachu';
  let pokemons = [];

  for (let key in pokemon) {
    pokemons = [...pokemons, { name: pokemon[key] }];
  }
  const preloadedState = { pokemons: pokemons };

  const store = createStore(pokemonApp, preloadedState);

  const html = renderToString(
    <Provider store={store}>
      <App pokemons={store.getState().pokemons} />
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
