import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnuO1V0r0YVyuQ_ChYptgZaHMoewWI1lU",
  authDomain: "desocial-insta.firebaseapp.com",
  projectId: "desocial-insta",
  storageBucket: "desocial-insta.appspot.com",
  messagingSenderId: "469686568044",
  appId: "1:469686568044:web:36c65a6a6c6e194f1d0449",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
