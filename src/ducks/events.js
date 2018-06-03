import { all, take, call, put } from 'redux-saga/effects';
import { Record, OrderedMap } from 'immutable';
import { createSelector } from 'reselect';
import firebase from 'firebase';

import { appName, FAIL, REQUEST, SUCCESS } from '../config';

/**
 * Constants
 */
export const moduleName = 'events';
export const FETCH_ALL = `${appName}/${moduleName}/FETCH_ALL`;

/**
 * Reducer
 */
export const ReducerRecord = Record({
  entities: new OrderedMap({}),
  loading: false,
  loaded: false,
  error: null
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload, error } = action;

  switch (type) {
    case FETCH_ALL + REQUEST:
      return state
        .set('loading', true)
        .set('loaded', false)
        .set('error', null);
    case FETCH_ALL + SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('error', null)
        .set('entities', new OrderedMap(payload));
    case FETCH_ALL + FAIL:
      return state
        .set('loading', false)
        .set('loaded', false)
        .set('error', error);
    default:
      return state;
  }
}

/**
 * Selectors
 */
const eventsGetter = (state) => state.events.entities;

export const eventsSelector = createSelector(eventsGetter, (events) => {
  // return mapToArr(events);
});

/**
 * Action creators
 */

export function fetchAll() {
  return {
    type: FETCH_ALL + REQUEST
  };
}
/**
 * Sagas
 */

export const fetchAllSaga = function*() {
  while (true) {
    yield take(FETCH_ALL + REQUEST);
    const ref = firebase.database().ref('events');
    const data = yield call([ref, ref.once], 'value');
    yield put({
      type: FETCH_ALL + SUCCESS,
      payload: data.val()
    });
  }
};

export function* saga() {
  yield all([fetchAllSaga()]);
}
