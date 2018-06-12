import { all, take, call, put, select } from 'redux-saga/effects';
import { Record, OrderedMap, OrderedSet } from 'immutable';
import { createSelector } from 'reselect';
import firebase from 'firebase/app';
import 'firebase/database';

import { appName, FAIL, REQUEST, START, SUCCESS } from '../config';
import { fbDataToEntities, mapToArr } from './utils';

/**
 * Constants
 */
export const moduleName = 'events';
export const FETCH_ALL = `${appName}/${moduleName}/FETCH_ALL`;
export const FETCH_LAZY = `${appName}/${moduleName}/FETCH_LAZY`;
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
    case FETCH_LAZY + START:
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
    case FETCH_LAZY + SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', Object.keys(payload).length < 10)
        .set('error', null)
        .mergeIn(['entities'], fbDataToEntities(payload, EventRecord));
    case FETCH_ALL + FAIL:
    case FETCH_LAZY + FAIL:
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
export const sectionSelector = createSelector(
  stateSelector,
  (state) => state.selected
);
export const selectedEventsSelector = createSelector(
  entitiesSelector,
  sectionSelector,
  (entities, selection) => selection.toArray().map((uid) => entities.get(uid))
);

/**
 * Action creators
 */
export function fetchAll() {
  return {
    type: FETCH_ALL + REQUEST
  };
}

export function fetchLazy() {
  return {
    type: FETCH_LAZY + REQUEST
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

export const fetchLazySaga = function*() {
  while (true) {
    yield take(FETCH_LAZY + REQUEST);
    const state = yield select(stateSelector);
    if (state.loading || state.loaded) continue;

    yield put({
      type: FETCH_LAZY + START
    });

    const lastEvent = state.entities.last();
    const ref = firebase
      .database()
      .ref('events')
      .orderByKey()
      .limitToFirst(10)
      .startAt(lastEvent ? lastEvent.uid : '');

    const data = yield call([ref, ref.once], 'value');
    yield put({
      type: FETCH_LAZY + SUCCESS,
      payload: data.val()
    });
  }
};

export function* saga() {
  yield all([fetchAllSaga(), fetchLazySaga()]);
}
