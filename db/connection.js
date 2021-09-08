const mysql = require('mysql2');
const { createConnection } = require('mysql2/promise');
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: process.env.PASSWORD,
      database: 'employees'
    }
   )

module.exports = db;