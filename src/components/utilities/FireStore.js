import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs,where,query,updateDoc,Timestamp,orderBy } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "Your apiKey",
  authDomain: "Your authDomain",
  projectId: "Your projectId",
  storageBucket: "Your storageBucket",
  messagingSenderId: "Your messagingSenderId",
  appId: "Your appId"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app,db,getFirestore, collection, addDoc, getDocs,where,query,updateDoc,Timestamp,orderBy};