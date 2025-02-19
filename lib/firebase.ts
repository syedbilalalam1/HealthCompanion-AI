import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC-_rO0XOpe9l05pGe4k6C5bB-n0ArPDGI",
  authDomain: "posture-fix-f48e8.firebaseapp.com",
  projectId: "posture-fix-f48e8",
  storageBucket: "posture-fix-f48e8.firebasestorage.app",
  messagingSenderId: "1082230464244",
  appId: "1:1082230464244:web:28d42bdb049b96fdc088a1",
  measurementId: "G-KY1458BL8K"
}

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)

export { app, auth } 