import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import history from '../history';
import { saga } from '../ducks/people';

const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(
  sagaMiddleware,
  routerMiddleware(history),
  thunk,
  logger
);

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(); // dev only

const store = createStore(reducer, reduxDevTools, enhancer);
window.store = store; // dev only

sagaMiddleware.run(saga);

export default store;
