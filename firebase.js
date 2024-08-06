import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhM8acmgl-idMQBUbIn-e4xyFfwfST1zw",
  authDomain: "pantrytracker-be168.firebaseapp.com",
  projectId: "pantrytracker-be168",
  storageBucket: "pantrytracker-be168.appspot.com",
  messagingSenderId: "898434070996",
  appId: "1:898434070996:web:72fa9c009e504d3b13fe41",
  measurementId: "G-DTZ3M23BJ0",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };