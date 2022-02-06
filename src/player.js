/** @format */

const Player = function (playerName, computer) {
	let name = playerName || (computer ? "Computer" : "Player");

	function attack(enemy, coords) {
		enemy.board.receiveAttack(coords);
	}

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	const previouslyHit = {};

	function nextMove() {
		let row = getRandomInt(10);
		let col = getRandomInt(10);
		if (!previouslyHit[`${row}-${col}`]) {
			previouslyHit[`${row}-${col}`] = true;
			return [row, col];
		} else {
			while (previouslyHit[`${row}-${col}`]) {
				row = getRandomInt(10);
				col = getRandomInt(10);
			}
		}
	}

	let obj = { name, attack };
	if (computer === true) {
		obj.nextMove = nextMove;
	}
	return obj;
};

module.exports = Player;
