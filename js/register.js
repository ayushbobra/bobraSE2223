// This JS file is for registering a new app user ---------------------------//

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


// ---------------- Register New User --------------------------------//

document.getElementById('submitData').onclick = function(){
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('userEmail').value;

  //fire base requires a password of at least 6 characters
  const password = document.getElementById('userPass').value;

  //validate registration data
  if(!validation(firstName, lastName, email, password)){
    return;
  }

  //create user
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // Add user account info to realtime database
    // 'Set' will create a new reference or completely replace an existing one
    // each new user will be placed under the 'users' node
    set(ref(db, 'users/' + user.uid + '/accountInfo'), {
      uid: user.uid,  // save userID for home.js reference
      email: email,
      password: encryptPass(password),
      firstName: firstName,
      lastName: lastName
      })
      .then (() => {
        //Data saved successfully
        alert('User Created Successfully');
      })
      .catch((error) => {
        alert(errorMessage)
      });
    })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }




// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
function validation(firstName, lastName, email, password){
  let fNameRegex = /^[a-zA-Z]+$/;
  let lNameRegex = /^[a-zA-Z]+$/;
  let emailRegex = /^[a-zA-Z0-9]+@ctemc\.org$/;


  if(isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) || isEmptyorSpaces(email) || isEmptyorSpaces(password)){
    alert('Please complete all fields.')
    return false;
  }

  if(!fNameRegex.test(firstName)){
    alert('First name must only contain letters.')
    return false;
  }

  if(!lNameRegex.test(lastName)){
    alert('Last name must only contain letters.')
    return false;
  }

  if(!emailRegex.test(email)){
    alert('Email must be a valid ctemc email.')
    return false;
  }

  return true;
}

// --------------- Password Encryption -------------------------------------//
function encryptPass(password){
  let encrypted = CryptoJS.AES.encrypt(password, password)
  return encrypted.toString();
}

function decryptPass(password){
  let decrypted = CryptoJS.AES.decrypt(password, password);
  return decrypted.toString();
}