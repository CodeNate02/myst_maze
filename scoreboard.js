class HighScores {
	scores = {};
	constructor() {
		try {
			this.scores = JSON.parse(localStorage.getItem('highScores')) || [];
		} catch {
			console.warn('Storage of local high scores failed!');
		}
	}
	addTime(newTime, mazeID) {
		if (!this.scores[mazeID]) this.scores[mazeID] = [];
		this.scores[mazeID].push(newTime);
		this.scores[mazeID].sort((a, b) => a - b); //Sort scores from greatest to least
		while (this.scores[mazeID].length > 10) {
			//Pop highest time if the scoreboard is full
			this.scores[mazeID].pop();
		}
		for (let key of Object.keys(this.scores)) {
            console.log(key);
			console.log(
				`Your best times for ${key}: \n`,
				...this.scores[key].map(
					(item, index) => `${index + 1}: ${formatTime(item)} \n`
				)
			);
		}
		try {
			localStorage.setItem('highScores', JSON.stringify(this.scores));
		} catch {
			console.warn('Storage of local high scores failed!');
		}
	}
}
export function formatTime(time) {
	let minutes = Math.floor(time / 60);
	let seconds = time % 60;
	return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export const Scores = new HighScores();
