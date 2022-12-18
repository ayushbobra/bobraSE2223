// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import { getDatabase, ref, set, update, child, get, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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


// ---------------------// Get reference values -----------------------------
let userLink = document.getElementById("userLink");   //username for navbar
let signOutLink = document.getElementById("signOut"); //signout link for navbar
let welcome = document.getElementById("welcome");     //welcome message
let currentUser = null;                               //initialize current user to null


// ----------------------- Get User's Name'Name ------------------------------
function getUsername() {
  //grab value for the 'keep logged in' switch
  let keepLoggedIn = localStorage.getItem("keepLoggedIn");

  //grab user info passed from login page
  if(keepLoggedIn == "yes") {
    currentUser = JSON.parse(localStorage.getItem("user"));
  }
  else {
    currentUser = JSON.parse(sessionStorage.getItem("user"));
  }
}

// Sign-out function that will remove user info from local/session storage and sign-out from FRD
function signOutUser(){
  sessionStorage.removeItem("user");
  localStorage.removeItem("user");
  localStorage.removeItem("keepLoggedIn");

  signOut(auth).then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    console.log(error);
  });
}


// ------------------------Set (insert) data into FRD ------------------------
function setData(userID, bin, day, worms) {
  // MUST USE BRACKETS AROUND VARIABLE NAME TO USE IT AS A KEY
  set(ref(db, 'users/' + userID + '/data/' + bin), {
    [day]: worms
  })
  .then(() => {
    alert("Data successfully stored!");
  })
  .catch((error) => {
    alert("Error: " + error);
  });
}



// -------------------------Update data in database --------------------------
function updateData(userID, bin, day, worms) {
  // MUST USE BRACKETS AROUND VARIABLE NAME TO USE IT AS A KEY
  update(ref(db, 'users/' + userID + '/data/' + bin), {
    [day]: worms
  })
  .then(() => {
    alert("Data successfully updated!");
  })
  .catch((error) => {
    alert("Error: " + error);
  });
}

// ----------------------Get a datum from FRD (single data point)---------------
function getData(userID, bin, day) {
  let binVal = document.getElementById("binVal");
  let dayVal = document.getElementById("dayVal");
  let wormsVal = document.getElementById("wormsVal");

  const dbref = ref(db); //get reference to the database, firebase parameter required for the get function

  //provide path to the data you want to get
  get(child(dbref, 'users/' + userID + '/data/' + bin))
  .then((snapshot) => {
      if (snapshot.exists()){
        binVal.textContent = bin;
        dayVal.textContent = day;

        //get the value from the key
        wormsVal.textContent = snapshot.val()[day];
      }
      else {
        alert("No data available");
      }
    }
  )
  .catch((error) => {
    alert("Error: " + error);
  });
}

// ---------------------------Get a bin's data set --------------------------
// Must be an async function because you need to get all the data from FRD before you can process it for a table or graph

async function getDataSet(userID, bin) {
  let binVal = document.getElementById('setBinVal');
  binVal.textContent = `Bin: ${bin}`;
  const days = [];
  const worms = [];
  const tbodyEl = document.getElementById('tbody-2'); //selecting tbody element from table
  const dbref = ref(db); //get reference to the database, firebase parameter required for the get function
  //wait for the data to be retrieved from FRD
  await get(child(dbref, 'users/' + userID + '/data/' + bin))
  .then((snapshot) => {
    if (snapshot.exists()){
      snapshot.forEach((child) => {
        days.push(child.key);
        worms.push(child.val());
      });
    }
    else {
      alert("No data available");
    }
  })
  .catch((error) => {
    alert("Error: " + error);
  });
  tbodyEl.innerHTML = ''; //clear existing data from table
  //dynamically add table rows to HTML
  for (let i = 0; i < days.length; i++) {
    addItemToTable(days[i], worms[i], tbodyEl);
  }
}

// Add a item to the table of data
function addItemToTable(day, worms, tbodyEl) {
  const trEl = document.createElement('tr');
  const dayEl = document.createElement('td');
  const tempEl = document.createElement('td');
  dayEl.innerHTML = day;
  tempEl.innerHTML = worms;
  trEl.appendChild(dayEl);
  trEl.appendChild(tempEl);
  tbodyEl.appendChild(trEl);
}

// -------------------------Delete a day's data from FRD ---------------------
function deleteData(userID, bin, day) {
  remove(ref(db, 'users/' + userID + '/data/' + bin + '/' + day))
  .then(() => {
    alert("Data successfully deleted!");
  })
  .catch((error) => {
    alert("Error: " + error);
  });
}


// --------------------------- Home Page Loading -----------------------------
window.onload = function() {


  // ------------------------- Set Welcome Message -------------------------
  getUsername();
  if(currentUser == null){
    userLink.innerText = "Create New Account";
    userLink.classList.replace("nav-link", "btn");
    userLink.classList.add("btn-primary"); //btn-primary specifies the color, can choose a different one
    userLink.href = "register.html";

    signOutLink.innerText = "Sign In";
    signOutLink.classList.replace("nav-link", "btn");
    signOutLink.classList.add("btn-success"); //btn-success also is for color
    signOutLink.href = "signIn.html";
  }
  else{
    userLink.innerText = currentUser.firstName;
    welcome.innerText = "Welcome " + currentUser.firstName + "!";
    userLink.classList.replace("btn", "nav-link");
    userLink.classList.add("btn-primary"); //btn-primary specifies the color, can choose a different one
    userLink.href = "#";

    signOutLink.innerText = "Sign Out";
    signOutLink.classList.replace("btn", "nav-link");
    signOutLink.classList.add("btn-success"); //btn-success also is for color
    document.getElementById("signOut").onclick = function() {
      signOutUser();
    }
  }

  
  // Get, Set, Update, Delete Worm Data in FRD

  // Set (Insert) data function call
  document.getElementById("set").onclick = function() {
    const bin = document.getElementById("bin").value;
    const day = document.getElementById("day").value;
    const worms = document.getElementById("worms").value;
    const userID = currentUser.uid;

    setData(userID, bin, day, worms);

  };  

  // Update data function call
  document.getElementById("update").onclick = function() {
    const bin = document.getElementById("bin").value;
    const day = document.getElementById("day").value;
    const worms = document.getElementById("worms").value;
    const userID = currentUser.uid;

    updateData(userID, bin, day, worms);

  };  

  // Get a datum function call
  document.getElementById("get").onclick = function() {
    const bin = document.getElementById("getBin").value;
    const day = document.getElementById("getDay").value;
    const userID = currentUser.uid;

    getData(userID, bin, day);

  };  

  // Get a data set function call
  document.getElementById("getDataSet").onclick = function() {
    const year = document.getElementById("getSetBin").value;
    const userID = currentUser.uid;

    getDataSet(userID, year);

  };  

  // Delete a single day's data function call
  document.getElementById("delete").onclick = function() {
    const year = document.getElementById("delBin").value;
    const day = document.getElementById("delDay").value;
    const userID = currentUser.uid;

    deleteData(userID, year, day);

  };
}
