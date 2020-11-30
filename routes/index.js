const routes = (app, io, db) => {
	const controller = require('../controllers/index')(io, db);

	app.get('/', controller.demo);

	app.get('/male', controller.second);

	app.post('/male', controller.voteMale);
};

module.exports = routes;
