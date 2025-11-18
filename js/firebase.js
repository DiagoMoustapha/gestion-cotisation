// Charger la configuration Firebase
console.log("🚀 Chargement de la configuration Firebase...");

// Importer les modules Firebase (assurez-vous que les scripts sont dans index.html)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgyMUmbFoHRAFxEWu8t5qlb6KbLTdsV7w",
  authDomain: "gestion-cotisations-classe.firebaseapp.com",
  projectId: "gestion-cotisations-classe",
  storageBucket: "gestion-cotisations-classe.firebasestorage.app",
  messagingSenderId: "812417756543",
  appId: "1:812417756543:web:d6fefb3dbe87b4ccfefe4a"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exporter pour utilisation globale
window.auth = auth;
window.db = db;
window.storage = storage;

console.log("✅ Firebase initialisé avec succès");
