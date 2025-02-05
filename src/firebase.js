import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHZOmC4BVlNtRcwGAkExUWX-kWKhGsHPo",
  authDomain: "courier-service-xxxxx.firebaseapp.com",
  projectId: "courier-service-xxxxx",
  storageBucket: "courier-service-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef0123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 