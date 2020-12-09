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

			const callBack = (error, _results) => {
				if (error) throw error;

				if (values.female) {
					res.cookie('votedFemale', true);
					return res.redirect(301, '/male');
				}

				if (values.male) {
					res.cookie('votedMale', true);
					return res.redirect(301, '/group');
				}

				if (values.group) {
					res.cookie('votedGroup', true);
					return res.redirect(301, '/result');
				}

				return res.redirect(301, '/result'); // FALLBACK
			};
			db.polls.postVote(callBack, values, io);
		} catch (e) {
			throw `ERROR FOUND! ERROR IS : ${e}`;
		}
	};

	const viewMale = function (req, res) {
		const voted = req.cookies['votedMale'];
		if (voted) return res.redirect('/result');
		db.polls.selectVotes((error, results) => {
			if (error) throw error;

			const allowVote = results.filter((result) => result.User === 'admin');

			allowVote[0].Vote === 0
				? res.render('pages/male', results)
				: res.redirect(301, '/result');
		}, io);
	};

	const viewFemale = function (req, res) {
		const voted = req.cookies['votedFemale'];
		if (voted) return res.redirect('/result');
		db.polls.selectVotes((error, results) => {
			if (error) throw error;

			const allowVote = results.filter((result) => result.User === 'admin');

			allowVote[0].Vote === 0
				? res.render('pages/female', results)
				: res.redirect(301, '/result');
		}, io);
	};

	const viewGroup = function (req, res) {
		const voted = req.cookies['votedGroup'];
		if (voted) return res.redirect('/result');
		db.polls.selectVotes((error, results) => {
			if (error) throw error;

			const allowVote = results.filter((result) => result.User === 'admin');

			allowVote[0].Vote === 0
				? res.render('pages/group', results)
				: res.redirect(301, '/result');
		}, io);
	};

	const viewWinner = function (_req, res) {
		res.render('pages/winner', { deck: deck });
	};

	const notFound = function (_req, res) {
		res.status(404);
		res.render('pages/404');
	};

	return {
		result,
		vote,
		viewMale,
		viewFemale,
		viewGroup,
		viewWinner,
		notFound,
	};
};
