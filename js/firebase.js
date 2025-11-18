// =============================================
// CONFIGURATION FIREBASE - À MODIFIER AVEC VOS VALEURS
// =============================================

const firebaseConfig = {
  apiKey: "AIzaSyCgyMUmbFoHRAFxEWu8t5qlb6KbLTdsV7w",
  authDomain: "gestion-cotisations-classe.firebaseapp.com",
  projectId: "gestion-cotisations-classe",
  storageBucket: "gestion-cotisations-classe.firebasestorage.app",
  messagingSenderId: "812417756543",
  appId: "1:812417756543:web:d6fefb3dbe87b4ccfefe4a"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Références aux services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Variables globales
let currentUser = null;
let isAdmin = false;
let students = [];
let contributions = [];
let expenses = [];

console.log('🔥 Firebase configuré avec succès');

