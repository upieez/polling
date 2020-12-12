const disableResultBtn = document.getElementById('disable-result');
const disableVoteBtn = document.getElementById('disable-vote');
const enableFinalResultBtn = document.getElementById('enable-final-result');

disableResultBtn.addEventListener('click', async (_) => {
	try {
		if (confirm('Do you want to disable result?') === true) {
			const response = await fetch('/disableResult', {
				method: 'post',
			});
			console.log('Completed!', response);
		}
	} catch (err) {
		console.error(`Error: ${err}`);
	}
});

disableVoteBtn.addEventListener('click', async (_) => {
	try {
		if (confirm('Do you want to disable vote?') === true) {
			const response = await fetch('/disableVote', {
				method: 'post',
			});
			console.log('Completed!', response);
		}
	} catch (err) {
		console.error(`Error: ${err}`);
	}
});

enableFinalResultBtn.addEventListener('click', async (_) => {
	try {
		if (confirm('Do you want to enable final result?') === true) {
			const response = await fetch('/enableFinalResult', {
				method: 'post',
			});
			console.log('Completed!', response);
		}
	} catch (err) {
		console.error(`Error: ${err}`);
	}
});
