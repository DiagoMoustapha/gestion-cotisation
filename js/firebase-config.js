// Configuration Firebase - NE PAS DÉCLARER PLUSIEURS FOIS
const firebaseConfig = {
    apiKey: "votre-api-key",
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet-id",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "votre-sender-id",
    appId: "votre-app-id"
};

// Initialiser Firebase UNE SEULE FOIS
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Exporter les instances
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log("✅ Firebase configuré avec succès");
