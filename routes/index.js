const routes = (app, io, db) => {
	const controller = require('../controllers/index')(io, db);

	app.get('/result', controller.result);

	app.get('/male', controller.viewMale);

	app.get('/female', controller.viewFemale);

	app.get('/group', controller.viewGroup);

	app.post('/vote', controller.vote);
};

module.exports = routes;
