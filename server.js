const http = require('http');
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const PORT = 8000 || process.env.PORT;

/* ---------------------------------------------------------------------------
      If you deploy this application to a web server,
      it usually runs behind a reverse proxy like NGINX,
      then your whole cookie system might not work because
      you have to add app.set trust proxy 1.
------------------------------------------------------------------------------*/
app.set('trust proxy', 1);

/**
 * Middleware
 */
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));

/**
 * View Engine
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

server.listen(PORT, () =>
	console.log(`~~~ You are now listening and enjoying to port: ${PORT} ~~~`)
);

const setRoutes = require('./routes/index');
const models = require('./config/db');

setRoutes(app, io, models);

app.use(function (_req, res) {
	res.status(404).redirect('/error');
});

/**
 * End connection
 */
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
