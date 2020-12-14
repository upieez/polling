module.exports = (io, db) => {
	const result = function (_req, res) {
		try {
			const callBack = (error, results) => {
				if (error) throw error;

				const disableResult = results.find(
					(result) => result.User === 'disableResult'
				);

				if (disableResult.Vote) {
					res.redirect('/thankyou');
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
					return res.redirect(301, '/result');
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
		try {
			const callBack = (error, results) => {
				if (error) throw error;

				const displayFinalResult = results.find(
					(result) => result.User === 'displayFinalResult'
				);

				if (displayFinalResult.Vote) {
					res.redirect('/winner');
				}

				res.render('pages/thankyou');
			};

			db.polls.selectVotes(callBack, io);
		} catch (e) {
			throw `ERROR FOUND! ERROR IS : ${e}`;
		}
	};

	const viewWinner = function (_req, res) {
		try {
			const callBack = (error, results) => {
				if (error) throw error;

				const displayFinalResult = results.find(
					(result) => result.User === 'displayFinalResult'
				);

				const contestants = results.reduce(
					(acc, value) => {
						if (
							value.User === 'FirstMale' ||
							value.User === 'SecondMale' ||
							value.User === 'ThirdMale'
						) {
							if (value.User === 'FirstMale') value.name = ['Male A', 'male1'];
							if (value.User === 'SecondMale') value.name = ['Male B', 'male2'];
							if (value.User === 'ThirdMale') value.name = ['Male C', 'male3'];

							acc.male.push(value);
						}

						if (
							value.User === 'FirstFemale' ||
							value.User === 'SecondFemale' ||
							value.User === 'ThirdFemale'
						) {
							if (value.User === 'FirstFemale')
								value.name = ['Female A', 'female1'];
							if (value.User === 'SecondFemale')
								value.name = ['Female B', 'female2'];
							if (value.User === 'ThirdFemale')
								value.name = ['Female C', 'female3'];
							acc.female.push(value);
						}
						if (
							value.User === 'FirstGroup' ||
							value.User === 'SecondGroup' ||
							value.User === 'ThirdGroup'
						) {
							if (value.User === 'FirstGroup')
								value.name = ['Family A', 'group1'];
							if (value.User === 'SecondGroup')
								value.name = ['Family B', 'group2'];
							if (value.User === 'ThirdGroup')
								value.name = ['Family C', 'group3'];
							acc.group.push(value);
						}
						return acc;
					},
					{ male: [], female: [], group: [] }
				);

				contestants.male.sort((a, b) => (a.Vote < b.Vote ? 1 : -1));
				contestants.female.sort((a, b) => (a.Vote < b.Vote ? 1 : -1));
				contestants.group.sort((a, b) => (a.Vote < b.Vote ? 1 : -1));

				if (displayFinalResult.Vote) {
					res.render('pages/winner', { contestants: contestants });
				} else {
					res.redirect('/error');
				}
			};

			db.polls.selectVotes(callBack);
		} catch (e) {
			throw `ERROR FOUND! ERROR IS : ${e}`;
		}
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

	const viewClient = function (req, res) {
		try {
			const callBack = (error, results) => {
				if (error) throw error;
				let result = {
					allVotes: results,
				};

				res.render('pages/client', result);
			};

			db.polls.selectVotes(callBack, io);
		} catch (e) {
			throw `ERROR FOUND! ERROR IS : ${e}`;
		}
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

	const enableFinalResult = function (req, res) {
		const callBack = (error, _results) => {
			if (error) throw error;
			io.emit('reload'); // io emits here as it is not rendering a page with a socket io
			res.status(200);
			res.send('OK');
		};

		db.polls.enableFinalResult(callBack);
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
		viewClient,
		enableFinalResult,
	};
};
