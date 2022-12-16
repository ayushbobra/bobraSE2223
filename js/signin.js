// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import { getDatabase, ref, set, update, child, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAuZxW-oiuOUyag0X04M0o502jhYJG-S28",
    authDomain: "research-website-dda8a.firebaseapp.com",
    databaseURL: "https://research-website-dda8a-default-rtdb.firebaseio.com",
    projectId: "research-website-dda8a",
    storageBucket: "research-website-dda8a.appspot.com",
    messagingSenderId: "671530726592",
    appId: "1:671530726592:web:ff19e221718502c702a925"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Authentication
const auth = getAuth();

//return instance of the app's realtime database
const db = getDatabase(app);


// ---------------------- Sign-In User ---------------------------------------//
document.getElementById("signIn").onclick = function() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    //Attempt to sign user in
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // create a user and store the user ID
        const user = userCredential.user;

        // log sign-in date in DB
        // update will only add the last_login
        let logDate = new Date();
        update(ref(db, 'users/' + user.uid + '/accountInfo'), {
            last_login: logDate,
        })
        .then(() => {
            // User Signed in
            alert("Sign-in successful");

            // get snapshot of all the user info and pass it to the logIn() function and stored in session or local storage
            get(ref(db, 'users/' + user.uid + '/accountInfo')).then((snapshot) => {
                if (snapshot.exists()) {
                    logIn(snapshot.val());
                } 
                else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.log(error);
            });
        })
        .catch(() => {
            // Error
            alert(error);
        })
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    })
}


// ---------------- Keep User Logged In ----------------------------------//
function logIn(user) {
    let keepLoggedIn = document.getElementById("keepLoggedInSwitch").ariaChecked;

    //session storage is temporary (only active while browser open)
    //information is saved as a string (must convert JS object to string)
    //session storage will be cleared with a signOut() function in home.js
    if (!keepLoggedIn) {
        sessionStorage.setItem("user", JSON.stringify(user));
        window.location="home.html";  //browser redirect to the home page
    }

    //local storage is permanent (until you sign out)
    else{
        localStorage.setItem('keepLoggedIn', 'yes');
        localStorage.setItem("user", JSON.stringify(user));
        window.location="home.html";  //browser redirect to the home page
    }

}