import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBkTG96hUu4ADIGaHmQo8Qk3cPlIv1_m44",
  authDomain: "linkedin-app-cdb72.firebaseapp.com",
  projectId: "linkedin-app-cdb72",
  storageBucket: "linkedin-app-cdb72.appspot.com",
  messagingSenderId: "94984573814",
  appId: "1:94984573814:web:b73042c75dbacff6d3e057",
  measurementId: "G-XZH4NPN7YK",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage };
export default db;
