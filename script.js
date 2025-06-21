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
const proElement = document.getElementById('pro');
const toast = document.getElementById('toast');
const renet = () => {
     const premiumImgs = document.querySelectorAll('img');
             premiumImgs.forEach((premiumImg) => {
                 const srcValue = premiumImg.getAttribute('src');
                 [...premiumImg.attributes].forEach(attr => {
                     if (attr.name !== 'src') {
                         premiumImg.removeAttribute(attr.name);
                     }
                 });
                 premiumImg.setAttribute('src', srcValue); // Ensure src remains intact
                 premiumImg.setAttribute('onclick', 'location.href="signin.html"');
             });
};
const resub = () =>{
    const premiumImgs = document.querySelectorAll('#premium');
             premiumImgs.forEach((premiumImg) => {
                 const srcValue = premiumImg.getAttribute('src');
                 [...premiumImg.attributes].forEach(attr => {
                     if (attr.name !== 'src') {
                         premiumImg.removeAttribute(attr.name);
                     }
                 });
                 premiumImg.setAttribute('src', srcValue); // Ensure src remains intact
                 premiumImg.setAttribute('onclick', 'showpay()');
             });
};
const showpay = () => {
    document.querySelector('.recharge').style.display = 'block';
        setTimeout(() => {
            document.querySelector('.recharge').style.display = 'none';
        }, 3000);
};
const rmvLock = () => {
     document.querySelectorAll('.fi.fi-sr-lock').forEach(lock => {
            if (lock) {
                lock.remove();
            }
        });
}; 
const blurImg = () => {
    document.querySelectorAll('img').forEach(img => {
                        img.classList.add('display-block');
                    });
};
// Check if user is already signed in
const checkUserSignIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            checkUserSubscription();
            document.getElementById("email").innerText = user.email;
        } else {
            renet();
            blurImg();
              const signInButton = document.getElementById('Logout');
            if (signInButton) {
                signInButton.setAttribute('onclick', 'location.href="signin.html"');
                signInButton.innerText = "SignIn";
                signInButton.style.backgroundColor = 'green';
                }
        }
    });
};
// Check if user is banned after persistence removal
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        const persistedUser = localStorage.getItem('persistedUser');
        if (persistedUser) {
            localStorage.removeItem('persistedUser'); // Clear persisted user data
            toast.innerText = "You have been banned from this site. Please contact support.";
            toast.style.display = 'block';
        }
    } else {
        localStorage.setItem('persistedUser', JSON.stringify({ email: user.email })); // Save user details in localStorage
    }
});

// Function to check user subscription status in Firestore
const checkUserSubscription = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
        // First, check localStorage for subscription value
        const localSub = localStorage.getItem('subscription');
        if (localSub) {
            updateSubscriptionUI(localSub);
        }
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const subscription = userDoc.data().subscription;
                // If Firestore value is different from localStorage, update both
                if (subscription !== localSub) {
                    localStorage.setItem('subscription', subscription);
                    updateSubscriptionUI(subscription);
                }
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    }
}

// Helper function to update UI based on subscription type
function updateSubscriptionUI(subscription) {
    if (subscription === 'premium') {
        rmvLock();
        blurImg();
        proElement.innerText = " You Have Premium Account";
        document.getElementById("subscribe").innerText= 'Renew Subscription';
        document.querySelector('.recharge').style.display = 'none';
    } else if (subscription === 'free') {
        resub();
        blurImg();
        proElement.innerText = "You Have Free Account";
    }
}
const signOut = () => {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).update({ ip: '' })
            .then(() => {
                console.log("IP field cleared in Firestore");
                firebase.auth().signOut()
                    .then(() => {
                        // Remove user from local storage
                        localStorage.removeItem('firebase:authUser:' + firebaseApp.options.apiKey + ':[DEFAULT]');
                        localStorage.removeItem('subscription');
                        window.location.replace("signin.html"); // Redirect to login page
                    })
                    .catch((error) => {
                        console.error("Error signing out:", error);
                    });
            })
            .catch((error) => {
                console.error("Error clearing IP field:", error);
            });
    } else {
        console.error("No user is currently signed in.");
    }
};
// Enable horizontal scrolling with mouse wheel on pc
document.querySelectorAll('.box,.upcoming').forEach(div => {
  div.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent default vertical scrolling
    div.scrollLeft += event.deltaY; // Scroll horizontally
  });
});

// Function to handle #movie-request button click
document.querySelectorAll('#movie-request').forEach(button => {
  button.addEventListener('click', function () {
    // Create popup container
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '22em';
    popup.style.height = '70%';
    popup.style.backgroundColor = 'white';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '1000';
    popup.style.borderRadius = '8px';
    popup.style.overflow = 'hidden';

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://tally.so/r/w7PLvP';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    popup.appendChild(iframe);

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '0.5em';
    closeButton.style.right = '0.5em';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.padding = '0.3em 0.6em';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '0.9em';
    closeButton.addEventListener('click', function () {
      document.body.removeChild(popup);
    });
    popup.appendChild(closeButton);

    // Append popup to body
    document.body.appendChild(popup);
  });
});
// Function to handle grid display toggling
function toggleGridDisplay(buttonId, gridId) {
  const allGrids = ['#a1', '#a2', '#a3'];
  document.querySelectorAll(allGrids.join(', ')).forEach(grid => {
    grid.style.display = gridId === grid.id ? 'grid' : 'none';
  });
}
// Function to handle button active state
function setActiveButton(buttonId) {
  const allButtons = ['movie','sign-in','likely'];
  allButtons.forEach(id => {
    const button = document.getElementById(id);
    if (button) {
      button.style.color = id === buttonId ? 'white' : ''; // Adjust text color for active button
    }
  });
}
// Update event listeners to include active button state
document.getElementById('movie').addEventListener('click', () => {
  toggleGridDisplay('movie', 'a1');
  setActiveButton('movie');
});
document.getElementById('sign-in').addEventListener('click', () => {
  toggleGridDisplay('sign-in', 'a2');
  setActiveButton('sign-in');
});
document.getElementById('likely').addEventListener('click', () => {
  toggleGridDisplay('likely', 'a3');
  setActiveButton('likely');
});

