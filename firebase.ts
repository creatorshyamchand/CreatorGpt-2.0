import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Configuration from user request
const firebaseConfig = {
    apiKey: "AIzaSyB2aUW-D5lwBFAr118CnDCjWbbc7Za1SKM",
    authDomain: "creatorgpt-solver.firebaseapp.com",
    projectId: "creatorgpt-solver",
    storageBucket: "creatorgpt-solver.firebasestorage.app",
    messagingSenderId: "982978006189",
    appId: "1:982978006189:web:8622899265cf3f4d8f8a24",
    measurementId: "G-MCZ0SHST3S"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;