const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");

// console.table([
//     {
//       first_name: '',
//       last_name: '',
//       title: '',
//       department: '',
//       salary: '',
//       manager: ''
//     }
//   ]);






  
// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
});