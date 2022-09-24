//Filename: branchingDemo.js
//Author: A. Bobra
//Objective: Demonstrate GitHub branches

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const d = new Date();

//getMonth() returns the month as an integer (0-11). Jane = 0, Dec = 11
let month = months[d.getMonth()];
let day = d.getDate();
let year = d.getFullYear();

let currentDate = "The current date is: " + month + " " + day + ", " + year;

console.log(d);
console.log(currentDate);


