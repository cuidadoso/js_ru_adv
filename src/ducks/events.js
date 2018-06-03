import { all, take, call, put } from 'redux-saga/effects';
import { Record, OrderedMap, OrderedSet } from 'immutable';
import { createSelector } from 'reselect';
import firebase from 'firebase';

import { appName, FAIL, REQUEST, SUCCESS } from '../config';
import { fbDataToEntities, mapToArr } from './utils';

/**
 * Constants
 */
export const moduleName = 'events';
export const FETCH_ALL = `${appName}/${moduleName}/FETCH_ALL`;
export const SELECT_EVENT = `${appName}/${moduleName}/SELECT_EVENT`;

/**
 * Reducer
 */
export const ReducerRecord = Record({
  entities: new OrderedMap({}),
  selected: new OrderedSet([]),
  loading: false,
  loaded: false,
  error: null
});

export const EventRecord = Record({
  uid: null,
  title: null,
  url: null,
  where: null,
  when: null,
  month: null,
  submissionDeadline: null
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
        .set('entities', fbDataToEntities(payload, EventRecord));
    case FETCH_ALL + FAIL:
      return state
        .set('loading', false)
        .set('loaded', false)
        .set('error', error);
    case SELECT_EVENT:
      const { uid } = payload;
      return state.selected.contains(uid)
        ? state.update('selected', (selected) => selected.remove(uid))
        : state.update('selected', (selected) => selected.add(uid));
    default:
      return state;
  }
}

/**
 * Selectors
 */
export const stateSelector = (state) => state[moduleName];
export const entitiesSelector = createSelector(
  stateSelector,
  (state) => state.entities
);
export const eventListSelector = createSelector(entitiesSelector, (entities) =>
  mapToArr(entities)
);

/**
 * Action creators
 */

export function fetchAll() {
  return {
    type: FETCH_ALL + REQUEST
  };
}

export function selectEvent(uid) {
  return {
    type: SELECT_EVENT,
    payload: { uid }
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
