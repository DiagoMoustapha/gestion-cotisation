// =============================================
// FONCTIONS COMMUNES À TOUTE L'APPLICATION
// =============================================

// Afficher une notification
function showNotification(message, type = 'success') {
    // Créer la notification si elle n'existe pas
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Formater une date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Formater une devise
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
    }).format(amount);
}

// Calculer la semaine à partir d'une date
function getWeekStartDate(date) {
    const dayOfWeek = date.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    return monday;
}

// Mettre à jour le champ semaine automatiquement
function updateWeekFromDate() {
    const dateInput = document.getElementById('contribution-date');
    const weekInput = document.getElementById('contribution-week');
    
    if (dateInput && weekInput && dateInput.value) {
        const date = new Date(dateInput.value);
        const weekStart = getWeekStartDate(date);
        weekInput.value = formatDate(weekStart);
    }
}

// =============================================
// FONCTIONS DE GESTION DES DONNÉES
// =============================================

// Charger tous les élèves
async function loadStudents() {
    try {
        const snapshot = await db.collection('students')
            .orderBy('lastName')
            .orderBy('firstName')
            .get();
        
        students = [];
        snapshot.forEach(doc => {
            students.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`📚 ${students.length} élèves chargés`);
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
        const snapshot = await db.collection('contributions')
            .orderBy('date', 'desc')
            .get();
        
        contributions = [];
        snapshot.forEach(doc => {
            contributions.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`💰 ${contributions.length} cotisations chargées`);
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
        const snapshot = await db.collection('expenses')
            .orderBy('date', 'desc')
            .get();
        
        expenses = [];
        snapshot.forEach(doc => {
            expenses.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`💸 ${expenses.length} dépenses chargées`);
        return expenses;
    } catch (error) {
        console.error('❌ Erreur chargement dépenses:', error);
        showNotification('Erreur de chargement des dépenses', 'error');
        return [];
    }
}

// Remplir la liste déroulante des élèves
function populateStudentSelect() {
    const select = document.getElementById('student-select');
    if (!select) return;
    
    select.innerHTML = '<option value="">Sélectionner un élève</option>';
    
    students.sort((a, b) => a.lastName.localeCompare(b.lastName))
           .forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.firstName} ${student.lastName}`;
        select.appendChild(option);
    });
}

// Obtenir le nom d'un élève à partir de son ID
function getStudentName(studentId) {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Inconnu';
}

// =============================================
// GESTION DES FORMULAIRES
// =============================================

// Ajouter un élève
async function addStudent(studentData) {
    try {
        const docRef = await db.collection('students').add({
            ...studentData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Élève ajouté avec succès', 'success');
        return docRef.id;
    } catch (error) {
        console.error('❌ Erreur ajout élève:', error);
        showNotification('Erreur lors de l\'ajout de l\'élève', 'error');
        throw error;
    }
}

// Ajouter une cotisation
async function addContribution(contributionData) {
    try {
        const docRef = await db.collection('contributions').add({
            ...contributionData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Cotisation enregistrée avec succès', 'success');
        return docRef.id;
    } catch (error) {
        console.error('❌ Erreur ajout cotisation:', error);
        showNotification('Erreur lors de l\'ajout de la cotisation', 'error');
        throw error;
    }
}

// Ajouter une dépense
async function addExpense(expenseData) {
    try {
        const docRef = await db.collection('expenses').add({
            ...expenseData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Dépense enregistrée avec succès', 'success');
        return docRef.id;
    } catch (error) {
        console.error('❌ Erreur ajout dépense:', error);
        showNotification('Erreur lors de l\'ajout de la dépense', 'error');
        throw error;
    }
}

// Ajouter une cotisation depuis le formulaire
async function addContributionFromForm() {
    const studentId = document.getElementById('student-select').value;
    const amount = parseInt(document.getElementById('contribution-amount').value);
    const date = document.getElementById('contribution-date').value;
    const week = document.getElementById('contribution-week').value;
    
    if (!studentId || !amount || !date) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    // Vérifier si une cotisation existe déjà pour cet élève cette semaine
    const existingContribution = contributions.find(c => 
        c.studentId === studentId && c.week === week
    );
    
    if (existingContribution) {
        showNotification('Cet élève a déjà cotisé cette semaine', 'error');
        return;
    }
    
    try {
        await addContribution({
            studentId: studentId,
            amount: amount,
            date: date,
            week: week
        });
        
        // Fermer le modal et réinitialiser
        document.getElementById('contribution-modal').style.display = 'none';
        document.getElementById('contribution-form').reset();
        document.getElementById('contribution-date').value = new Date().toISOString().split('T')[0];
        updateWeekFromDate();
        
        // Recharger les données
        await loadContributions();
        
    } catch (error) {
        // L'erreur est déjà gérée dans addContribution()
    }
}

// Ajouter une dépense depuis le formulaire
async function addExpenseFromForm() {
    const description = document.getElementById('expense-description').value.trim();
    const amount = parseInt(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;
    
    if (!description || !amount || !category || !date) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    try {
        await addExpense({
            description: description,
            amount: amount,
            category: category,
            date: date
        });
        
        // Fermer le modal et réinitialiser
        document.getElementById('expense-modal').style.display = 'none';
        document.getElementById('expense-form').reset();
        document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
        
        // Recharger les données
        await loadExpenses();
        
    } catch (error) {
        // L'erreur est déjà gérée dans addExpense()
    }
}

console.log('✅ Fonctions communes chargées');