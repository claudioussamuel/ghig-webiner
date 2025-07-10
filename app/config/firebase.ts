import {FirebaseApp, initializeApp,getApps,getApp} from "firebase/app"
import { getAuth } from "firebase/auth"
import {Firestore, getFirestore} from "firebase/firestore"

const firebaseConfig : {
    readonly apiKey: string | undefined,
    readonly authDomain: string | undefined,
    readonly projectId: string | undefined,
    readonly storageBucket: string | undefined,
    readonly messagingSenderId: string | undefined,
    readonly appId: string | undefined,
  } = {
    apiKey: "AIzaSyAMi85qRQSDrqhlxc-l4UYkegcRxa_FD7g",
    authDomain: "ghig-1a4f1.firebaseapp.com",
    projectId: "ghig-1a4f1",
    storageBucket: "ghig-1a4f1.firebasestorage.app",
    messagingSenderId: "412743227043",
    appId: "1:412743227043:web:5a99ae33d78b8521655116",
  
  };
 

  const app : FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  export const db : Firestore = getFirestore(app);
  export const auth = getAuth(app);