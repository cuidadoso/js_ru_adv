import firebase from 'firebase';

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