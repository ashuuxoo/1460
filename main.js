// setting up firebase with our website
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAqLhZwCi01etkdPm014QzSNeUlKrOfKjo",
    authDomain: "tudum-7f057.firebaseapp.com",
    projectId: "tudum-7f057",
    storageBucket: "tudum-7f057.firebasestorage.app",
    messagingSenderId: "384146644184",
    appId: "1:384146644184:web:5dbe0c8f242498df08cbad"
});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

// Set Firebase authentication persistence
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log("Authentication persistence set to LOCAL");
    })
    .catch((error) => {
        console.error("Error setting persistence:", error);
    });

// Check if user is already signed in
const checkUserSignIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) { 
            // User is signed in
            console.log(user);
        }else{
            
        }
    });
};

// Call checkUserSignIn on page load
window.onload = checkUserSignIn;

// Add event listener for Enter key to trigger #submit-btn click
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const submitButton = document.getElementById("submit-btn");
        if (submitButton) {
            submitButton.click();
        }
    }
});

// Sign up function
const signUp = () => {
    const name = document.getElementById("name").value; // Get name input
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(name, email, password); // Log name, email, and password

    // Fetch user's IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const userIp = data.ip; // Extract IP address

            // Firebase code
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((result) => {
                    console.log(result);

                    // Store name, email, subscription, and IP in Firestore
                    return db.collection("users").doc(result.user.uid).set({
                        name: name, // Add name field
                        email: email,
                        subscription: "free", // Add subscription field with value "free"
                        ip: userIp // Add IP address field
                    });
                })
                .then(() => {
                    console.log("User data stored in Firestore");

                    // Trigger webhook URL
                    const img = new Image();
                    img.src = "https://trigger.macrodroid.com/22acd4c5-8f6a-4240-bba7-d23e8a7a8d78/signup";
                    const message = document.createElement("p");
                    message.textContent = 'you are signed up now you can go back to home';
                    message.style.position = "fixed";
                    message.style.top = "5em";
                    message.style.left = "3em";
                    message.style.width = "20em";
                    message.style.backgroundColor = "green";
                    message.style.color = "white";
                    message.style.padding = "10px";
                    message.style.borderRadius = "5px";
                    message.style.zIndex = "100"; // Ensure it appears above other elements
                    message.style.fontSize = "20px"; // Increase font size
                    document.body.appendChild(message);
                    setTimeout(() => {
                        message.remove(); // Remove the message after 1 seconds
                    }, 4000);
                    location.replace("mainapp.html"); // Redirect to home page
                })
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        alert('This email address is already in use. Please try signing in.');
                    } else {
                        console.log(error.code);
                        console.log(error.message);
                    }
                });
        })
        .catch((error) => {
            console.error("Error fetching IP address:", error);
        });
};

// Sign In function
const signIn = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Fetch user's IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const userIp = data.ip; // Extract IP address

            // Firebase code
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(async (result) => {
                    const userDocRef = db.collection("users").doc(result.user.uid);
                    const userDoc = await userDocRef.get();
                    if (userDoc.exists) {
                        const storedIp = userDoc.data().ip;
                        if (!storedIp) {
                            // If IP field is empty, update it with the current IP
                            await userDocRef.update({ ip: userIp });
                            console.log("IP address added to Firestore document");
                            window.location.replace("mainapp.html");
                        } else if (storedIp === userIp) {
                            // IP matches, allow sign-in
                            window.location.replace("mainapp.html");
                        } else {
                            // IP doesn't match, deny sign-in
                            alert('Already logged in on another device');
                            firebase.auth().signOut(); // Sign out the user
                        }
                    } else {
                        console.error("User document not found in Firestore");
                    }
                })
                .catch((error) => {
                    console.log(error.code);
                    console.log(error.message);
                    alert('Wrong password/email');
                });
        })
        .catch((error) => {
            console.error("Error fetching IP address:", error);
        });
};

// Sign Out function
const signOut = () => {
    firebase.auth().signOut()
        .then(() => {
            // Remove user from local storage
            localStorage.removeItem('firebase:authUser:' + firebaseApp.options.apiKey + ':[DEFAULT]');
            console.log("User signed out and removed from local storage");
            window.location.replace("signin.html"); // Redirect to login page
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
};

// Restrict text copying
document.addEventListener('copy', (event) => {
    event.preventDefault();
  });
