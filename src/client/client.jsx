import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from '../containers/App';
import pokemonApp from '../reducers';

const preloadedState = window.REDUX_PRELOADED_STATE;

const store = createStore(pokemonApp, preloadedState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
