const routes = (app, server, models) => {
	const controller = require('../controllers/index')(server, models);

	app.get('/', controller.demo);

	app.get('/result', controller.second);
};

module.exports = routes;
