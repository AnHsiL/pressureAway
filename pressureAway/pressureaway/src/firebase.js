import firebase from 'firebase/app';
import getFirestore from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBI2Tp1qwk4mnJ5O36qOsRoJr39QgKLpuQ",
  authDomain: "project-e2d9c.firebaseapp.com",
  databaseURL: "https://project-e2d9c-default-rtdb.firebaseio.com",
  projectId: "project-e2d9c",
  storageBucket: "project-e2d9c.appspot.com",
  messagingSenderId: "950374627701",
  appId: "1:950374627701:web:7675b953469459faf3fb3c",
  measurementId: "G-JG24VJJRE4"
};

const firebaseApp = firebase(firebaseConfig);
export const db = getFirestore(firebaseApp);