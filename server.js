const http = require('http');
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);

const PORT = 8000 || process.env.PORT;

/**
 * Middleware
 */
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * View Engine
 */
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

server.listen(PORT, () =>
	console.log(`~~~ You are now listening and enjoying to port: ${PORT} ~~~`)
);

const setRoutes = require('./routes/index');
const models = require('./config/db');

setRoutes(app, server, models);

let onClose = function () {
	server.close(() => {
		console.log('\nProcess terminated...');
		models.pool.end(() =>
			console.log('~~~ Shutting down db connection pool gracefully ~~~')
		);
	});
};

models.pool.on('release', function (connection) {
	console.log('Connection %d released', connection.threadId);
});

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);
