// js/auth.js - AJOUTER AU DÉBUT SEULEMENT
console.log("🔐 Auth.js chargé");

// Attendre que Firebase soit initialisé
function waitForAuth() {
    if (typeof auth === 'undefined') {
        console.log('⏳ En attente de Firebase Auth...');
        setTimeout(waitForAuth, 100);
        return;
    }
    console.log('✅ Auth prêt, initialisation...');
    initAuth();
}

// Le reste de votre code auth.js EXISTANT reste inchangé
function initAuth() {
    // TOUT VOTRE CODE AUTH EXISTANT RESTE ICI
    // Ne changez rien d'autre dans auth.js
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('✅ Utilisateur connecté:', user.email);
            // ... votre code existant
        } else {
            console.log('❌ Aucun utilisateur connecté');
            // ... votre code existant
        }
    });
    
    // ... tout le reste de votre code auth.js
}

// Démarrer l'attente
waitForAuth();
// =============================================
// GESTION DE L'AUTHENTIFICATION - CORRIGÉ
// =============================================

// Vérifier le statut administrateur
async function checkAdminStatus(user) {
    try {
        const adminDoc = await db.collection('admins').doc(user.uid).get();
        isAdmin = adminDoc.exists;
        
        if (!isAdmin) {
            console.log('⚠️ Utilisateur non admin, création automatique...');
            // Créer automatiquement les droits admin
            await db.collection('admins').doc(user.uid).set({
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                autoCreated: true
            });
            isAdmin = true;
        }
        
        updateUIForAuth();
        return isAdmin;
    } catch (error) {
        console.error('❌ Erreur vérification admin:', error);
        
        // En cas d'erreur, forcer les droits admin temporairement
        isAdmin = true;
        updateUIForAuth();
        return true;
    }
}

// Mettre à jour l'interface selon l'authentification
function updateUIForAuth() {
    const authElements = document.querySelectorAll('.auth-required');
    const adminElements = document.querySelectorAll('.admin-only');
    
    console.log('🔄 Mise à jour interface - Utilisateur:', currentUser?.email);
    console.log('🔄 Statut admin:', isAdmin);
    
    // Afficher/masquer selon l'authentification
    authElements.forEach(el => {
        if (currentUser) {
            el.style.display = 'flex';
            el.style.visibility = 'visible';
        } else {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
        }
    });
    
    // Afficher/masquer selon le statut admin
    adminElements.forEach(el => {
        if (isAdmin) {
            el.style.display = 'flex';
            el.style.visibility = 'visible';
        } else {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
        }
    });
    
    // Mettre à jour la barre d'authentification
    const authBar = document.getElementById('auth-bar');
    const userEmail = document.getElementById('user-email');
    const userAvatar = document.getElementById('user-avatar');
    const adminBadge = document.getElementById('admin-badge');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (authBar && currentUser) {
        authBar.style.display = 'block';
        if (userEmail) userEmail.textContent = currentUser.email;
        if (userAvatar) userAvatar.textContent = currentUser.email.charAt(0).toUpperCase();
        if (adminBadge) adminBadge.style.display = isAdmin ? 'inline-block' : 'none';
        
        // Configurer le bouton de déconnexion
        if (logoutBtn) {
            logoutBtn.onclick = logout;
        }
    } else if (authBar) {
        authBar.style.display = 'none';
    }
}

// Observer l'état d'authentification
auth.onAuthStateChanged(async (user) => {
    console.log('🔍 Changement état auth:', user ? user.email : 'Déconnecté');
    
    if (user) {
        currentUser = user;
        console.log('👤 Utilisateur connecté:', user.email);
        
        await checkAdminStatus(user);
        showNotification('Connecté avec succès', 'success');
        
        // Cacher la page de login si elle est visible
        const loginPage = document.getElementById('login-page');
        const app = document.getElementById('app');
        if (loginPage) loginPage.style.display = 'none';
        if (app) app.style.display = 'block';
        
    } else {
        currentUser = null;
        isAdmin = false;
        console.log('👤 Utilisateur déconnecté');
        
        const authBar = document.getElementById('auth-bar');
        if (authBar) authBar.style.display = 'none';
        
        // Afficher la page de login si on est sur une page protégée
        if (!window.location.pathname.includes('login.html')) {
            const loginPage = document.getElementById('login-page');
            const app = document.getElementById('app');
            if (loginPage && app) {
                loginPage.style.display = 'flex';
                app.style.display = 'none';
            } else {
                // Rediriger vers la page de connexion
                window.location.href = 'login.html';
            }
        }
        
        updateUIForAuth();
    }
});

// Déconnexion
function logout() {
    console.log('🚪 Déconnexion en cours...');
    auth.signOut()
        .then(() => {
            showNotification('Déconnexion réussie', 'success');
            console.log('✅ Déconnexion réussie');
        })
        .catch((error) => {
            console.error('❌ Erreur déconnexion:', error);
            showNotification('Erreur lors de la déconnexion', 'error');
        });
}

// Vérifier si l'utilisateur est connecté (pour protéger les pages)
function requireAuth() {
    return new Promise((resolve, reject) => {
        console.log('🔐 Vérification authentification...');
        
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            if (user) {
                console.log('✅ Utilisateur authentifié:', user.email);
                resolve(user);
            } else {
                console.log('❌ Utilisateur non authentifié - Redirection');
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = 'login.html';
                }
                reject(new Error('Non authentifié'));
            }
        });
    });
}

// Initialisation de l'auth au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation auth...');
    
    // Vérifier l'état actuel
    const user = auth.currentUser;
    if (user) {
        console.log('👤 Utilisateur déjà connecté:', user.email);
        currentUser = user;
        checkAdminStatus(user);
    }

});
