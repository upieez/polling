const routes = (app, io, db) => {
	const controller = require('../controllers/index')(io, db);

	app.get('/result', controller.result);

	app.get('/male', controller.viewMale);

	app.get('/female', controller.viewFemale);

	app.get('/group', controller.viewGroup);

	app.get('/thankyou', controller.viewGratitude);

	app.get('/winner', controller.viewWinner);

	app.post('/vote', controller.vote);

	app.get('/error', controller.notFound);
};

module.exports = routes;
