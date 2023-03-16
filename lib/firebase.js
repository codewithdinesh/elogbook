
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { EmailAuthCredential, GoogleAuthProvider, getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";
import { env } from "@/next.config";


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSENGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);
const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

const authProvider = new GoogleAuthProvider();
const emailAuthProvider = new EmailAuthCredential();

export {
    auth,
    db,
    storage,
    authProvider,
    emailAuthProvider
}