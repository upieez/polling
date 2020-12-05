module.exports = (db) => {
	const selectVotes = (callback, io) => {
		db.getConnection(function (err, connection) {
			if (err) throw err; // not connected!

			let query = 'SELECT * FROM polls';

			connection.query(query, function (error, results) {
				io.on(`connection`, (_socket) => {
					io.emit('update', results);
				});
				connection.release();
				callback(null, results);
				// Handle error after the release.
				if (error) throw error;
				// Do not use anything here
			});
		});
	};

	const postVote = (callback, values, io) => {
		db.getConnection(function (err, connection) {
			if (err) throw err; // not connected!

			let query = 'UPDATE polls SET Vote = Vote + 1 WHERE User = ?';
			let value = [values.user];

			connection.query(query, value, function (error, results) {
				connection.query('SELECT * FROM polls', function (error, results) {
					io.on(`connection`, (_socket) => {
						io.emit('update', results);
					});

					if (error) throw error;
				});
				connection.release();
				callback(null, results);
				// Handle error after the release.
				if (error) throw error;
				// Do not use anything here and below
			});
		});
	};

	return {
		selectVotes,
		postVote,
	};
};
