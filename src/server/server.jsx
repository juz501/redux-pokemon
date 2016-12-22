import path from 'path';
import Express from 'express';
import React from 'react';
import qs from 'qs';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import pokemonApp from './reducers';
import App from './containers/App';

const app = Express();
const port = 3000;

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.REDUX_PRELOADED_STATE = ${JSON.stringify(preloadedState)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

function handleRender(req, res) {
  const params = qs.parse(req.query);
  const pokemon = params.pokemon || 'pikachu';

  const preloadedState = { pokemon };

  const store = createStore(pokemonApp, preloadedState);

  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>);

  const finalState = store.getState();

  res.send(renderFullPage(html, finalState));
}

app.use(handleRender);

app.listen(port);
