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

server.listen(PORT, () => console.log(`~~~Server running on port ${PORT}~~~`));

const setRoutes = require('./routes/index');
const models = require('./config/db');

setRoutes(app, server, models);
