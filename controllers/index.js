module.exports = (io, db) => {
	const candidates = {
		0: { votes: 0, label: 'Male 1', color: randomRGB() },
		1: { votes: 0, label: 'Male 2', color: randomRGB() },
		2: { votes: 0, label: 'Male 3', color: randomRGB() },
		3: { votes: 0, label: 'Male 4', color: randomRGB() },
		4: { votes: 0, label: 'Male 5', color: randomRGB() },
	};
	function randomRGB() {
		const r = () => (Math.random() * 256) >> 0;
		return `rgb(${r()}, ${r()}, ${r()})`;
	}

	const result = function (_req, res) {
		io.on(`connection`, (socket) => {
			io.emit('update', candidates);
			socket.on('vote', (i) => {
				if (candidates[i]) candidates[i].votes += 1;
				console.log(candidates);
				io.emit('update', candidates);
			});
		});

		const callBack = (error, results) => {
			if (error) throw error;
			let result = {
				allVotes: results,
			};
			res.render('pages/result', result);
		};

		db.polls.selectVotes(callBack, null);
	};

	const vote = function (req, res) {
		const values = req.body;

		const callBack = (error, _results) => {
			if (error) throw error;
			res.redirect(301, '/result');
		};
		db.polls.postVote(callBack, values);
	};

	const viewMale = function (req, res) {
		res.render('pages/male');
	};

	const viewFemale = function (req, res) {
		res.render('pages/female');
	};

	const viewGroup = function (req, res) {
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
