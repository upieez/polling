const mysql = require('mysql');
require('dotenv').config();

const config = {
	connectionLimit: 100,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
};

var pool = mysql.createPool(config);

pool.on('acquire', function (connection) {
	console.log('Connection %d acquired', connection.threadId);
});

const polls = require('../models/index')(pool);

module.exports = {
	pool,
	polls,
};
