module.exports = (db) => {
	let postVote = (callback, data) => {
		db.getConnection(function (err, connection) {
			if (err) throw err; // not connected!
			console.log('this is in DATA', data);

			connection.query(
				'UPDATE polls SET Vote = Vote + 1 WHERE User = "FirstMale"',
				function (error, results) {
					// When done with the connection, release it.
					connection.release();
					callback(results);
					// Handle error after the release.
					if (error) throw error;
					// Do not use anything here and below
				}
			);
		});
	};

	return {
		postVote,
	};
};
