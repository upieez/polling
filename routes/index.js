const routes = (app, server, db) => {
	const controller = require('../controllers/index')(server, db);

	app.get('/', controller.demo);

	app.get('/male', controller.second);

	app.post('/male', controller.voteMale);
};

module.exports = routes;
