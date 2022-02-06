/** @format */

const Board = function () {
	// 10x10 board
	const board = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];

	const ships = [];

	/**
	 *
	 * @param {object} ship - Ship object
	 */
	function addShip(ship) {
		if (ships.length === 5) {
			throw new Error("You can't add more than 5 ships");
		} else {
			for (let i = 0; i < ship.coords.length; i++) {
				let row = ship.coords[i][0];
				let col = ship.coords[i][1];
				if (board[row][col] !== 0) {
					throw new Error("Ship cannot be placed on top of another ship");
				} else {
					board[row][col] = ship;
				}
			}
			ships.push(ship);
		}
	}

	function receiveAttack(coords) {
		let row = coords[0];
		let col = coords[1];
		let ship = board[row][col];
		if (typeof ship === "object") {
			ship.hit([row, col]);
			// Publish event - PubSub.publish(shipHit, coords)
		} else if (ship === 0) {
			board[row][col] = -1;
			// Publish event - PubSub.publish(miss, coords)
		}

		if (ships.every((ship) => ship.isSunk())) {
			// Publish event - PubSub.publish(gameOver)
		}
	}
	return { board, addShip, receiveAttack };
};

module.exports = Board;
