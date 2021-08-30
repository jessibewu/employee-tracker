const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Summer.2021',
      database: 'employees'
    },
    console.log('Connected to the employees database.')
  );

module.exports = db;