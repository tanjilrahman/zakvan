import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCzYnKf3uIlL4NiiQNMF1X1wW7p_qikNoI',
  authDomain: 'zakvan-3f619.firebaseapp.com',
  projectId: 'zakvan-3f619',
  storageBucket: 'zakvan-3f619.appspot.com',
  messagingSenderId: '1016734420196',
  appId: '1:1016734420196:web:36973f4d8339617b8570f1',
  measurementId: 'G-J88JNX5V3R',
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export default db;
