// Initialize the canvas
const ctx = document.getElementById('voteChart').getContext('2d');

// Initialize the chart
const chart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: ['Candidates'],
	},
	options: {},
});

// Connect to the server it's (Here you want to change the port if you changed it in the server)
const socket = io('http://localhost:8000');

// On new vote update the chart
socket.on('update', (candidates) => {
	// Convert the candidates object into an array
	candidates = Object.entries(candidates);

	// For each candidate
	for (const [key, candidate] of candidates) {
		// Update the vote if the candidate already exists if not create a new candidate and then update the vote
		if (
			typeof chart.data.datasets[key] == 'undefined' &&
			chart.data.datasets.length < candidates.length
		) {
			chart.data.datasets.push({
				backgroundColor: candidate.color,
				borderColor: candidate.color,
				data: [candidate.votes],
				label: candidate.label,
			});
		} else if (typeof chart.data.datasets[key] != 'undefined') {
			chart.data.datasets[key].data = [candidate.votes];
		}
	}

	// Update the chart
	chart.update();
});

// Make a new vote (Remember this is not a safe way to do this)
function vote(index) {
	socket.emit('vote', index);
}
