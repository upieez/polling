const basicAuth = require('express-basic-auth');

const routes = (app, io, db) => {
	const controller = require('../controllers/index')(io, db);

	app.get('/result', controller.result);

	app.get('/male', controller.viewMale);

	app.get('/female', controller.viewFemale);

	app.get('/group', controller.viewGroup);

	app.get('/thankyou', controller.viewGratitude);

	app.get('/winner', controller.viewWinner);

	app.get(
		'/admin',
		basicAuth({
			challenge: true,
			users: { cynwell: 'q1w2e3r4' },
		}),
		controller.viewAdmin
	);

	app.post('/vote', controller.vote);

	app.post('/disableResult', controller.disableResult);

	app.post('/disableVote', controller.disableVote);

	app.get('/error', controller.notFound);
};

module.exports = routes;