// Set default grid to #a2 (movie) on page load
document.addEventListener('DOMContentLoaded', () => {
  toggleGridDisplay('movie', 'a1');
  setActiveButton('movie');
  checkUserSignIn(); // Ensure checkUserSignIn is called on page load
});

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

// Prevent long-press actions on images or content
document.addEventListener('touchstart', (event) => {
  if (event.target.tagName === 'IMG' || event.target.tagName === 'DIV' || event.target.tagName === 'P') {
    let timeout = setTimeout(() => {
      event.preventDefault();
    }, 500);

    event.target.addEventListener('touchend', () => clearTimeout(timeout), { once: true });
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const usernameElement = document.getElementById('username');
    const storedName = localStorage.getItem('username');

    if (storedName && usernameElement) {
        usernameElement.innerText = storedName; // Use name from localStorage
    } else {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    if (userDoc.exists) {
                        const name = userDoc.data().name;
                        if (name) {
                            localStorage.setItem('username', name); // Save name to localStorage
                            if (usernameElement) {
                                usernameElement.innerText = name;
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user name:', error);
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');
    const closeModal = () => {
        if (modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    };

    document.getElementById('searchButton').addEventListener('click', () => {
        if (modal) {
            modal.style.display = 'block'; // Show the modal
            history.pushState(null, null, location.href); // Add a new history entry
        }
    });

    document.getElementById('closeModal').addEventListener('click', closeModal);

    window.addEventListener('popstate', () => {
        if (modal && modal.style.display === 'block') {
            closeModal(); // Close the modal
            history.pushState(null, null, location.href); // Prevent navigating back
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const box2 = document.querySelector('.box2');

    if (searchInput && box2) {
        searchInput.addEventListener('input', () => {
            const searchValue = searchInput.value.toLowerCase();
            box2.innerHTML = ''; // Clear previous results

            document.querySelectorAll('.box p').forEach(paragraph => {
                if (paragraph.textContent.toLowerCase().includes(searchValue)) {
                    const parentDiv = paragraph.closest('div');
                    if (parentDiv) {
                        box2.appendChild(parentDiv.cloneNode(true)); // Clone and append the matched div
                    }
                }
            });
        });
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default Enter key behavior for search input
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const clearWatchlistButton = document.getElementById('clearWatchlist');
  if (clearWatchlistButton) {
    clearWatchlistButton.addEventListener('click', () => {
      const watchlistDiv = document.querySelector('.watchlist');
      if (watchlistDiv) {
        watchlistDiv.innerHTML = ''; // Clear all inner elements of the .watchlist div
        localStorage.removeItem('watchlist'); // Remove watchlist value from localStorage
      }
    });
  }
});

// --- Active Users Tracking using Firebase Realtime Database ---
(function trackActiveUsers() {
    // Wait for auth state to be ready
    firebase.auth().onAuthStateChanged((user) => {
        // Generate a unique key for this session
        const activeUserRef = database.ref('activeUsers').push();
        // Set presence to true and attach email if available
        if (user && user.email) {
            activeUserRef.set({ email: user.email, active: true });
        } else {
            activeUserRef.set({ email: null, active: true });
        }
        // Remove on disconnect
        activeUserRef.onDisconnect().remove();

        // Listen for changes and log active user count and emails
        database.ref('activeUsers').on('value', (snapshot) => {
            const users = snapshot.val() || {};
            const count = Object.keys(users).length;
            const emails = Object.values(users)
                .map(u => u.email)
                .filter(email => !!email);
            console.log('Active users:', count, 'Emails:', emails);
        });
    });
})();
// --- Swipe Down to Show #refreshPage ---
(function enableSwipeDownRefresh() {
    let touchStartY = 0;
    let touchEndY = 0;
    let isAtTop = false;
    let refreshTimeout = null;

    function showRefreshPage() {
        const refreshElem = document.getElementById('refreshPage');
        if (refreshElem) {
            refreshElem.style.display = 'block';
            clearTimeout(refreshTimeout);
            refreshTimeout = setTimeout(() => {
                refreshElem.style.display = 'none';
            }, 5000); // Hide after 5 seconds
        }
    }

    function hideRefreshPage() {
        const refreshElem = document.getElementById('refreshPage');
        if (refreshElem) {
            refreshElem.style.display = 'none';
        }
    }

    window.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            isAtTop = true;
            touchStartY = e.touches[0].clientY;
        } else {
            isAtTop = false;
        }
    }, { passive: true });

    window.addEventListener('touchmove', function(e) {
        if (!isAtTop) return;
        touchEndY = e.touches[0].clientY;
        if (touchEndY - touchStartY > 60) { // Swipe down threshold
            showRefreshPage();
            isAtTop = false; // Prevent multiple triggers
        }
    }, { passive: true });

    window.addEventListener('scroll', hideRefreshPage);
})();
