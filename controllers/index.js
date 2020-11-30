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

	const demo = function (_req, res) {
		io.on(`connection`, (socket) => {
			io.emit('update', candidates);
			socket.on('vote', (i) => {
				if (candidates[i]) candidates[i].votes += 1;
				console.log(candidates);
				io.emit('update', candidates);
			});
		});

		res.render('result');
	};

	const second = function (_req, res) {
		res.render('pages/male');
	};

	const voteMale = function (req, res) {
		let values = req.body;

		let callBack = (error, _results) => {
			if (error) throw error;
			res.redirect(301, '/result');
		};
		db.polls.postVote(callBack, values);
	};

	return {
		demo,
		second,
		voteMale,
	};
};
