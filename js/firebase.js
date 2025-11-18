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

// =============================================
// CONFIGURATION FIREBASE - À COPIER COLLER
// =============================================

const firebaseConfig = {
    apiKey: "AIzaSyC...", // VOTRE VRAIE API KEY
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet-id", 
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

console.log('🔥 Firebase initialisé');

// Variables globales
let currentUser = null;
let isAdmin = false;
let students = [];
let contributions = [];
let expenses = [];

console.log('🔥 Firebase configuré avec succès');


