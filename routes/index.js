const routes = (app, server, db) => {
	const { demo, second, voteMale } = require('../controllers/index')(
		server,
		db
	);

	app.get('/', demo);

	app.get('/result', second);

	app.post('/male', voteMale);
};

module.exports = routes;
