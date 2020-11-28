const mysql = require('mysql');
require('dotenv').config();

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

con.connect(function (err) {
	if (err) throw err;
	console.log('Successfully Connected to the Database!');
});

module.exports = con;
