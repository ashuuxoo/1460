const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAqLhZwCi01etkdPm014QzSNeUlKrOfKjo",
  authDomain: "tudum-7f057.firebaseapp.com",
  databaseURL: "https://tudum-7f057-default-rtdb.firebaseio.com",
  projectId: "tudum-7f057",
  storageBucket: "tudum-7f057.firebasestorage.app",
  messagingSenderId: "384146644184",
  appId: "1:384146644184:web:5dbe0c8f242498df08cbad"
});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const database = firebaseApp.database();

const checkUserSignIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) { 
            console.log('User is signed in:');
        } else {
            window.location.replace("signin.html");
        }
    });
};
document.addEventListener('DOMContentLoaded', () => {
    const storedName = localStorage.getItem('username');

    // Delete old messages (older than 24 hours)
    const now = Date.now();
    const cutoff = now - 24 * 60 * 60 * 1000;
    database.ref('messages').once('value', (snapshot) => {
        snapshot.forEach((child) => {
            const msg = child.val();
            if (msg.timestamp && msg.timestamp < cutoff) {
                child.ref.remove();
            }
        });
    });

    // Group chat logic
    const chatDiv = document.getElementById('chat');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('sendMessage');

    // Helper to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.innerText = text;
        return div.innerHTML;
    }

    // Store active users in memory
    let activeUsernames = new Set();

    // Listen for active users and update set
    database.ref('activeUsers').on('value', (snapshot) => {
        const users = snapshot.val() || {};
        activeUsernames.clear();
        Object.values(users).forEach(val => {
            if (val && val.username) activeUsernames.add(val.username);
        });
        // Update all message name colors
        document.querySelectorAll('.chat-message').forEach(div => {
            const uname = div.getAttribute('data-username');
            const nameElem = div.querySelector('.chat-username');
            if (nameElem) {
                if (activeUsernames.has(uname)) {
                    nameElem.style.color = 'yellowgreen';
                } else {
                    nameElem.style.color = '';
                }
            }
        });
        // Update active user count
        const count = snapshot.numChildren();
        document.getElementById('activeUsersCount').innerText = 'Active: ' + count;
    });

    // Render a message with data attributes for deletion
    function renderMessage(msg, key) {
        const name = escapeHtml(msg.username || 'Anonymous');
        const text = escapeHtml(msg.text || '');
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '';
        // Add .chat-username span for color
        return `<div class="chat-message" data-key="${key}" data-username="${escapeHtml(msg.username || '')}">
            <strong class="chat-username" style="color:${activeUsernames.has(msg.username) ? 'yellowgreen' : ''}">${name}</strong>
            <span style="color:gray;font-size:smaller;">${time}</span>: ${text}
        </div>`;
    }

    // Listen for new messages
    database.ref('messages').limitToLast(100).on('child_added', (snapshot) => {
        const msg = snapshot.val();
        const key = snapshot.key;
        if (chatDiv) {
            chatDiv.innerHTML += renderMessage(msg, key);
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    });

    // Long press logic for deleting own messages
    let pressTimer = null;
    chatDiv.addEventListener('mousedown', function(e) {
        const target = e.target.closest('.chat-message');
        if (!target) return;
        const msgUsername = target.getAttribute('data-username');
        const myUsername = localStorage.getItem('username') || 'Anonymous';
        if (msgUsername !== myUsername) return;

        pressTimer = setTimeout(() => {
            if (confirm('Delete this message?')) {
                const key = target.getAttribute('data-key');
                if (key) {
                    database.ref('messages').child(key).remove();
                    target.remove();
                }
            }
        }, 400); // 400ms for long press
    });
    chatDiv.addEventListener('mouseup', function() {
        clearTimeout(pressTimer);
    });
    chatDiv.addEventListener('mouseleave', function() {
        clearTimeout(pressTimer);
    });

    // Send message
    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;
        const username = localStorage.getItem('username') || 'Anonymous';
        database.ref('messages').push({
            username,
            text,
            timestamp: Date.now()
        });
        messageInput.value = '';
        // Trigger webhook
        const img = new Image();
        img.src = 'https://trigger.macrodroid.com/a7642b7e-a1f9-48a6-ade4-7e412a430b41/newmessage';
    }

    if (sendButton && messageInput) {
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});

// --- Active Users Tracking using Firebase Realtime Database ---
(function trackActiveUsers() {
    // Generate a unique key for this session
    const username = localStorage.getItem('username') || 'Anonymous';
    const activeUserRef = database.ref('activeUsers').push({ username });
    // Remove on disconnect
    activeUserRef.onDisconnect().remove();
})();
// Restrict text copying
document.addEventListener('copy', (event) => {
  event.preventDefault();
});

// Prevent right-click actions
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

// Disable text selection
document.addEventListener('selectstart', (event) => {
  event.preventDefault();
});