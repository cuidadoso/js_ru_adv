import { List, Record } from 'immutable';
import {
  all,
  put,
  take,
  takeEvery,
  call,
  select,
  fork,
  spawn,
  cancel,
  cancelled,
  race
} from 'redux-saga/effects';
import { delay, eventChannel } from 'redux-saga';
import { createSelector } from 'reselect';
import firebase from 'firebase';
import { reset } from 'redux-form';

import { appName } from '../config';
import { fbDataToEntities, mapToArr } from './utils';

export const moduleName = 'peaple';
export const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`;
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`;
export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`;
export const FETCH_ALL_ERROR = `${prefix}/FETCH_ALL_ERROR`;
export const ADD_EVENT_REQUEST = `${prefix}/ADD_EVENT_REQUEST`;
export const ADD_EVENT_SUCCESS = `${prefix}/ADD_EVENT_SUCCESS`;

const ReducerState = Record({
  entities: new List([]),
  loading: false
});

const PersonRecord = Record({
  uid: null,
  firstName: null,
  lastName: null,
  email: null,
  events: []
});

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL_REQUEST:
    case ADD_PERSON_REQUEST:
      return state.set('loading', true);

    case ADD_PERSON_SUCCESS:
      return state
        .set('loading', false)
        .setIn(['entities', payload.uid], new PersonRecord(payload));

    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', false)
        .set('entities', fbDataToEntities(payload, PersonRecord));

    case ADD_EVENT_SUCCESS:
      return state.setIn(
        ['entities', payload.personUid, 'events'],
        payload.events
      );
    default:
      return state;
  }
}

export const stateSelector = (state) => state[moduleName];
export const entitiesSelector = createSelector(
  stateSelector,
  (state) => state.entities
);
export const idSelector = (_, props) => props.uid;
export const peopleListSelector = createSelector(entitiesSelector, (entities) =>
  mapToArr(entities)
);
export const personSelector = createSelector(
  entitiesSelector,
  idSelector,
  (entities, id) => entities.get(id)
);

export function addPerson(person) {
  return {
    type: ADD_PERSON_REQUEST,
    payload: person
  };
}

export function fetchAllPeople() {
  return {
    type: FETCH_ALL_REQUEST
  };
}

export function addEventToPerson(eventUid, personUid) {
  return {
    type: ADD_EVENT_REQUEST,
    payload: {
      eventUid,
      personUid
    }
  };
}
export const addPersonSaga = function*(action) {
  const peopleRef = firebase.database().ref('people');

  try {
    const ref = yield call([peopleRef, peopleRef.push], action.payload);

    yield put({
      type: ADD_PERSON_SUCCESS,
      payload: { ...action.payload, uid: ref.key }
    });

    yield put(reset('person'));
  } catch (error) {
    yield put({
      type: ADD_PERSON_ERROR,
      error
    });
  }
};

export const fetchAllSaga = function*() {
  const peopleRef = firebase.database().ref('people');
  try {
    const data = yield call([peopleRef, peopleRef.once], 'value');

    yield put({
      type: FETCH_ALL_SUCCESS,
      payload: data.val()
    });
  } catch (error) {
    yield put({
      type: FETCH_ALL_ERROR,
      error
    });
  }
};

export const addEventSaga = function*(action) {
  const { eventUid, personUid } = action.payload;
  const eventRef = firebase.database().ref(`/people/${personUid}/events`);

  const state = yield select(stateSelector);
  const events = state
    .getIn(['entities', personUid, 'events'])
    .concat(eventUid);
  try {
    yield call([eventRef, eventRef.set], events);
    yield put({
      type: ADD_EVENT_SUCCESS,
      payload: {
        personUid,
        events
      }
    });
  } catch (_) {}
};

export const backgroundSyncSaga = function*() {
  try {
    while (true) {
      yield call(fetchAllSaga);
      yield delay(2000);
    }
  } finally {
    if (yield cancelled()) {
      console.log('---', 'cancelled sync saga');
    }
  }
};

export const cancellableSync = function*() {
  let task;
  while (true) {
    const { payload } = yield take('@@router/LOCATION_CHANGE');
    if (payload && payload.pathname.includes('people')) {
      task = yield fork(realtimeSync);
      /* yield race({
        sync: realtimeSync(),
        delay: delay(6000)
      });*/
    } else if (task) {
      yield cancel(task);
    }
  }

  /*const task = yield fork(backgroundSyncSaga);
  yield delay(6000);
  yield cancel(task);*/
};

const createPeopleSocket = () =>
  eventChannel((emmit) => {
    const ref = firebase.database().ref('people');
    const callback = (data) => emmit({ data });
    ref.on('value', callback);
    return () => {
      console.log('---', 'unsubscribing');
      ref.off('value', callback);
    };
  });

export const realtimeSync = function*() {
  const chan = yield call(createPeopleSocket);
  try {
    while (true) {
      const { data } = yield take(chan);
      yield put({
        type: FETCH_ALL_SUCCESS,
        payload: data.val()
      });
    }
  } finally {
    yield call([chan, chan.close]);
    console.log('---', 'canceled realtime sags');
  }
};

export const saga = function*() {
  yield spawn(cancellableSync);
  yield all([
    takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
    takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
    takeEvery(ADD_EVENT_REQUEST, addEventSaga)
  ]);
};
