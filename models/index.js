module.exports = (db) => {
	let postVote = (callback, values) => {
		db.getConnection(function (err, connection) {
			if (err) throw err; // not connected!

			let query = 'UPDATE polls SET Vote = Vote + 1 WHERE User = ?';
			let value = [values.user];

			connection.query(query, value, function (error, results) {
				// When done with the connection, release it.
				connection.destroy();
				callback(null, results);
				// Handle error after the release.
				if (error) throw error;
				// Do not use anything here and below
			});
		});
	};

	return {
		postVote,
	};
};
