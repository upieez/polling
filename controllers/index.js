module.exports = (io, db) => {
	const result = function (_req, res) {
		const callBack = (error, results) => {
			if (error) throw error;
			let result = {
				allVotes: results,
			};
			res.render('pages/result', result);
		};

		db.polls.selectVotes(callBack, io);
	};

	const vote = function (req, res) {
		// io.on(`connection`, (socket) => {});
		const values = req.body;

		const callBack = (error, _results) => {
			if (error) throw error;
			res.redirect(301, '/result');
		};
		db.polls.postVote(callBack, values);
	};

	const viewMale = function (_req, res) {
		res.render('pages/male');
	};

	const viewFemale = function (_req, res) {
		res.render('pages/female');
	};

	const viewGroup = function (_req, res) {
		res.render('pages/group');
	};

	return {
		result,
		vote,
		viewMale,
		viewFemale,
		viewGroup,
	};
};
