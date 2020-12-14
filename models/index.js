module.exports = (db) => {
	let beforeUpdatedResult;

	const selectVotes = (callback, io) => {
		db.getConnection((err, connection) => {
			if (err) throw `DATABASE NOT CONNECTED: ${err}`; // not connected!

			let query = 'SELECT * FROM polls';

			connection.query(query, (error, results) => {
				beforeUpdatedResult = results;
				if (io) {
					io.on(`connection`, (_socket) => {
						io.emit('update', results);
					});
				}
				connection.release();
				// Handle error after the release.
				error ? callback(error, null) : callback(null, results);
				// Do not use anything here
			});
		});
	};

	const postVote = (callback, values, io) => {
		db.getConnection(function (err, connection) {
			if (err) throw `DATABASE NOT CONNECTED: ${err}`; // not connected!

			let query = 'UPDATE polls SET Vote = Vote + 1 WHERE User = ?';
			let value = [values.user];

			connection.query(query, value, (error, results) => {
				connection.query('SELECT * FROM polls', (_e, selectResults) => {
					io.emit('update', beforeUpdatedResult);
					io.emit('update', selectResults);
				});

				connection.release();
				// Handle error after the release.
				error ? callback(error, null) : callback(null, results);
				// Do not use anything here and below
			});
		});
	};

	const disableResult = (callback, _values) => {
		db.getConnection(function (err, connection) {
			if (err) throw `DATABASE NOT CONNECTED: ${err}`; // not connected!

			let query = 'UPDATE polls SET Vote = 1 WHERE User = "disableResult"';

			connection.query(query, (error, results) => {
				connection.release();
				// Handle error after the release.
				error ? callback(error, null) : callback(null, results);
				// Do not use anything here and below
			});
		});
	};

	const disableVote = (callback, _values) => {
		db.getConnection(function (err, connection) {
			if (err) throw `DATABASE NOT CONNECTED: ${err}`; // not connected!

			let query = 'UPDATE polls SET Vote = 1 WHERE User = "disableVote"';

			connection.query(query, (error, results) => {
				connection.release();
				// Handle error after the release.
				error ? callback(error, null) : callback(null, results);
				// Do not use anything here and below
			});
		});
	};

	const enableFinalResult = (callback, _values) => {
		db.getConnection(function (err, connection) {
			if (err) throw `DATABASE NOT CONNECTED: ${err}`; // not connected!

			let query = 'UPDATE polls SET Vote = 1 WHERE User = "displayFinalResult"';

			connection.query(query, (error, results) => {
				connection.release();
				// Handle error after the release.
				error ? callback(error, null) : callback(null, results);
				// Do not use anything here and below
			});
		});
	};

	return {
		selectVotes,
		postVote,
		disableResult,
		disableVote,
		enableFinalResult,
	};
};
