// Importar Firebase (usamos la versión modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Configuración de tu proyecto (cámbiala por la tuya)
const firebaseConfig = {
  apiKey: "AIzaSyDLJkaibqhwlRHnduaZ8YpcKt8XhSpMJd4",
  authDomain: "festivalapp-1d8a4.firebaseapp.com",
  projectId: "festivalapp-1d8a4",
  storageBucket: "festivalapp-1d8a4.firebasestorage.app",
  messagingSenderId: "450300143597",
  appId: "1:450300143597:web:f8088b228d80eeb61169e4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
