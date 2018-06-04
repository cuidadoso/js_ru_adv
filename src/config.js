import firebase from 'firebase/app';

export const appName = 'js-ru-adv';
export const firebaseCongig = {
  apiKey: 'AIzaSyDdnYMxLvkhe3-H-J4OdRh3gw08PiuZ8Q8',
  authDomain: `${appName}.firebaseapp.com`,
  databaseURL: `https://${appName}.firebaseio.com`,
  projectId: appName,
  storageBucket: `${appName}.appspot.com`,
  messagingSenderId: '262763417724'
};

firebase.initializeApp(firebaseCongig);

export const REQUEST = '_REQUEST';
export const SUCCESS = '_SUCCESS';
export const FAIL = '_FAIL';
