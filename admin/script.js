const firebaseConfig = {
    apiKey: "AIzaSyAy0DhNhsNpGYFg7YJ1f6kvUYcDw08-GGk",
    authDomain: "bacardips-4e2c0.firebaseapp.com",
    databaseURL: "https://bacardips-4e2c0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bacardips-4e2c0",
    storageBucket: "bacardips-4e2c0.firebasestorage.app",
    messagingSenderId: "655282827033",
    appId: "1:655282827033:web:9656b7d6bd60e59de65f88",
    measurementId: "G-19NSYW9DSP"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('i');
    const title = notification.querySelector('h4');
    const messageEl = notification.querySelector('.notification-message');

    notification.className = 'fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 flex items-center gap-3 border border-white/10 backdrop-blur-sm';
    
    if (type === 'success') {
        notification.classList.add('bg-gradient-to-r', 'from-emerald-500', 'to-teal-600', 'text-white');
        icon.className = 'fas fa-check text-xl animate-bounce';
        title.textContent = 'Berhasil!';
    } else {
        notification.classList.add('bg-gradient-to-r', 'from-red-500', 'to-rose-600', 'text-white');
        icon.className = 'fas fa-exclamation-triangle text-xl animate-bounce';
        title.textContent = 'Gagal!';
    }
    
    messageEl.textContent = message;
    notification.style.transform = 'translateY(0)';

    notification.addEventListener('mouseenter', () => {
        notification.style.transform = 'translateY(0) scale(1.05)';
    });
    
    notification.addEventListener('mouseleave', () => {
        notification.style.transform = 'translateY(0) scale(1)';
    });


    setTimeout(() => {
        notification.style.transform = 'translateY(150%)';
    }, 3000);
}


async function saveChanges() {
    try {
        const data = {
            players: parseInt(document.getElementById('players').value) || 0,
            balive: parseInt(document.getElementById('balive').value) || 0,
            police: parseInt(document.getElementById('police').value) || 0,
            banned: parseInt(document.getElementById('banned').value) || 0,
            owner: parseInt(document.getElementById('owner').value) || 0,
            wakil: parseInt(document.getElementById('wakil').value) || 0,
            asisten: parseInt(document.getElementById('asisten').value) || 0,
            desainer: parseInt(document.getElementById('desainer').value) || 0,
            staff: parseInt(document.getElementById('staff').value) || 0,
            serverStatus: document.querySelector('input[name="server-status"]:checked').value
        };

        await db.ref('serverStats').set(data);
        showNotification('Data server berhasil diperbarui! 🚀', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Gagal memperbarui data server! ⚠️', 'error');
    }
}


document.getElementById('save-changes').addEventListener('click', saveChanges);

async function loadSavedStats() {
    try {
        const snapshot = await db.ref('serverStats').once('value');
        const data = snapshot.val() || {};
        
        document.getElementById('players').value = data.players || 0;
        document.getElementById('balive').value = data.balive || 0;
        document.getElementById('police').value = data.police || 0;
        document.getElementById('banned').value = data.banned || 0;
        document.getElementById('owner').value = data.owner || 0;
        document.getElementById('wakil').value = data.wakil || 0;
        document.getElementById('asisten').value = data.asisten || 0;
        document.getElementById('desainer').value = data.desainer || 0;
        document.getElementById('staff').value = data.staff || 0;
        
        const statusRadio = document.querySelector(`input[name="server-status"][value="${data.serverStatus || 'online'}"]`);
        if (statusRadio) statusRadio.checked = true;
    } catch (error) {
        console.error('Error loading stats:', error);
        showNotification('Gagal memuat data: ' + error.message);
    }
}


firebase.auth().onAuthStateChanged((user) => {
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    
    if (user) {
        loginForm.style.display = 'none';
        adminPanel.style.display = 'block';
        loadSavedStats();
    } else {
        loginForm.style.display = 'flex';
        adminPanel.style.display = 'none';
    }
});


document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
            alert('Login gagal: ' + error.message);
        });
});
