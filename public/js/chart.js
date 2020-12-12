// Initialize the canvas
const maleCtx = document.getElementById('voteMale').getContext('2d');
const femaleCtx = document.getElementById('voteFemale').getContext('2d');
const groupCtx = document.getElementById('voteGroup').getContext('2d');
const tableContainer = document.getElementById('table-container');

const options = {
	maintainAspectRatio: false,
	scales: {
		yAxes: [
			{
				gridLines: {
					display: false,
				},
				ticks: { precision: 0, fontSize: 16 },
			},
		],
		xAxes: [
			{
				ticks: { fontSize: 16 },
			},
		],
	},
};

// Initialize the chart
const femaleChart = new Chart(femaleCtx, {
	type: 'bar',
	data: {
		labels: ['Female'],
	},
	options: options,
});

const maleChart = new Chart(maleCtx, {
	type: 'bar',
	data: {
		labels: ['Male'],
	},
	options: options,
});

const groupChart = new Chart(groupCtx, {
	type: 'bar',
	data: {
		labels: ['Family'],
	},
	options: options,
});

const socket = io();

// On new vote update the chart
socket.on('update', (candidates) => {
	let femaleUser = candidates.filter(
		(candidate) =>
			candidate.User === 'FirstFemale' ||
			candidate.User === 'SecondFemale' ||
			candidate.User === 'ThirdFemale'
	);
	let maleUser = candidates.filter(
		(candidate) =>
			candidate.User === 'FirstMale' ||
			candidate.User === 'SecondMale' ||
			candidate.User === 'ThirdMale'
	);
	let groupUser = candidates.filter(
		(candidate) =>
			candidate.User === 'FirstGroup' ||
			candidate.User === 'SecondGroup' ||
			candidate.User === 'ThirdGroup'
	);

	femaleUser = Object.entries(femaleUser);
	maleUser = Object.entries(maleUser);
	groupUser = Object.entries(groupUser);

	for (const [key, candidate] of femaleUser) {
		// Update the vote if the candidate already exists if not create a new candidate and then update the vote

		let contestantName;
		if (candidate.User === 'FirstFemale') contestantName = 'Female A';
		if (candidate.User === 'SecondFemale') contestantName = 'Female B';
		if (candidate.User === 'ThirdFemale') contestantName = 'Female C';

		let color = [
			'rgba(207, 21, 120, 1)',
			'rgba(232, 210, 29, 1)',
			'rgba(178, 2, 56, 1)',
		];

		if (
			typeof femaleChart.data.datasets[key] == 'undefined' &&
			femaleChart.data.datasets.length < candidates.length
		) {
			femaleChart.data.datasets.push({
				backgroundColor: color[key],
				borderColor: color[key],
				data: [candidate.Vote],
				label: contestantName,
			});
		} else if (typeof femaleChart.data.datasets[key] != 'undefined') {
			femaleChart.data.datasets[key].data = [candidate.Vote];
		}
	}

	// For each candidate
	for (const [key, candidate] of maleUser) {
		// Update the vote if the candidate already exists if not create a new candidate and then update the vote

		let contestantName;
		if (candidate.User === 'FirstMale') contestantName = 'Male A';
		if (candidate.User === 'SecondMale') contestantName = 'Male B';
		if (candidate.User === 'ThirdMale') contestantName = 'Male C';

		let color = [
			'rgba(239, 157, 16, 1)',
			'rgba(241, 60, 32, 1)',
			'rgba(30, 39, 97, 1)',
		];

		if (
			typeof maleChart.data.datasets[key] == 'undefined' &&
			maleChart.data.datasets.length < candidates.length
		) {
			maleChart.data.datasets.push({
				backgroundColor: color[key],
				borderColor: color[key],
				data: [candidate.Vote],
				label: contestantName,
			});
		} else if (typeof maleChart.data.datasets[key] != 'undefined') {
			maleChart.data.datasets[key].data = [candidate.Vote];
		}
	}

	for (const [key, candidate] of groupUser) {
		// Update the vote if the candidate already exists if not create a new candidate and then update the vote

		let contestantName;
		if (candidate.User === 'FirstGroup') contestantName = 'Family A';
		if (candidate.User === 'SecondGroup') contestantName = 'Family B';
		if (candidate.User === 'ThirdGroup') contestantName = 'Family C';

		let color = [
			'rgba(174, 214, 220, 1)',
			'rgba(255, 154, 141, 1)',
			'rgba(119, 197, 147, 1)',
		];

		if (
			typeof groupChart.data.datasets[key] == 'undefined' &&
			groupChart.data.datasets.length < candidates.length
		) {
			groupChart.data.datasets.push({
				backgroundColor: color[key],
				borderColor: color[key],
				data: [candidate.Vote],
				label: contestantName,
			});
		} else if (typeof groupChart.data.datasets[key] != 'undefined') {
			groupChart.data.datasets[key].data = [candidate.Vote];
		}
	}

	// Update the chart
	femaleChart.update();
	maleChart.update();
	groupChart.update();

	/**
	 * maybe separate the logic here? might cause an issue
	 */

	const femaleDataArray = femaleChart.data.datasets;
	const maleDataArray = maleChart.data.datasets;
	const groupDataArray = groupChart.data.datasets;

	const xAxis = ['Contestants', 'Votes'];
	const yAxis = [...femaleDataArray, ...maleDataArray, ...groupDataArray];

	const tableHeader = `<tr>${xAxis.reduce((memo, entry) => {
		memo += `<th scope="col">${entry}</th>`;
		return memo;
	}, '')}</tr>`;

	const tableBody = yAxis.reduce((memo, entry) => {
		const rows = entry.data.reduce((memo, entry) => {
			memo += `<td>${entry}</td>`;
			return memo;
		}, '');

		memo += `<tr><td>${entry.label}</td>${rows}</tr>`;

		return memo;
	}, '');

	const table = `<table class="table table-hover col-lg-6 col-xl-6">
	<thead>${tableHeader}</thead>
	<tbody>${tableBody}</tbody>
	</table>`;

	tableContainer.innerHTML = table;
});
