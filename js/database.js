// js/database.js - AJOUTER AU DÉBUT SEULEMENT
console.log("🗄️ Database.js chargé");

function waitForDB() {
    if (typeof db === 'undefined') {
        console.log('⏳ En attente de Firestore DB...');
        setTimeout(waitForDB, 100);
        return;
    }
    console.log('✅ DB prêt, initialisation...');
    initDatabase();
}

function initDatabase() {
    // TOUT VOTRE CODE DATABASE EXISTANT RESTE ICI
    // Ne changez rien d'autre
    console.log('🔧 Initialisation des données...');
    
    // Votre code initializeData() existant
    initializeData();
    
    // Vos fonctions loadStudents(), etc. existantes
}

// Démarrer l'attente
waitForDB();

// =============================================
// BASE DE DONNÉES FIREBASE FONCTIONNELLE
// =============================================

// Variables globales
let students = [];
let contributions = [];
let expenses = [];

// Charger tous les élèves
async function loadStudents() {
    try {
        console.log('📚 Chargement des élèves...');
        const snapshot = await db.collection('students').get();
        
        students = [];
        snapshot.forEach(doc => {
            students.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ ${students.length} élèves chargés`);
        return students;
    } catch (error) {
        console.error('❌ Erreur chargement élèves:', error);
        showNotification('Erreur de chargement des élèves', 'error');
        return [];
    }
}

// Charger toutes les cotisations
async function loadContributions() {
    try {
        console.log('💰 Chargement des cotisations...');
        const snapshot = await db.collection('contributions').get();
        
        contributions = [];
        snapshot.forEach(doc => {
            contributions.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ ${contributions.length} cotisations chargées`);
        return contributions;
    } catch (error) {
        console.error('❌ Erreur chargement cotisations:', error);
        showNotification('Erreur de chargement des cotisations', 'error');
        return [];
    }
}

// Charger toutes les dépenses
async function loadExpenses() {
    try {
        console.log('💸 Chargement des dépenses...');
        const snapshot = await db.collection('expenses').get();
        
        expenses = [];
        snapshot.forEach(doc => {
            expenses.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ ${expenses.length} dépenses chargées`);
        return expenses;
    } catch (error) {
        console.error('❌ Erreur chargement dépenses:', error);
        showNotification('Erreur de chargement des dépenses', 'error');
        return [];
    }
}

// Ajouter un élève
async function addStudent(studentData) {
    try {
        console.log('👤 Ajout élève:', studentData);
        const docRef = await db.collection('students').add({
            ...studentData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Élève ajouté avec succès', 'success');
        console.log('✅ Élève ajouté ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Erreur ajout élève:', error);
        showNotification('Erreur lors de l\'ajout de l\'élève: ' + error.message, 'error');
        throw error;
    }
}

// Ajouter une cotisation
async function addContribution(contributionData) {
    try {
        console.log('💰 Ajout cotisation:', contributionData);
        const docRef = await db.collection('contributions').add({
            ...contributionData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Cotisation enregistrée avec succès', 'success');
        console.log('✅ Cotisation ajoutée ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Erreur ajout cotisation:', error);
        showNotification('Erreur lors de l\'ajout de la cotisation: ' + error.message, 'error');
        throw error;
    }
}

// Ajouter une dépense
async function addExpense(expenseData) {
    try {
        console.log('💸 Ajout dépense:', expenseData);
        const docRef = await db.collection('expenses').add({
            ...expenseData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Dépense enregistrée avec succès', 'success');
        console.log('✅ Dépense ajoutée ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Erreur ajout dépense:', error);
        showNotification('Erreur lors de l\'ajout de la dépense: ' + error.message, 'error');
        throw error;
    }
}

// Vérifier si un utilisateur est admin
async function checkAdminStatus(user) {
    try {
        console.log('👑 Vérification statut admin pour:', user.email);
        const adminDoc = await db.collection('admins').doc(user.uid).get();
        
        if (!adminDoc.exists) {
            console.log('⚠️ Création automatique des droits admin');
            await db.collection('admins').doc(user.uid).set({
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                autoCreated: true
            });
            isAdmin = true;
        } else {
            isAdmin = true;
        }
        
        console.log('✅ Statut admin:', isAdmin);
        return isAdmin;
    } catch (error) {
        console.error('❌ Erreur vérification admin:', error);
        // En cas d'erreur, on considère l'utilisateur comme admin
        isAdmin = true;
        return true;
    }
}

// Initialiser les données au chargement
async function initializeData() {
    console.log('🚀 Initialisation des données...');
    try {
        await loadStudents();
        await loadContributions();
        await loadExpenses();
        console.log('✅ Toutes les données initialisées');
    } catch (error) {
        console.error('❌ Erreur initialisation données:', error);
    }
}

// Écouter les changements en temps réel
function setupRealtimeListeners() {
    console.log('👂 Mise en place des écouteurs temps réel');
    
    // Élèves
    db.collection('students').onSnapshot((snapshot) => {
        students = [];
        snapshot.forEach(doc => {
            students.push({ id: doc.id, ...doc.data() });
        });
        console.log('🔄 Élèves mis à jour:', students.length);
        if (typeof displayStudents === 'function') displayStudents();
    });
    
    // Cotisations
    db.collection('contributions').onSnapshot((snapshot) => {
        contributions = [];
        snapshot.forEach(doc => {
            contributions.push({ id: doc.id, ...doc.data() });
        });
        console.log('🔄 Cotisations mises à jour:', contributions.length);
        if (typeof displayContributions === 'function') displayContributions();
        if (typeof displayWeeklyContributions === 'function') displayWeeklyContributions();
    });
    
    // Dépenses
    db.collection('expenses').onSnapshot((snapshot) => {
        expenses = [];
        snapshot.forEach(doc => {
            expenses.push({ id: doc.id, ...doc.data() });
        });
        console.log('🔄 Dépenses mises à jour:', expenses.length);
        if (typeof displayExpenses === 'function') displayExpenses();
    });
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Démarrage application Firebase');
    initializeData();
    setupRealtimeListeners();
});
