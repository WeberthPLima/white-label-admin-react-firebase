import firebase from 'firebase';

// Adicione suas credenciais do firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;
export const Firestore = firebase.firestore();
export const Storage = firebase.storage();
