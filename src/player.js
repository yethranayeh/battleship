/** @format */

const Player = function (playerName, computer) {
	if (/^computer$/i.test(playerName)) {
		throw new Error("Computer player name is reserved");
	}
	let name = playerName || (computer ? "Computer" : "Player");

	/**
	 *
	 * @param {object} enemy - Enemy Player object
	 * @param {array} coords - Coordinates to attack on enemy board
	 */
	function attack(enemy, coords) {
		enemy.board.receiveAttack(coords);
	}

	/**
	 *
	 * @param {number} max - Return random number between 0 and max. Max not inclusive!
	 * @returns {number}
	 */
	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	const previouslyHit = {};

	/**
	 *
	 * @returns {array} - Random coordinates to attack on enemy board
	 */
	function nextAttackCoords() {
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

	/**
	 * Takes ship length as argument and returns randomized arrays of coordinates in an array
	 * @param {number} shipLength - Length of the ship object to place on board
	 * @returns {array} - Array of arrays. Random coordinates to place ship on board
	 */
	function randomShipCoords(shipLength) {
		let row = getRandomInt(10);
		let col = getRandomInt(10);
		let direction = ["horizontal", "vertical"][getRandomInt(2)];
		let coords = [];
		if (direction === "horizontal") {
			// While the ship's length is greater than the board's width, generate new coordinates
			while (col + shipLength > 10) {
				col = getRandomInt(10);
			}
			for (let i = 0; i < shipLength; i++) {
				coords.push([row, col + i]);
			}
		} else if (direction === "vertical") {
			// While the ship's height is greater than the board's height, generate new coordinates
			while (row + shipLength > 10) {
				row = getRandomInt(10);
			}

			for (let i = 0; i < shipLength; i++) {
				coords.push([row + i, col]);
			}
		}
		return coords;
	}

	function getRandomCoords(shipLength) {
		let coords = randomShipCoords(shipLength);
		while (coords.some((coord) => this.board.isOccupied(coord))) {
			coords = randomShipCoords(shipLength);
		}
		return coords;
	}

	let obj = { name, attack };
	if (computer === true) {
		obj.nextAttackCoords = nextAttackCoords;
		obj.getRandomCoords = getRandomCoords;
	}
	return obj;
};

module.exports = Player;
