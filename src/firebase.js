// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey = import.meta.env.VITE_API_KEY;

const firebaseConfig = {
	apiKey: apiKey,
	authDomain: 'scheduler185185185.firebaseapp.com',
	databaseURL:
		'https://scheduler185185185-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'scheduler185185185',
	storageBucket: 'scheduler185185185.appspot.com',
	messagingSenderId: '698076819390',
	appId: '1:698076819390:web:6d0662772a18ef509393ef',
	measurementId: 'G-V55ZNXBDT4',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
