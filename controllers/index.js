module.exports = (io, db) => {
	const result = function (_req, res) {
		try {
			const callBack = (error, results) => {
				if (error) throw error;
				let result = {
					allVotes: results,
				};
				res.render('pages/result', result);
			};

			db.polls.selectVotes(callBack, io);
		} catch (e) {
			throw `ERROR FOUND! ERROR IS : ${e}`;
		}
	};

	const vote = function (req, res) {
		try {
			const values = req.body;
			const callBack = (error, results) => {
				if (error) throw error;
				res.cookie('voted', true);
				res.redirect(301, '/result');
			};
			db.polls.postVote(callBack, values, io);
		} catch (e) {
			throw `ERROR FOUND! ERROR IS : ${e}`;
		}
	};

	const viewMale = function (req, res) {
		const voted = req.cookies['voted'];
		if (voted) res.redirect('/result');
		res.render('pages/male');
	};

	const viewFemale = function (req, res) {
		const voted = req.cookies['voted'];
		if (voted) res.redirect('/result');
		res.render('pages/female');
	};

	const viewGroup = function (req, res) {
		const voted = req.cookies['voted'];
		if (voted) res.redirect('/result');
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
