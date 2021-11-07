import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCs5jBiHX_nzPmzmOPlsA2lf9o6EdS9goo',
  authDomain: 'lane-claim.firebaseapp.com',
  databaseURL: 'https://lane-claim.firebaseio.com',
  projectId: 'lane-claim',
  storageBucket: 'lane-claim.appspot.com',
  messagingSenderId: '532354359258'
}

firebase.initializeApp(config)

ReactDOM.render(
  <React.StrictMode>
    <App config={config} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
