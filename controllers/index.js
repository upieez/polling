module.exports = (io, db) => {
	const result = function (_req, res) {
		try {
			const callBack = (error, results) => {
				if (error) throw error;

				const disableResult = results.find(
					(result) => result.User === 'disableResult'
				);

				if (disableResult.Vote) {
					res.render('pages/thankyou');
				}

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
					return res.redirect(301, '/thankyou');
				}

				return res.redirect(301, '/thankyou'); // FALLBACK
			};
			db.polls.postVote(callBack, values, io);
		} catch (e) {
			throw `ERROR FOUND! ERROR IS : ${e}`;
		}
	};

	const viewFemale = function (req, res) {
		const voted = req.cookies['votedFemale'];
		if (voted) return res.redirect('/thankyou');
		db.polls.selectVotes((error, results) => {
			if (error) throw error;

			const disableVote = results.find(
				(result) => result.User === 'disableVote'
			);

			!disableVote.Vote
				? res.render('pages/female', results)
				: res.redirect(301, '/thankyou');
		}, io);
	};

	const viewMale = function (req, res) {
		const voted = req.cookies['votedMale'];
		if (voted) return res.redirect('/thankyou');
		db.polls.selectVotes((error, results) => {
			if (error) throw error;

			const disableVote = results.find(
				(result) => result.User === 'disableVote'
			);

			!disableVote.Vote
				? res.render('pages/male', results)
				: res.redirect(301, '/thankyou');
		}, io);
	};

	const viewGroup = function (req, res) {
		const voted = req.cookies['votedGroup'];
		if (voted) return res.redirect('/thankyou');
		db.polls.selectVotes((error, results) => {
			if (error) throw error;

			const disableVote = results.find(
				(result) => result.User === 'disableVote'
			);

			!disableVote.Vote
				? res.render('pages/group', results)
				: res.redirect(301, '/thankyou');
		}, io);
	};

	const viewGratitude = function (_req, res) {
		res.render('pages/thankyou');
	};

	const viewWinner = function (_req, res) {
		res.render('pages/winner');
	};

	const notFound = function (_req, res) {
		res.status(404);
		res.render('pages/404');
	};

	const disableResult = function (req, res) {
		const callBack = (error, _results) => {
			if (error) throw error;
			io.emit('reload'); // io emits here as it is not rendering a page with a socket io
			res.status(200);
			res.send('OK');
		};

		db.polls.disableResult(callBack);
	};

	const disableVote = function (req, res) {
		const callBack = (error, _results) => {
			if (error) throw error;
			res.status(200);
			res.send('OK');
		};

		db.polls.disableVote(callBack);
	};

	const viewAdmin = function (req, res) {
		try {
			const callBack = (error, results) => {
				if (error) throw error;
				let result = {
					allVotes: results,
				};

				res.render('pages/admin', result);
			};

			db.polls.selectVotes(callBack, io);
		} catch (e) {
			throw `ERROR FOUND! ERROR IS : ${e}`;
		}
	};

	return {
		result,
		vote,
		viewMale,
		viewFemale,
		viewGroup,
		viewWinner,
		viewAdmin,
		notFound,
		viewGratitude,
		disableResult,
		disableVote,
	};
};
